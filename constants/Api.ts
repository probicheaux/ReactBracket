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

export default "https://smus.club";
