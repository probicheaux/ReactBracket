import React, { useState, useEffect, useContext } from "react";
import { AuthUserContext } from "../contexts/AuthContext";
import { Image, StyleSheet } from "react-native";

import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  LinkButton,
} from "../components/Themed";
import { setItem } from "../storage";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";

import ButtonStyles from "../components/ButtonStyles";
import { ScreenWithNavigation } from "../types";
import { getUser } from "../api/Requests";
import { BadStatusError } from "../api/BaseRequests";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }: ScreenWithNavigation) {
  const authContext = useContext(AuthUserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "1076294747951-cpu07806albsljakortduvj8ol8mmcdj.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(authContext.auth, credential)
        .then(async ({ user }) => {
          return getUser(user);
        })
        .then(
          ({ username }) => {
            authContext.setUserName(username);
          },
          (e) => {
            if (e instanceof BadStatusError && e.code == 404) {
              navigation.navigate("Register", { fromGoogleFlow: true });
            }
          }
        );
    }
  }, [response]);

  async function submitLogin() {
    await signInWithEmailAndPassword(authContext.auth, email, password);
    let user = authContext.user as User;
    let { username } = await getUser(user);
    authContext.setUserName(username);
  }

  return (
    <View style={styles.container}>
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
          submitLogin();
          setPassword("");
        }}
      >
        <Text style={ButtonStyles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.margin} />
      <LinkButton
        onPress={() => {
          navigation.navigate("Register", { fromGoogleFlow: false });
        }}
        title="Sign Up"
        style={ButtonStyles.container}
      />
      <View style={styles.margin} />
      <TouchableOpacity
        style={ButtonStyles.invisibleContainer}
        onPress={() => {
          promptAsync();
        }}
      >
        <Image
          style={styles.image}
          source={require("../assets/images/btn_google_signin_dark_normal_web.png")}
        />
      </TouchableOpacity>
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
  image: {
    height: "100%",
    width: "100%",
  },
});
