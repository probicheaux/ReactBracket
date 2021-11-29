import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Platform, StyleSheet } from "react-native";

import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SocialIcon,
} from "../components/Themed";
import { postRequest, emailRegisterPath } from "../constants/Api";
import { setItem } from "../storage";

import { useContext } from "react";
import AppContext from "../components/AppContext";

export default function RegisterScreen({ navigation }) {
  const context = useContext(AppContext);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  function register() {
    let body = JSON.stringify({
      username: username,
      password: password,
      email: email,
    });
    postRequest({
      path: emailRegisterPath,
      body: body,
      callback: (json: { success: boolean }) => {
        if (json.success) {
          navigation.navigate("Login");
        }
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
        placeholder="Email"
        onChangeText={(email) => setEmail(email)}
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
          register();
          setPassword("");
        }}
      >
        <Text style={styles.button_text}>Register</Text>
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
    alignItems: "center",
    justifyContent: "center",
    minWidth: 400,
    minHeight: 75,
  },
  goog: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 400,
    minHeight: 75,
  },
  googText: {
    fontSize: 30,
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
