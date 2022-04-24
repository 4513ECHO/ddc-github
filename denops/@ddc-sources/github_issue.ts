import {
  BaseSource,
  GatherArguments,
  Item,
  OnInitArguments,
} from "../@ddc-github/deps.ts";
import { getIssue } from "../@ddc-github/issue.ts";
import type { Issue } from "../@ddc-github/types.ts";

interface Params {
  state: "all" | "closed" | "open";
  menuItem: "state" | "title" | "body";
  infoItem: "state" | "title" | "body";
}

export class Source extends BaseSource<Params> {
  private issues: Issue[] = [];

  async onInit(args: OnInitArguments<Params>): Promise<void> {
    this.issues = await getIssue({
      state: args.sourceParams.state,
      cwd: await args.denops.call("getcwd"),
    });
  }

  async gather(args: GatherArguments<Params>): Promise<Item[]> {
    return this.issues.map((i) => ({
      word: `#${i.number}`,
      menu: i[args.sourceParams.menuItem].replaceAll("\r\n", "\n"),
      info: i[args.sourceParams.infoItem].replaceAll("\r\n", "\n"),
    }));
  }

  params(): Params {
    return {
      state: "all",
      menuItem: "title",
      infoItem: "body",
    };
  }
}
