export interface Repository {
  name: string;
  owner: string;
}

export interface Issue {
  number: number;
  title: string;
  state: "CLOSED" | "OPEN";
  body: string;
}

export interface PullRequest {
  number: number;
  title: string;
  state: "CLOSED" | "OPEN" | "MERGED";
  body: string;
}
