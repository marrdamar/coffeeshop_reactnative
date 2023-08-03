import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const Header = () => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        // style={styles.leftHeader}
        onPress={() => navigation.openDrawer()}>
        <Image
          source={burger}
          style={styles.vector}
          alt="burger"
          // onPress={navigation.openDrawer}
        />
      </TouchableOpacity>
      <View style={styles.rightHeader}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 31,
    paddingTop: 54,
  },
  rightHeader: {
    display: 'flex',
    flexDirection: 'row',
    gap: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vector: {
    height: 28,
    width: 28,
  },
});

export default Header;
