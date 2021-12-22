import React from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, SafeAreaView } from './Themed';

export default function Spinner() {
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});