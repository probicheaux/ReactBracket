import * as React from "react";
import { StyleSheet } from "react-native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, FlatList, View } from "../components/Themed";
import BracketBox from "../components/bracket";

const backgroundColor = "darkslategrey";
const Stack = createNativeStackNavigator<RootStackParamList>();
import Tournament from "../screens/TournamentScreen";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
export default function BracketScreen({ navigation }): RootTabScreenProps {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BracketList"
        component={BracketList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Tournament"
        component={Tournament}
        options={{ title: "not found" }}
        initialParams={{ name: "NotFound" }}
      />
    </Stack.Navigator>
  );
}
export function BracketList({ navigation }: RootTabScreenProps<"Brackets">) {
  var names = [
    "yeet",
    "yeet1",
    "aklsd;jfas;djk",
    "a;sdfkjas;dlkf",
    "yoink",
    "keep",
    "jeeperss",
    "long names",
    " naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaame",
    "fuuuck",
    "yoink",
    "array",
    "yeet2",
    "name",
    "yadayadadyadyaydsay",
    "suepr omega tournament",
  ];
  function render({
    item,
    index,
    separators,
  }: {
    item: string;
    index: number;
    separators: Object;
  }) {
    return (
      <BracketBox navigation={navigation} name={item} key={index.toString()} />
    );
  }
  return (
    <FlatList
      style={styles.scrollContainer}
      data={names}
      renderItem={render}
      ItemSeparatorComponent={() => (
        <View style={{ height: 16, backgroundColor: "transparent" }} />
      )}
      ListFooterComponent={() => (
        <View style={{ height: 50, backgroundColor: "transparent" }} />
      )}
    ></FlatList>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  scrollContainer: {
    backgroundColor: backgroundColor,
    padding: 20,
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
