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
var apiPath =
  hasManifest && localHostPath != null
    ? "http://".concat(localHostPath.concat(`:8000`))
    : "https://smus.club";

if (Platform.OS === "web") {
  apiPath = "http://127.0.0.1:8000";
}

export default apiPath;

export var loginPath = "/api/user/login/";
export var logoutPath = "/api/user/logout/";
export var emailRegisterPath = "/api/user/register-from-email/";
export var tournamentPath = "/api/tournament/";
export var makeBracketPath = "/api/makeBracketFromEntrants/";

export const apiHost = `${apiPath}/v1`;
