import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { TouchableHighlight, Image, Platform, StyleSheet } from "react-native";

import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SocialIcon,
  LinkButton,
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

import { useContext } from "react";
import AppContext from "../components/AppContext";
import ButtonStyles from "../components/ButtonStyles";
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const context = useContext(AppContext);
  const setToken = context.setToken;
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
        style={ButtonStyles.container}
        onPress={() => {
          getToken();
          setPassword("");
        }}
      >
        <Text style={ButtonStyles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.margin} />
      <LinkButton
        darkColor="#fff"
        onPress={() => {
          navigation.navigate("Register");
        }}
        title="Sign Up"
      />
      <View style={styles.margin} />
      <TouchableOpacity
        style={ButtonStyles.invisibleContainer}
        onPress={() => promptAsync()}
      >
        <Image
          style={{ width: "100%", height: "100%" }}
          source={require("../assets/images/btn_google_signin_dark_normal_web@2x.png")}
        />
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
    padding: 24,
  },
  textField: {
    fontSize: 32,
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
