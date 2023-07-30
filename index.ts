#!/usr/bin/env ts-node
import { config } from "dotenv";
import {
  getOctokitInstance,
  getRepos,
  processRepo,
} from "./utils";
import * as fs from 'fs';
import * as path from 'path';

config();

const main = async (entities) => {
  const octokit = getOctokitInstance(process.env.ACCESS_TOKEN!);
  const result = [];

  for (let entity of entities) {
    if (entity.org) {
      const repos = await getRepos(octokit, entity.org);
      for (let repo of repos) {
        const { count, issues, totalOpenIssues } = await processRepo(octokit, {
          owner: repo.owner.login,
          repo: repo.name,
        });
        result.push({
          repo: `${repo.owner.login}/${repo.name}`,
          count,
          totalOpenIssues,
          url: repo.html_url,
          issues,
        });
      }
    } else if (entity.repo) {
      const { count, issues, totalOpenIssues } = await processRepo(octokit, entity.repo);
      result.push({
        repo: `${entity.repo.owner}/${entity.repo.repo}`,
        count,
        totalOpenIssues,
        url: `https://github.com/${entity.repo.owner}/${entity.repo.repo}`,
        issues,
      });
    }
  }

  const outputDir = path.join(__dirname, 'out');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  fs.writeFileSync(path.join(outputDir, 'pse-gfis.json'), JSON.stringify(result, null, 2));
  console.log(`Results written to ${path.join(outputDir, 'pse-gfis.json')}`);
};

const entities = [
  { org: "semaphore-protocol" },
  { org: "Unirep" },
  { org: "Rate-Limiting-Nullifier" },
  // { org: "privacy-scaling-explorations" },
  // { repo: { owner: "privacy-scaling-explorations", repo: "maci" } },
  // Add more orgs and repos here
];

main(entities);
