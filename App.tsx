import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import AppContext from "./components/AppContext";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [token, setToken] = useState("");
  const [scheme, setScheme] = useState(colorScheme);
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
