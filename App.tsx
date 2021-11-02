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
import { getFirestore, setDoc, doc } from "firebase/firestore";

// Add a new document in collection "cities"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARj-v9T5prsLdjWqBYhVcOh9i-MsaG45M",
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
export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [token, setToken] = useState("" as string | undefined | null);
  const [scheme, setScheme] = useState(colorScheme);
  useEffect(() => {
    setDoc(doc(db, "cities", "LA"), {
      name: "Los Angeles",
      state: "CA",
      country: "USA",
    });
  }, []);
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
