import {TouchableOpacity, Text, View} from 'react-native';
import React from 'react';

const ButtonWhite = props => {
  return (
    <TouchableOpacity style={styles.btnWhite} onPress={props.handlePress}>
      <View style={styles.innerBtn}>
        <Text style={styles.btnText}>{props.title}</Text>
        <Text style={styles.btnText}>&#10140;</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  btnWhite: {
    width: '100%',
    paddingTop: 16,
    paddingBottom: 16,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  innerBtn: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 12,
  },
  btnText: {
    fontSize: 18,
    fontWeight: 700,
    textAlign: 'center',
    color: '#6A4029',
  },
};

export default ButtonWhite;
