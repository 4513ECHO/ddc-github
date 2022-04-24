import {
  BaseSource,
  GatherArguments,
  Item,
  OnInitArguments,
} from "../@ddc-github/deps.ts";
import { getPullRequest } from "../@ddc-github/pull_request.ts";
import type { PullRequest } from "../@ddc-github/types.ts";

interface Params {
  state: "all" | "closed" | "merged" | "open";
  menuItem: "state" | "title" | "body";
  infoItem: "state" | "title" | "body";
}

export class Source extends BaseSource<Params> {
  private pullRequests: PullRequest[] = [];

  async onInit(args: OnInitArguments<Params>): Promise<void> {
    this.pullRequests = await getPullRequest({
      state: args.sourceParams.state,
      cwd: await args.denops.call("getcwd"),
    });
  }

  gather(args: GatherArguments<Params>): Promise<Item[]> {
    return Promise.resolve(this.pullRequests.map((i) => ({
      word: `#${i.number}`,
      menu: i[args.sourceParams.menuItem].replaceAll("\r\n", "\n"),
      info: i[args.sourceParams.infoItem].replaceAll("\r\n", "\n"),
    })));
  }

  params(): Params {
    return {
      state: "all",
      menuItem: "title",
      infoItem: "body",
    };
  }
}
