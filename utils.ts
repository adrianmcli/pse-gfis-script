import { Octokit } from "octokit";

type Repo = { owner: string; repo: string };

export const getOctokitInstance = (token: string) =>
  new Octokit({ auth: token });

export const getRepos = async (octokit: Octokit, org: string) => {
  const { data } = await octokit.request("GET /orgs/{org}/repos", {
    org,
  });
  return data;
};

export const getIssues = async (octokit: Octokit, repo: Repo) => {
  const { data } = await octokit.request(
    "GET /repos/{owner}/{repo}/issues",
    repo
  );
  return data;
};

export const getLabels = async (octokit: Octokit, repo: Repo) => {
  const { data } = await octokit.request(
    "GET /repos/{owner}/{repo}/labels",
    repo
  );
  return data;
};

export const getIssuesWithLabel = (issues, target) => {
  return issues.filter((issue) =>
    issue.labels.map((label) => label.name).includes(target)
  );
};

export const displayGoodFirstIssues = (issues, target) => {
  const goodFirstIssues = getIssuesWithLabel(issues, target);
  goodFirstIssues.forEach((issue) => {
    console.log(`Issue Title: ${issue.title}`);
    console.log(`Issue URL: ${issue.html_url}`);
  });
};
