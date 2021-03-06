import React, { useContext, useState } from "react";
import { StatusBarStyle, StyleSheet } from "react-native";
import ButtonStyles from "../components/ButtonStyles";

import { Text, View, TouchableOpacity, StatusBar } from "../components/Themed";
import AppContext from "../components/AppContext";
import { AuthUserContext } from "../contexts/AuthContext";
import { setItem } from "../storage";

export default function AccountScreen() {
  const context = useContext(AppContext);
  const { auth, username } = useContext(AuthUserContext);
  const colorScheme = context.scheme;
  const setScheme = context.setScheme;
  const notColorScheme = colorScheme === "dark" ? "light" : "dark";

  const startStatusBarContent = colorScheme === "dark" ? "light-content" :  "dark-content";

  const [statusBarStyle, setStatusBarStyle] = useState<StatusBarStyle>(startStatusBarContent)

  const updateStatusBar = () => {
    const statusBarContent = notColorScheme === "dark" ? "light-content" :  "dark-content";
    setStatusBarStyle(statusBarContent) 
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={statusBarStyle} />
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text style={styles.title}>Account</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text style={styles.title}>Hello, {username}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setScheme(notColorScheme);
          setItem("userTheme", notColorScheme);

          // trigger updating status bar so it's style is maintained on other screens
          updateStatusBar();
        }}
      >
        <Text style={ButtonStyles.buttonText}>Toggle Dark Mode</Text>
      </TouchableOpacity>
      <View style={styles.margin} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setItem("userToken", "");
          auth.signOut();
        }}
      >
        <Text style={ButtonStyles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    margin: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 250,
    height: 50,
  },
  margin: {
    height: 25,
  },
});
