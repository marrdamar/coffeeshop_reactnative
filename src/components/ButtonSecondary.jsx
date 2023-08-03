import {TouchableOpacity, Text} from 'react-native';
import React from 'react';

const ButtonSecondary = props => {
  return (
    <TouchableOpacity style={styles.btnSecondary} onPress={props.handlePress}>
      <Text style={styles.btnText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  btnSecondary: {
    width: '100%',
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 16,
    backgroundColor: '#6A4029',
  },
  btnText: {
    fontSize: 18,
    fontWeight: 700,
    textAlign: 'center',
    color: 'white',
  },
};

export default ButtonSecondary;
