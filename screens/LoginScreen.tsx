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
import { postRequest, loginPath } from "../constants/Api";
import { setItem } from "../storage";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ setToken }: { setToken: Function }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "1076294747951-cpu07806albsljakortduvj8ol8mmcdj.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
      setToken(id_token);
    }
  }, [response]);
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
        <Text style={styles.button_text}>Login</Text>
      </TouchableOpacity>
      <View style={styles.margin} />
      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.button_text}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.margin} />
      <SocialIcon
        title="Sign In With Google"
        style={styles.goog}
        fontStyle={styles.googText}
        iconSize={30}
        fontWeight="normal"
        button
        type="google"
        onPress={() => {
          promptAsync();
        }}
      />

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
