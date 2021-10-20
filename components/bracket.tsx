import * as React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  MaterialCommunityIcons,
} from "../components/Themed";
import { StyleSheet } from "react-native";
import useColorScheme from "../hooks/useColorScheme";

export default function BracketBox({
  navigation,
  name,
}: {
  navigation: any;
  name: string;
}) {
  const colorScheme = useColorScheme();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Tournament", { name: name })}
      style={styles.container}
    >
      <MaterialCommunityIcons
        name="sword"
        size={30}
        style={{ transform: [{ rotate: "75deg" }] }}
      />
      <View style={{ width: 10 }} />
      <Text style={styles.title}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderRadius: 8,
    padding: 20,
    borderColor: "maroon",
    flexDirection: "row",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
