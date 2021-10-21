import Constants from "expo-constants";
import { Platform } from "react-native";
const { manifest } = Constants;

const hasManifest =
  manifest != null &&
  typeof manifest.packagerOpts === `object` &&
  manifest.packagerOpts.dev;

var localHostPath = null;
if (hasManifest && manifest != null && manifest.debuggerHost != null) {
  localHostPath = manifest.debuggerHost.split(`:`).shift();
}
var baseUri =
  hasManifest && localHostPath != null
    ? localHostPath.concat(`:8000`)
    : `smus.club`;

if (Platform.OS === "web") {
  baseUri = "127.0.0.1:8000";
}

let apiPath = "http://" + baseUri;

export default apiPath;
export type postRequestType = {
  path: string;
  body: string;
  callback: Function;
};
export async function postRequest({ path, body, callback }: postRequestType) {
  return fetch(apiPath + path, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body,
  })
    .then((response) => response.json())
    .then((json) => {
      callback(json);
    })
    .catch((error) => {
      console.error(error);
    });
}

export var loginPath = "/api/login/";
export var tournamentPath = "/api/tournament/";
