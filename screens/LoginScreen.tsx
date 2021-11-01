import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Platform, StyleSheet } from "react-native";

import { Text, View, TextInput, TouchableOpacity } from "../components/Themed";
import { postRequest, loginPath } from "../constants/Api";
import { setItem } from "../storage";

export default function LoginScreen({ setToken }: { setToken: Function }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  function getToken() {
    let body = JSON.stringify({
      username: username,
      password: password,
    });
    postRequest({
      path: loginPath,
      body: body,
      callback: (json: { token: string }) => {
        setToken(json.token);
        setItem("userToken", json.token);
      },
    });
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textField}
        placeholder="Username"
        onChangeText={(username) => setUserName(username)}
      />
      <View style={styles.margin} />
      <TextInput
        style={styles.textField}
        secureTextEntry={true}
        placeholder="Password"
        onChangeText={(password) => setPassword(password)}
        value={password}
      />
      <View style={styles.bigMargin} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          getToken();
          setPassword("");
        }}
      >
        <Text style={styles.button_text}>LOGIN</Text>
      </TouchableOpacity>
      <View style={styles.margin} />
      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.button_text}>SIGN UP</Text>
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
    minWidth: 400,
  },
  button_text: {
    fontSize: 30,
    alignItems: "center",
    justifyContent: "center",
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
  bigMargin: {
    height: 75,
  },
});
