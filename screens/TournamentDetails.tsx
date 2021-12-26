import { Route } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { Modal, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getTournament, addBracket } from "../api/Requests";
import Spinner from "../components/Spinner";

import { Text, View, LinkButton, TextInput } from "../components/Themed";
import { AuthUserContext } from "../contexts/AuthContext";
import { Tournament, Bracket } from "../models";
import { ScreenWithNavigation } from "../types";
import ButtonStyles from "../components/ButtonStyles";

type DetailScreen = ScreenWithNavigation & { route: Route<any> };

export default function TournamentDetailsScreen({
  navigation,
  route,
}: DetailScreen) {
  const { user } = useContext(AuthUserContext);
  if (!user) {
    throw new Error("User not defined");
  }
  const { id: tournamentId } = route.params as { id: string };

  // TODO: Update data and send to API when done
  const [tournament, setTournament] = useState<Tournament | undefined>();
  const [loading, setLoading] = useState(true);

  const [bracket, setBracket] = useState<Bracket>({ name: "" });

  // For Adding brackets
  const [showAddBracket, setShowAddBracketModal] = useState(false);

  const fetchTournamentDetails = async () => {
    const data = await getTournament(tournamentId, user);
    setTournament(data);
    setLoading(false);
  };

  // On screen load, fetch the tournament details
  useEffect(() => {
    fetchTournamentDetails();
  }, []);

  const submitAddBracket = async () => {
    setLoading(true);
    await addBracket(bracket, tournamentId, user);
    setBracket({ name: "" });
    // Refresh w/ new bracket
    fetchTournamentDetails();
  };

  if (loading || tournament === undefined) {
    return <Spinner />;
  }

  const renderAddBracketModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddBracket}
        onRequestClose={() => {
          setShowAddBracketModal(!showAddBracket);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Add a Bracket to {tournament.name}
            </Text>
            <TextInput
              placeholder="Bracket name"
              style={styles.textInput}
              onChangeText={(t) => setBracket({ ...bracket, name: t })}
            />
            <LinkButton
              title="Add"
              onPress={() => submitAddBracket()}
              style={ButtonStyles.container}
            />
            <LinkButton
              title="Cancel"
              onPress={() => setShowAddBracketModal(!showAddBracket)}
              style={ButtonStyles.container}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {renderAddBracketModal()}
      <Text style={styles.title}>{tournament?.name}</Text>

      <Text style={styles.label}>Quick Join ID</Text>
      <Text style={styles.value}>{tournament.shortId}</Text>

      <Text style={styles.label}>Brackets</Text>
      {tournament.brackets?.map((b) => {
        return (
          <View key={`bracket-${b.id}`}>
            <Text style={styles.value}>{b.name}</Text>
          </View>
        );
      })}

      <LinkButton
        title="Add Bracket"
        onPress={() => setShowAddBracketModal(true)}
        style={ButtonStyles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "500",
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
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
  },
  value: {
    fontSize: 20,
    fontWeight: "400",
  },
  input: {
    fontSize: 24,
    marginBottom: 20,
  },
  footer: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  textInput: {
    fontSize: 20,
    alignItems: "center",
  },
});
