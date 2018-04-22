import DeviceInfo from "react-native-device-info";

let ENV, VERSION;
let envTypes = {
    dev: 'dev',
    prod: 'prod'
};

let bundleId = DeviceInfo.getBundleId();
let bundleSplit = bundleId.split('.');
let mode = bundleSplit[bundleSplit.length - 1];
let devMode = (mode === 'dev');
if (devMode) {
    ENV = envTypes.dev;
} else {
    ENV = envTypes.prod;
}

VERSION = DeviceInfo.getVersion();

export {ENV, VERSION};