import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import AppContext from "./components/AppContext";
import { getItem } from "./storage";

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
