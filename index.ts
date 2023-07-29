#!/usr/bin/env ts-node
import { config } from "dotenv";
import {
  getOctokitInstance,
  getLabels,
  getIssues,
  getIssuesWithLabel,
  displayGoodFirstIssues,
  getRepos,
} from "./utils";

config();

config();

const main = async (entities) => {
  const octokit = getOctokitInstance(process.env.ACCESS_TOKEN!);
  let totalGoodFirstIssues = 0;

  for (let entity of entities) {
    if (entity.org) {
      const repos = await getRepos(octokit, entity.org);
      for (let repo of repos) {
        totalGoodFirstIssues += await processRepo(octokit, {
          owner: repo.owner.login,
          repo: repo.name,
        });
      }
    } else if (entity.repo) {
      totalGoodFirstIssues += await processRepo(octokit, entity.repo);
    }
  }

  console.log(
    `Total good first issues across all orgs/repos: ${totalGoodFirstIssues}`
  );
};

const processRepo = async (octokit, repo) => {
  try {
    const labels = await getLabels(octokit, repo);
    const issues = await getIssues(octokit, repo);
    const goodFirstIssuesCount = getIssuesWithLabel(
      issues,
      "good first issue"
    ).length;

    console.log(`Repo: ${repo.owner}/${repo.repo}`);
    console.log(
      "Good first issue count:",
      `${goodFirstIssuesCount}/${issues.length}`
    );
    displayGoodFirstIssues(issues, "good first issue");

    return goodFirstIssuesCount;
  } catch (error) {
    console.error(`Error processing repo ${repo.owner}/${repo.repo}:`, error);
    return 0;
  }
};

const entities = [
  { org: "semaphore-protocol" },
  { org: "Unirep" },
  { org: "Rate-Limiting-Nullifier" },
  { org: "privacy-scaling-explorations" },
  // { repo: { owner: "privacy-scaling-explorations", repo: "maci" } },
  // { repo: { owner: "privacy-scaling-explorations", repo: "zkevm-circuits" } },
  // Add orgs and repos here
];

main(entities);
