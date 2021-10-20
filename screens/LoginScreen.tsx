import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Platform, StyleSheet } from "react-native";

import { Text, View, TextInput, TouchableOpacity } from "../components/Themed";
import apiPath from "../constants/Api";

export default function LoginScreen({ setToken }: { setToken: Function }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  function getToken() {
    return fetch(apiPath + "/api/login/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setToken(json.token);
      })
      .catch((error) => {
        console.error(error);
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
