import React, { useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { createTournament } from "../../api/Requests";
import ButtonStyles from "../../components/ButtonStyles";

import { Text, View, TouchableOpacity, TextInput } from "../../components/Themed";
import { AuthUserContext } from "../../contexts/AuthContext";
//import { ScreenWithNavigation } from "../../types";

export default function CreateTournamentScreen({ navigation }: any) {

    const { user } = useContext(AuthUserContext);

    // TODO: Update data and send to API when done
    const [data, setData] = useState({name: ''});

    const submit = async () => {
        try {
            const createdTournament = await createTournament(user, data);
        } catch (e) {
            // TODO: Display error toast, but for now, just log
            console.log(`Error creating tournament: ${e}`)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Tournament</Text>
            
            <Text style={styles.label}>Tournament Name</Text>
            <TextInput
                value={data.name}
                onChangeText={(n) => setData({...data, name: n})}
                returnKeyType='done'
                placeholder="Tournament Name"
            />

            <TouchableOpacity style={ButtonStyles.container} onPress={submit}>
                <Text style={ButtonStyles.buttonText}>Create</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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
  tournamentListContainer: {
    height: '40%',
    margin: 20,
  },
  label: {
      fontSize: 16,
      fontWeight: '600',
  }
});