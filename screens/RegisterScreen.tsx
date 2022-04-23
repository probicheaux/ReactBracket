import React, { useState, useContext } from "react";
import { Platform, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";

import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  LinkButton,
} from "../components/Themed";
import ButtonStyles from "../components/ButtonStyles";
import { RootStackScreenProps } from "../types";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  User,
} from "firebase/auth";

import { createUser } from "../api/Requests";
import { AuthUserContext } from "../contexts/AuthContext";

export default function RegisterScreen({
  navigation,
  route,
}: RootStackScreenProps<"Register">) {
  const { fromGoogleFlow } = route.params;
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const authUserContext = useContext(AuthUserContext);

  async function register() {
    if (!fromGoogleFlow) {
      let userCredential = await createUserWithEmailAndPassword(
        authUserContext.auth,
        email,
        password
      );
      await createUser(userCredential.user, { username });
      await sendEmailVerification(userCredential.user);
    } else {
      await createUser(authUserContext.user as User, { username });
    }
    authUserContext.setUserName(username);
  }

  const renderEmailPassword = () => {
    if (fromGoogleFlow) {
      return <></>;
    }

    return (
      <>
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
      </>
    );
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={styles.textField}
          placeholder="Username"
          onChangeText={(username) => setUserName(username)}
        />
        {renderEmailPassword()}
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

        <View style={{ marginTop: 32, alignItems: "center" }}>
          <Text style={styles.body}>Already have an account?</Text>
          <LinkButton
            darkColor="#fff"
            onPress={() => {
              navigation.navigate("Login");
            }}
            style={ButtonStyles.container}
            title="Log in"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
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
    fontSize: 32,
    width: "100%",
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 64,
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
