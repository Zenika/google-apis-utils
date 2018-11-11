//@ts-check

const { google } = require("googleapis");

/**
 * @typedef {object} Group see https://developers.google.com/admin-sdk/directory/v1/reference/groups#resource
 *
 * @param {*} auth an OAuth 2.0 client to use to connect to the API
 * @param {object} options see request parameters at https://developers.google.com/admin-sdk/directory/v1/reference/groups/list
 * @returns {AsyncIterableIterator<Group>}
 *
 * @example
 *
 * for await (const group of fetchAllGroups()) {
 *   console.log(group.email)
 * }
 */
async function* fetchAllGroups(
  auth,
  { domain = "zenika.com", ...options } = {}
) {
  const directoryApi = google.admin({ version: "directory_v1", auth });
  let nextPageToken;
  let atFirstPage = true;
  while (atFirstPage || nextPageToken) {
    atFirstPage = false;
    const response = await directoryApi.groups.list({
      domain,
      ...options,
      pageToken: nextPageToken
    });
    yield* response.data.groups;
    nextPageToken = response.data.nextPageToken;
  }
}

fetchAllGroups.requiredScopes = [
  "https://www.googleapis.com/auth/admin.directory.group.readonly"
];

module.exports = {
  fetchAllGroups
};
