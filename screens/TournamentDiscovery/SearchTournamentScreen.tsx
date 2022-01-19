import React, { useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { searchForTournament } from "../../api/Requests";
import ButtonStyles from "../../components/ButtonStyles";
import { User } from "firebase/auth";
import { Keyboard } from "react-native";

import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "../../components/Themed";
import { AuthUserContext } from "../../contexts/AuthContext";
import { ScreenWithNavigation } from "../../types";
import { Tournament } from "../../models";
import Spinner from "../../components/Spinner";
import TournamentList from "../../components/Tournaments/TournamentList";

export default function SearchTournamentScreen({
  navigation,
}: ScreenWithNavigation) {
  const { user } = useContext(AuthUserContext);

  const [data, setData] = useState({ name: "", code: ""});
  const [results, setResults] = useState<Tournament[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    Keyboard.dismiss();
    try {
      setSubmitted(true);
      setLoading(true)
      const results = await searchForTournament(user as User, data);
      setResults(results);
      setLoading(false);
    } catch (e) {
      // TODO: Display error toast, but for now, just log
      console.log(`Error searching for tournament: ${e}`);
    }
  };

  const joinTournament = (tournament: Tournament) => {
    // TODO: Navigate to tournament details page for joining?
    navigation.navigate("TournamentDetails", { id: tournament.id, viewMode: "join" })
  }


  const renderResultsContent = () => {
    if(submitted && loading) {
      return ( <Spinner /> );
    }
    else if (submitted && !loading && results.length == 0) {
      return (
        <Text style={styles.body}>Sorry, no results found. Please try searching with a different name.</Text>
      )
    }
    else if (submitted && !loading && results) {
      return (
        <View style={{ minHeight: 400 }}>
          <Text style={styles.label}>Results</Text>
          <TournamentList
            tournaments={results}
            onPressTournament={joinTournament}
            rightContent={
              <Text>Join</Text>
            }
          />
        </View>
      )
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Tournament</Text>

      <Text style={styles.label}>Search by name</Text>
      <TextInput
        value={data.name}
        style={styles.input}
        onChangeText={(n) => setData({ ...data, name: n })}
        returnKeyType="search"
        placeholder="Tournament Name"
        testID="searchTournamentNameInput"
        onSubmitEditing={submit}
      />

      <View style={styles.resultsContainer}>
        { renderResultsContent() }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  tournamentListContainer: {
    height: "40%",
    margin: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "400",
  },
  input: {
    fontSize: 24,
    marginBottom: 20,
  },
  resultsContainer: {
    marginTop: 20,
  },
  body: {
    fontSize: 20,
    textAlign: 'center',
  }
});
