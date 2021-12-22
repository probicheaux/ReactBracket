import { NavigationProp } from '@react-navigation/native';
import React from 'react'
import { ViewStyle, StyleSheet } from 'react-native';
import { Tournament } from '../../models';
import { FlatList, View, Text, LinkButton } from '../Themed'

interface TournamentListProps {
    navigation: NavigationProp<any>
    tournaments: Tournament[]
}

const TournamentList = ({ tournaments, navigation }: TournamentListProps) => {

    const renderItem = ({item}: {item: Tournament}) => {
        return (
            <View style={styles.row}>
                <View style={styles.left}>
                    <Text style={styles.nameText}>{item.name}</Text>
                </View>
                <View style={styles.right}>
                    {/* TODO: Replace with a "right arrow button" whenever we add it */}
                    <LinkButton title='View' onPress={() => navigation.navigate('TournamentDetails', {id: item.id })}/>
                </View>
            </View>
        );
    }

    if (tournaments.length === 0) {
        return (
            <View style={{ marginBottom: 32 }}>
                <Text style={styles.body}>Tournaments you join will show up here.</Text>
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