import Constants from "expo-constants";
const { manifest } = Constants;

const hasManifest =
  manifest != null &&
  typeof manifest.packagerOpts === `object` &&
  manifest.packagerOpts.dev;

var localHostPath = null;
if (hasManifest && manifest != null && manifest.debuggerHost != null) {
  localHostPath = manifest.debuggerHost.split(`:`).shift();
}
const baseUri =
  hasManifest && localHostPath != null
    ? localHostPath.concat(`:8000`)
    : `smus.club`;

export default "http://" + baseUri;
