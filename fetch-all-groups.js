//@ts-check

/**
 * @module fetch-all-groups
 */

const { google } = require("googleapis");

/**
 * @typedef {import("google-auth-library").OAuth2Client} OAuth2Client
 */

/**
 * A Group resource from Google.
 *
 * @see {@link https://developers.google.com/admin-sdk/directory/v1/reference/groups#resource}
 * @typedef {import("googleapis").admin_directory_v1.Schema$Group} Group
 */

/**
 * Parameters for the list operation on groups.
 *
 * @see {@link https://developers.google.com/admin-sdk/directory/v1/reference/groups/list}
 * @typedef {import("googleapis").admin_directory_v1.Params$Resource$Groups$List} ListGroupsParameters
 */

/**
 * Fetches all groups for the given domain.
 *
 * @param {OAuth2Client} auth an OAuth 2.0 client to use to connect to the API
 * @param {ListGroupsParameters} parameters
 * @returns {AsyncIterableIterator<Group>}
 *
 * @example
 *
 * for await (const group of fetchAllGroups()) {
 *   console.log(group.email)
 * }
 */
exports.fetchAllGroups = async function*(auth, parameters = {}) {
  const directoryApi = google.admin({ version: "directory_v1", auth });
  let nextPageToken = "";
  let atFirstPage = true;
  while (atFirstPage || nextPageToken) {
    const response = await directoryApi.groups.list({
      ...parameters,
      pageToken: nextPageToken
    });
    yield* response.data.groups;
    nextPageToken = response.data.nextPageToken;
    atFirstPage = false;
  }
};

/**
 * Scopes required for fetchAllGroups to work.
 */
exports.fetchAllGroups.requiredScopes = [
  "https://www.googleapis.com/auth/admin.directory.group.readonly"
];
