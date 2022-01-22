import simpleGit, { SimpleGit } from "simple-git";

const tagReleaseCommits = () => {
  const baseDir = process.argv.slice(2)[0];
  console.log("BaseDir: " + baseDir);
  const git: SimpleGit = simpleGit({
    baseDir,
  });
  const commits = git.log({}, (result) => {
    console.log(result);
  });
};

tagReleaseCommits();
