import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import AppContext from "./components/AppContext";
import { getItem } from "./storage";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import { FIREBASE_KEY } from "@env";
// import { GoogleSignin } from "@react-native-google-signing/google-signin";
import { init } from "./google";

// Add a new document in collection "cities"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE_KEY,
  authDomain: "personal-261304.firebaseapp.com",
  projectId: "personal-261304",
  storageBucket: "personal-261304.appspot.com",
  messagingSenderId: "1076294747951",
  appId: "1:1076294747951:web:e9dc5db7f65cdfaa3343da",
  measurementId: "G-KGZGCMVZKM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore();
//  GoogleSignin.configure({
//    scopes: ["https://www.googleapis.com/auth/drive.readonly"], // [Android] what API you want to access on behalf of the user, default is email and profile
//    webClientId:
//      "1076294747951-cpu07806albsljakortduvj8ol8mmcdj.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
//    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
//    hostedDomain: "", // specifies a hosted domain restriction
//    forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
//    accountName: "", // [Android] specifies an account name on the device that should be used
//    iosClientId: "<FROM DEVELOPER CONSOLE>", // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
//    googleServicePlistPath: "", // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
//    openIdRealm: "", // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
//    profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
//  });

init();
export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [token, setToken] = useState("" as string | undefined | null);
  const [scheme, setScheme] = useState(colorScheme);
  useEffect(() => {
    getItem("userToken").then((result) => setToken(result));
  }, []);
  useEffect(() => {
    getItem("userTheme").then((result) => {
      if (result === "light" || result === "dark") {
        setScheme(result);
      }
    });
  }, []);
  useEffect(() => {
    getDoc(doc(db, "cities", "LA")).then((res) => setToken(res.data().name));
  }, []);
  const userSettings = {
    token: token,
    scheme: scheme,
    setScheme: setScheme,
    setToken: setToken,
  };
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <AppContext.Provider value={userSettings}>
          <Navigation colorScheme={scheme} />
          <StatusBar />
        </AppContext.Provider>
      </SafeAreaProvider>
    );
  }
}
