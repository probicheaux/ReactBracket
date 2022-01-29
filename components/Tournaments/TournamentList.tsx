import React from 'react'
import { ViewStyle, StyleSheet } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Tournament } from '../../models';
import { FlatList, View, Text } from '../Themed'

interface TournamentListProps {
    tournaments: Tournament[];
    emptyStateText?: string;
    onPressTournament: (t: Tournament) => void;
    rightContent?: any
}

const TournamentList = ({ tournaments, emptyStateText, onPressTournament, rightContent }: TournamentListProps) => {

    const renderItem = ({item}: {item: Tournament}) => {
        return (
            <TouchableHighlight activeOpacity={0.8} onPress={() => onPressTournament(item)}>
                <View style={styles.row}>
                    <View style={styles.left}>
                        <Text style={styles.nameText}>{item.name}</Text>
                    </View>
                    <View style={styles.right}>
                        {rightContent}
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
            showsVerticalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 8,
        flex: 1,
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        width: "100%",
        borderRadius: 8,
        marginVertical: 12,
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