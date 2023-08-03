import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

const LoaderScreen = () => (
  <View style={[styles.container, styles.horizontal]}>
    <ActivityIndicator size="large" color="#6A4029" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    // marginTop: 60,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default LoaderScreen;
