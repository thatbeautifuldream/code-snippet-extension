import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";

const octokit = new Octokit({});

export class GistsService {
  static async listGistsForUser(
    username: string
  ): Promise<
    RestEndpointMethodTypes["gists"]["listForUser"]["response"]["data"]
  > {
    try {
      const response = await octokit.rest.gists.listForUser({
        username,
        per_page: 100,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching gists for user ${username}:`, error);
      throw error;
    }
  }

  static async getGist(
    gistId: string
  ): Promise<RestEndpointMethodTypes["gists"]["get"]["response"]["data"]> {
    try {
      const response = await octokit.rest.gists.get({
        gist_id: gistId,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching gist ${gistId}:`, error);
      throw error;
    }
  }
}
