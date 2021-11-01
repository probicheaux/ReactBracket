import * as React from "react";
import { useContext } from "react";
import { StyleSheet } from "react-native";
import useColorScheme from "../hooks/useColorScheme";

import { Text, View, TouchableOpacity } from "../components/Themed";
import AppContext from "../components/AppContext";
import { color } from "react-native-reanimated";
import { setItem } from "../storage";

export default function TabTwoScreen() {
  const context = useContext(AppContext);
  const colorScheme = context.scheme;
  const setScheme = context.setScheme;
  const token = context.token;
  const setToken = context.setToken;
  const notColorScheme = colorScheme === "dark" ? "light" : "dark";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text style={styles.title}>Your token is {token}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setScheme(notColorScheme);
        }}
      >
        <Text style={styles.title}>Toggle dark mode</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setToken("");
          setItem("userToken", "");
        }}
      >
        <Text style={styles.title}>Log out</Text>
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
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  button: {
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 15,
    borderRadius: 5,
    margin: 20,
    minWidth: 300,
  },
});
