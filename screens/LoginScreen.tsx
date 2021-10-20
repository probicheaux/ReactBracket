import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Platform, StyleSheet } from "react-native";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";

import { Text, View, TextInput, TouchableOpacity } from "../components/Themed";

export default function LoginScreen({ setToken }: { setToken: Function }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme].background;
  return (
    <View style={styles.container}>
      <TextInput style={styles.textField} placeholder="Username" />
      <View style={styles.margin} />
      <TextInput
        style={styles.textField}
        secureTextEntry={true}
        placeholder="Password"
      />
      <View style={styles.margin} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setToken(1);
        }}
      >
        <Text style={styles.button_text}>LOGIN</Text>
      </TouchableOpacity>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    flex: 1,
  },
  button: {
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  button_text: {
    fontSize: 30,
  },
  textField: {
    fontSize: 40,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  margin: {
    height: 25,
  },
});
