import type { Repository } from "./types.ts";

export async function runGh<A extends T[], T extends string>(
  subcmds: string[],
  fields: A,
  cwd?: string,
): Promise<Record<A[number], unknown> | Record<A[number], unknown>[] | null> {
  const proc = Deno.run({
    cmd: ["gh", ...subcmds, ...(fields.flatMap((i) => ["--json", i]))],
    stderr: "piped",
    stdout: "piped",
    stdin: "null",
    cwd: cwd ?? Deno.cwd(),
  });
  const [status, stdout, stderr] = await Promise.all([
    proc.status(),
    proc.output(),
    proc.stderrOutput(),
  ]);
  proc.close();
  if (status.success) {
    const output = new TextDecoder().decode(stdout);
    return JSON.parse(output);
  }
  console.error(new TextDecoder().decode(stderr));
  return null;
}

export async function defaultRepository(cwd?: string): Promise<Repository> {
  const repo: Repository | null = await runGh(
    [
      "repo",
      "view",
      "--jq",
      ".owner |= .login",
    ],
    ["name", "owner"],
    cwd,
  );
  if (!repo) {
    throw new Error("Cannnot get remote repository information");
  }
  return repo;
}
