//@ts-check

const { google } = require("googleapis");
const { buildOAuth2Client } = require("./build-oauth2-client");
const { fetchAllGroups } = require("./fetch-all-groups");

/**
 * @param {import("googleapis").admin_directory_v1.Params$Resource$Groups$List} fetchAllGroupsParameters
 * @param {import("googleapis").groupssettings_v1.Schema$Groups} requestBody
 */
exports.patchAllGroups = async function*(
  fetchAllGroupsParameters,
  requestBody
) {
  const auth = await buildOAuth2Client([
    ...fetchAllGroups.requiredScopes,
    "https://www.googleapis.com/auth/apps.groups.settings"
  ]);
  const api = google.groupssettings({ version: "v1", auth });
  for await (const group of fetchAllGroups(auth, fetchAllGroupsParameters)) {
    yield await api.groups.patch({
      groupUniqueId: group.email,
      requestBody
    });
  }
};
