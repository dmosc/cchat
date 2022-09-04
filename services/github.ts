import { request } from "@octokit/request";
import { Session } from "next-auth/core/types";
import { getSession } from "next-auth/react";

class GithubClient {
  private _token?: string;
  private static instance: GithubClient;

  private constructor() {
    getSession().then((session: Session | null) => {
      this._token = session?.accessToken!;
    });
  }

  static getInstance() {
    if (!GithubClient.instance) {
      GithubClient.instance = new GithubClient();
    }
    return GithubClient.instance;
  }

  query(url: string) {
    return request({
      method: "GET",
      url,
      headers: {
        authorization: `token ${this._token}`
      }
    });
  }
}

export default GithubClient.getInstance();
