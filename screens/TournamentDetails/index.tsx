import { Route } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { Modal, StyleSheet, ViewStyle } from "react-native";
import { getTournament, addBracket, startTournament, joinBracket, deleteTournament } from "../../api/Requests";
import Spinner from "../../components/Spinner";

import { Text, View, LinkButton, TextInput, Button, TouchableOpacity } from "../../components/Themed";
import { AuthUserContext } from "../../contexts/AuthContext";
import { Tournament, Bracket, BracketUser } from "../../models";
import { User } from "firebase/auth";

import { ScreenWithNavigation } from "../../types";
import ButtonStyles from "../../components/ButtonStyles";

import JoinDetails from "./JoinDetails";


type DetailScreen = ScreenWithNavigation & { route: Route<any> };

export default function TournamentDetailsScreen({
  navigation,
  route,
}: DetailScreen) {
  const { user } = useContext(AuthUserContext);
  
  const { id: tournamentId, viewMode } = route.params as { id: string, viewMode?: string };

  // TODO: Update data and send to API when done
  const [tournament, setTournament] = useState<Tournament | undefined>();
  const [owner, setOwner] = useState<BracketUser | undefined>();
  const [loading, setLoading] = useState(true);

  const [bracket, setBracket] = useState<Bracket>({ name: "", tournament: parseInt(tournamentId)});

  // For Adding brackets
  const [showAddBracket, setShowAddBracketModal] = useState(false);

  const fetchTournamentDetails = async () => {
    const data = await getTournament(tournamentId, user as User);
    setTournament(data);
    setLoading(false);
  };

  // On screen load, fetch the tournament details
  useEffect(() => {
    fetchTournamentDetails();
  }, []);

  const submitAddBracket = async () => {
    setLoading(true);
    await addBracket(bracket, tournamentId, user as User);
    setBracket({ name: "", tournament: parseInt(tournamentId)});
    fetchTournamentDetails();
    setShowAddBracketModal(false);
  };

  const submitJoinBracket = async (bracketToJoin: Bracket) => {
    setLoading(true);
    // TODO: Display success toast
    await joinBracket(bracketToJoin, user as User);
    navigation.navigate("Home");
  }

  const submitStartTournament = async () => {
    setLoading(true);
    await startTournament(tournamentId, user as User);
    fetchTournamentDetails();
  }

  const runDeleteTournament = async () => {
    const res = await deleteTournament(tournamentId, user as User);
    if (res){
      alert("Deletion successful, redirecting to homepage")
      navigation.navigate("Home");
    }
  }

  if (loading || tournament === undefined) {
    return <Spinner />;
  }

  //currently is always false since setOwner is never called, I think -nick
  const isOwner = owner?.firebase_id === user?.uid;
  //console.log(isOwner, owner, user)

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
            <Text style={styles.modalHeader}>
              Add a Bracket to {tournament.name}
            </Text>
            <Text style={styles.modalLabel}>
              Bracket name
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

  // once the owner field works I'll encase the delete button in isOwner && ()

  const ViewDetails = () => (
    <View style={styles.container}>
      {renderAddBracketModal()}
      <Text style={styles.title}>{tournament?.name}</Text>
      
      <TouchableOpacity onPress={runDeleteTournament} style={[ButtonStyles.container, { width: "50%" }]}>
        <Text style={ButtonStyles.buttonText}>Delete Tournament</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Quick Join ID</Text>
      <Text style={styles.value}>{tournament.shortId}</Text>

      <Text style={styles.label}>Brackets</Text>
      {tournament.brackets?.map((b, i) => {
        const extraStyle: ViewStyle = {}
        if (tournament.brackets && i === tournament.brackets.length - 1) {
          extraStyle.marginBottom = 16;
        }
        return (
          <View key={`bracket-${b.id}`} style={extraStyle}>
            <Text style={styles.value}>{b.name}</Text>
          </View>
        );
      })}

      { isOwner && (
        <LinkButton
          title="Add Bracket"
          onPress={() => setShowAddBracketModal(true)}
          style={ButtonStyles.container}
        />
      )}

      { isOwner && tournament.status === 'pending' && 
        (
          <View style={styles.footer}>
            <Button
              title="Start Tournament"
              onPress={() => submitStartTournament()}
            />
          </View>
        )
      }

    </View>
  );

  if (viewMode === "join") {
    return (
      <JoinDetails tournament={tournament} onSubmitJoin={(bracket: Bracket) => submitJoinBracket(bracket)} />
    )
  }
  return (
    <ViewDetails />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    textAlign: "left",
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
    fontSize: 22,
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
    alignItems: "center",
    marginTop: "30%"
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
  modalHeader: {
    marginBottom: 12,
    textAlign: "left",
    fontSize: 20,
  },
  modalLabel: {
    marginTop: 12,
  },
  textInput: {
    fontSize: 20,
    alignItems: "center",
    marginBottom: 20,
  },
});
