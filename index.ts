import axios from "axios";
import { exec } from "child_process";
import minimist from "minimist";
import gh from "parse-github-url";
import { promisify } from "util";
import { Commit } from "./models/commit";

const execAsync = promisify(exec);

const getReleaseCommits = async (
  baseDir: string,
  pattern: string
): Promise<Commit[]> => {
  const command = `git log --grep="${pattern}" --all --full-history --pretty=format:"%ad,%H,%ae,%s"`;
  const logResult = await execAsync(command, { cwd: baseDir });
  return logResult.stdout.split("\n").map((result) => {
    const data = result.split(",");
    return {
      date: data[0],
      hash: data[1],
      author: data[2],
      subject: data[3],
      version: data[3].match(/\d\.\d\.\d/)?.toString() ?? "",
    } as Commit;
  });
};

const tagCommit = async (commit: Commit, baseDir: string) => {
  const command = `git tag -a v${commit.version} ${commit.hash} -m "${commit.subject}"`;
  await execAsync(command, {
    cwd: baseDir,
    env: {
      GIT_COMMITTER_DATE: commit.date,
    },
  });
};

const createRelease = async (
  commit: Commit,
  repository: string,
  token: string
) => {
  const result = gh(repository);
  if (!result?.repo) {
    throw new Error("Could not detect the name of the repository");
  }
  await axios.post(
    `https://api.github.com/repos/${result.repo}/releases`,
    {
      tag_name: `v${commit.version}`,
      target_commitish: commit.hash,
      name: `Markdown Checkbox v${commit.version}`,
      body: `Find Changelog here: ${repository}/blob/main/CHANGELOG.md`,
    },
    {
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );
};

const main = async () => {
  const args = minimist<{
    _: unknown[];
    baseDir: string;
    pattern: string;
    repository: string;
    createReleases: string;
    token: string;
  }>(process.argv.slice(2));

  const commits = await getReleaseCommits(args.baseDir, args.pattern);

  for (const commit of commits) {
    await tagCommit(commit, args.baseDir);
    if (!!args.createReleases) {
      await createRelease(commit, args.repository, args.token);
    }
  }
};

await main();
