import { defaultRepository, runGh } from "./util.ts";
import type { Issue, Repository } from "./types.ts";

export async function getIssue(
  options: {
    repo?: Repository;
    state?: "all" | "closed" | "open";
    cwd?: string;
  },
): Promise<Issue[]> {
  const { name, owner } = options.repo ?? await defaultRepository(options.cwd);
  const issues: Issue[] | null = await runGh(
    [
      "issue",
      "list",
      "--state",
      options.state ?? "all",
      "--repo",
      `${owner}/${name}`,
    ],
    ["number", "title", "state", "body"],
    options.cwd,
  );
  if (!issues) {
    throw new Error(`Cannot get issue list from ${owner}/${name}`);
  }
  return issues;
}
