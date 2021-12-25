import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import AppContext from "./components/AppContext";
import { AuthUserContext } from "./contexts/AuthContext";
import { getItem } from "./storage";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, User } from "firebase/auth";

import { getFirestore, setDoc, doc } from "firebase/firestore";
import { FIREBASE_KEY } from "@env";

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
const auth = getAuth();

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [token, setToken] = useState("" as string | undefined | null);
  const [scheme, setScheme] = useState(colorScheme);
  const [user, setUser] = useState(null as User | null);
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
    auth.onAuthStateChanged(setUser);
  }, []);
  const userSettings = {
    token: token,
    scheme: scheme,
    setScheme: setScheme,
    setToken: setToken,
  };

  const firebaseUser = { user, setUser };

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <AppContext.Provider value={userSettings}>
          <AuthUserContext.Provider value={firebaseUser}>
            <Navigation colorScheme={scheme} />
            <StatusBar />
          </AuthUserContext.Provider>
        </AppContext.Provider>
      </SafeAreaProvider>
    );
  }
}
