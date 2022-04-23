import React, { ReactElement } from 'react'
import { ViewStyle, StyleSheet } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Tournament } from '../../models';
import { FlatList, View, Text, useThemeColor } from '../Themed'

import { FontAwesome } from '@expo/vector-icons'; 

interface TournamentListProps {
    tournaments: Tournament[];
    emptyStateText?: string;
    onPressTournament: (t: Tournament) => void;
    rightContent?: any
}

const TournamentList = ({ tournaments, emptyStateText, onPressTournament, rightContent }: TournamentListProps) => {

    const RightContentComponent = () => {
        if (rightContent) {
            return (
                <>
                    {rightContent}
                </>
            )
        }
        return (
            <FontAwesome name="angle-right" size={24} color={useThemeColor({}, "text")} />
        )
    }

    const renderItem = ({item}: {item: Tournament}) => {
        return (
            <TouchableHighlight activeOpacity={0.8} onPress={() => onPressTournament(item)}>
                <View style={styles.row}>
                    <View style={styles.left}>
                        <Text style={styles.nameText}>{item.name}</Text> 
                    </View>
                    <View style={styles.right}>
                    <RightContentComponent />
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
            keyExtractor={t => `${t.id}`}
            showsVerticalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginLeft: 32,
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        width: '75%',
        marginRight: 20,
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