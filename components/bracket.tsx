import * as React from "react";
import { Text, View } from "../components/Themed";
import { StyleSheet } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { ColorSchemeName, Pressable } from "react-native";

export default function BracketBox({
  navigation,
  name,
}: {
  navigation: any;
  name: string;
}) {
  return (
    <Pressable
      onPress={() => navigation.navigate("Tournament", { name: name })}
      style={({ pressed }) => ({
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="sword"
          size={30}
          style={{ transform: [{ rotate: "75deg" }] }}
        />
        <View style={{ width: 10 }} />
        <Text style={styles.title}>{name}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "lightsteelblue",
    borderRadius: 8,
    padding: 20,
    borderColor: "maroon",
    flexDirection: "row",
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
