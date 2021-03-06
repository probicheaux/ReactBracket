import React, { useState, useContext, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import ButtonStyles from "../components/ButtonStyles";
import { AuthUserContext } from "../contexts/AuthContext";
import { getTournaments } from "../api/Requests";
import { User } from "firebase/auth";

import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "../components/Themed";
import TournamentList from "../components/Tournaments/TournamentList";
import { ScreenWithNavigation } from "../types";
import { Tournament } from "../models";
import { useIsFocused } from "@react-navigation/native";

export default function HomeScreen({ navigation }: ScreenWithNavigation) {
  const [myTournaments, setMyTournaments] = useState([] as Tournament[]);
  const isFocused = useIsFocused();
  const { user } = useContext(AuthUserContext);
  useEffect(() => {
    if (isFocused) {
      getTournaments(user as User).then(setMyTournaments);
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Tournaments</Text>
      </View>

      <TournamentList 
        navigation={navigation}
        tournaments={myTournaments}
        onPressTournament={(t) => navigation.navigate('TournamentDetails', {id: t.id })}
        emptyStateText="Tournaments you join will show up here" 
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("CreateTournament")}
        style={[ButtonStyles.container, { width: "50%" }]}
      >
        <Text style={ButtonStyles.buttonText}>Create</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("SearchAndJoinStack")}
        style={[ButtonStyles.container, { width: "50%" }]}
      >
        <Text style={ButtonStyles.buttonText}>Join</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignContent: "flex-start",
    width: "100%",
    marginTop: 64,
    marginLeft: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
  },
  listContainer: {
    marginLeft: 20,
  }
});
