import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Platform, StyleSheet } from "react-native";

import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  LinkButton,
} from "../components/Themed";
import { postRequest, emailRegisterPath } from "../constants/Api";
import ButtonStyles from "../components/ButtonStyles";

export default function RegisterScreen({ navigation }) {
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
        style={ButtonStyles.container}
        onPress={() => {
          register();
          setPassword("");
        }}
      >
        <Text style={ButtonStyles.buttonText}>Register</Text>
      </TouchableOpacity>

      <View style={{marginTop: 32, alignItems: 'center'}}>
        <Text style={styles.body}>Already have an account?</Text>
        <LinkButton
        darkColor="#fff"
        onPress={() => {
          navigation.navigate("Login");
        }}
        title='Log in'
      />

      </View>

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
  body: {
    fontSize: 20,
    marginBottom: 12,
  },
  textField: {
    fontSize: 24,
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
