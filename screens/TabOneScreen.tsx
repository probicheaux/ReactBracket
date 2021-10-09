import * as React from "react";
import { StyleSheet } from "react-native";

import { Text, FlatList, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import BracketBox from "../components/bracket";

const backgroundColor = "darkslategrey";
export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
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
    return <BracketBox navigation={navigation} name={item} />;
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
