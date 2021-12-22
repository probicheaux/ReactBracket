import React, { useState } from "react";
import { StyleSheet } from "react-native";
import ButtonStyles from "../components/ButtonStyles";

import { Text, View, TouchableOpacity, FlatList, SafeAreaView } from "../components/Themed";
import TournamentList from "../components/Tournaments/TournamentList";
import { ScreenWithNavigation } from "../types";

export default function HomeScreen({ navigation }: ScreenWithNavigation) {

    // TODO: Load user's tournaments from API
    const [myTournaments, setMyTournaments] = useState([]);

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
            <Text style={styles.title}>Tournaments</Text>
        </View>
        
        <TournamentList
            navigation={navigation}
            tournaments={myTournaments} 
        />

        <TouchableOpacity
            onPress={() => navigation.navigate('CreateTournament')}
            style={[ButtonStyles.container, {width: '50%'}]}
        >
            <Text style={ButtonStyles.buttonText}>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => navigation.navigate('SearchTournaments')}
            style={[ButtonStyles.container, {width: '50%'}]}
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
    flexDirection: 'row',
    alignContent: 'flex-start',
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 24,
    textAlign: 'left'
  },
});
