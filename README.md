# Git Release Commit Tags

Tool to add a release tag to all release commits

### Get started

Install node_modules

```
npm install
```

### Execute Tool

The tool can be executed like this:

```
npm start -- --baseDir=<PROJECT_DIR> --pattern=<COMMIT_MESSAGE_REGEX> --repository=<GITHUB_REPO_URL> --createReleases=true|false --token=<GITHUB_TOKEN>
```

#### Command description

| Option             | What it does                                                                   |
| ------------------ | ------------------------------------------------------------------------------ |
| `--baseDir`        | Path to the local git repository                                               |
| `--pattern`        | Regex-Pattern to find release commits                                          |
| `--repository`     | Path to the GitHub repository                                                  |
| `--createReleases` | Wether it should create releases for each tag in the GitHub repository         |
| `--token`          | Only needed if `--createReleases` is set to true. Token with repository access |
|                    |                                                                                |
