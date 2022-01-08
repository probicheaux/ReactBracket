import { NavigationProp } from '@react-navigation/native';
import React from 'react'
import { ViewStyle, StyleSheet } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Tournament } from '../../models';
import { FlatList, View, Text, LinkButton } from '../Themed'

interface TournamentListProps {
    navigation: NavigationProp<any>;
    tournaments: Tournament[];
    emptyStateText?: string;
    onPressTournament: (t: Tournament) => void;
}

const TournamentList = ({ tournaments, navigation, emptyStateText, onPressTournament }: TournamentListProps) => {

    const renderItem = ({item}: {item: Tournament}) => {
        return (
            <TouchableHighlight style={styles.row} activeOpacity={0.4} underlayColor={'#fff'} onPress={() => onPressTournament(item)}>
                <View>
                    <View style={styles.left}>
                        <Text style={styles.nameText}>{item.name}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    if (tournaments.length === 0 && emptyStateText) {
        return (
            <View style={{ marginBottom: 32 }}>
                <Text style={styles.body}>{emptyStateText}</Text>
            </View>
        );
    }

    return (
        <FlatList
            style={styles.wrapper}
            data={tournaments}
            renderItem={renderItem}
            keyExtractor={t => t.id}
        />
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        borderRadius: 8,
        marginHorizontal: 20,
    },
    left: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    right: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    nameText: {
        fontSize: 24,
        textAlign: 'left'
    },
    body: {
        fontSize: 16,
        textAlign: 'left'
    }
});

export default TournamentList;