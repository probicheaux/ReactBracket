import * as React from "react";
import { useContext } from "react";
import { StyleSheet } from "react-native";
import ButtonStyles from "../components/ButtonStyles";
import useColorScheme from "../hooks/useColorScheme";

import { Text, View, TouchableOpacity } from "../components/Themed";
import AppContext from "../components/AppContext";
import { color } from "react-native-reanimated";
import { setItem } from "../storage";
import { getAuth } from "firebase/auth";

export default function AccountScreen() {
  const context = useContext(AppContext);
  const colorScheme = context.scheme;
  const setScheme = context.setScheme;
  const notColorScheme = colorScheme === "dark" ? "light" : "dark";

  return (
    <View style={styles.container}>
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
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setScheme(notColorScheme);
          setItem("userTheme", notColorScheme);
        }}
      >
        <Text style={ButtonStyles.buttonText}>Toggle Dark Mode</Text>
      </TouchableOpacity>
      <View style={styles.margin} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setItem("userToken", "");
          getAuth().signOut();
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
