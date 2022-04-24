import { defaultRepository, runGh } from "./util.ts";
import type { PullRequest, Repository } from "./pull_request.ts";

export async function getPullRequest(
  options: {
    repo?: Repository;
    state?: "all" | "closed" | "merged" | "open";
    cwd?: string;
  },
): Promise<PullRequest[]> {
  const { name, owner } = options.repo ?? await defaultRepository(options.cwd);
  const pullRequests: PullRequest[] | null = await runGh(
    [
      "pr",
      "list",
      "--state",
      options.state ?? "all",
      "--repo",
      `${owner}/${name}`,
    ],
    ["number", "title", "state", "body"],
    options.cwd,
  );
  if (!pullRequests) {
    throw new Error(`Cannot get pull-request list from ${owner}/${name}`);
  }
  return pullRequests;
}
