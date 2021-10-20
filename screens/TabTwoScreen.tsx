import * as React from "react";
import { useContext } from "react";
import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import AppContext from "../components/AppContext";

export default function TabTwoScreen() {
  const context = useContext(AppContext);
  const token = context.token;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text style={styles.title}>Your token is {token}</Text>
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
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
