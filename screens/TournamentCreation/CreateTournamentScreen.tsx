import React, { useContext, useState } from "react";
import { Keyboard, StyleSheet } from "react-native";
import { createTournament } from "../../api/Requests";
import ButtonStyles from "../../components/ButtonStyles";
import { User } from "firebase/auth";

import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "../../components/Themed";
import { AuthUserContext } from "../../contexts/AuthContext";
import { ScreenWithNavigation } from "../../types";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from "../../constants/Colors";


export default function CreateTournamentScreen({
  navigation,
}: ScreenWithNavigation) {
  const { user } = useContext(AuthUserContext);

  // TODO: Update data and send to API when done
  const [data, setData] = useState({ name: "", description: "", startDate: new Date()});

  const submit = async () => {
    try {
      const newTournament = await createTournament(user as User, data);
      navigation.navigate("TournamentDetails", { id: newTournament.id });
    } catch (e) {
      // TODO: Display error toast, but for now, just log
      console.log(`Error creating tournament: ${e}`);
    }
  };

  const onChangeDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || data.startDate;
    setData({ ...data, startDate: currentDate});
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Text style={styles.title}>Create Tournament</Text>

      <Text style={styles.label}>Tournament Name</Text>
      <TextInput
        value={data.name}
        style={styles.input}
        onChangeText={(n) => setData({ ...data, name: n })}
        returnKeyType="done"
        placeholder="Tournament Name"
      />

      <Text style={styles.label}>Details</Text>
      <TextInput
        value={data.description}
        style={[styles.input, {fontSize: 16, minHeight: 52}]}
        multiline={true}
        numberOfLines={3}
        onChangeText={(t) => setData({ ...data, description: t })}
        returnKeyType="done"
        placeholder="Write about your tournament here"
      />


      <Text style={styles.label}>Start Date</Text>
      <DateTimePicker
          testID="dateTimePicker"
          value={data.startDate}
          is24Hour={true}
          display="default"
          textColor={Colors.shared.blue}
          onChange={onChangeDate}
          style={{marginTop: 8}}
      />
    
      <View style={styles.footer}>
        <TouchableOpacity
          accessibilityRole="button"
          style={ButtonStyles.container}
          onPress={submit}
        >
          <Text style={ButtonStyles.buttonText}>Create</Text>
        </TouchableOpacity>
      </View>
      </TouchableWithoutFeedback>
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
  footer: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "center",
  },
});
