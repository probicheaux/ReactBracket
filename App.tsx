import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import AppContext from "./components/AppContext";
import { getItem } from "./storage";
// Import the functions you need from the SDKs you need
import { User } from "firebase/auth";

import { AuthUserContext } from "./contexts/AuthContext";
import { fireBaseAuth } from "./firebase/config";

const auth = fireBaseAuth.getAuth();

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [scheme, setScheme] = useState(colorScheme);
  const [user, setUser] = useState(null as User | null);
  const [username, setUserName] = useState(null as string | null);
  useEffect(() => {
    getItem("userToken").then(() => {});
  }, []);
  useEffect(() => {
    getItem("userTheme").then((result) => {
      if (result === "light" || result === "dark") {
        setScheme(result);
      }
    });
  }, []);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      if (!user) {
        setUserName(null);
      }
    });
  }, []);
  const userSettings = {
    scheme: scheme,
    setScheme: setScheme,
  };

  const authContext = { user, setUser, auth, username, setUserName };

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <AppContext.Provider value={userSettings}>
          <AuthUserContext.Provider value={authContext}>
            <Navigation colorScheme={scheme} />
            <StatusBar />
          </AuthUserContext.Provider>
        </AppContext.Provider>
      </SafeAreaProvider>
    );
  }
}
