import React, { useState } from 'react';
import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import ButtonStyles from '../../components/ButtonStyles';
import { View, Text, TouchableOpacity } from "../../components/Themed";
import { Tournament, Bracket } from '../../models';


interface JoinDetailsProps {
  tournament: Tournament;
  onSubmitJoin: (b: Bracket) => void;
}

const JoinDetails = ({ tournament, onSubmitJoin }: JoinDetailsProps) => {

  const [selectedIndex, setSelectedIndex] = useState(-1);

  if(tournament.brackets == null) {
    return (
      <Text style={styles.label}>This tournament does not have any brackets to join yet.</Text>
    )
  }

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Join {tournament?.name}</Text>

    <Text style={styles.label}>Select a Bracket to join</Text>

    {tournament.brackets?.map((b, i) => {
      const extraStyle: ViewStyle = {}
      const textStyle: TextStyle = {}
      if (tournament.brackets && i === tournament.brackets.length - 1) {
        extraStyle.marginBottom = 16;
      }
      if (selectedIndex === i) {
        extraStyle.borderWidth = 2;
        extraStyle.padding = 12;
        textStyle.fontSize = 24;
        textStyle.fontWeight = "700";
      }
      return (
        <TouchableOpacity key={`bracket-${b.id}`} style={[styles.rowItem, extraStyle]} onPress={() => setSelectedIndex(i)}>
          <Text style={[styles.value, textStyle]}>{b.name}</Text>
        </TouchableOpacity>
      );
    })}

    <TouchableOpacity
        onPress={() => onSubmitJoin((tournament.brackets as Bracket[])[selectedIndex])}
        disabled={selectedIndex === -1 }
        style={[ButtonStyles.container, { width: "50%" }]}
      >
        <Text style={ButtonStyles.buttonText}>Join</Text>
    </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    textAlign: "left",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 20,
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
  rowItem: {

  },
});

export default JoinDetails;