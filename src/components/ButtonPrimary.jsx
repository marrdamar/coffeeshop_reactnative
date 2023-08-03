import {TouchableOpacity, Text} from 'react-native';
import React from 'react';

const ButtonPrimary = props => {
  return (
    <TouchableOpacity style={styles.btnPrimary} onPress={props.handlePress}>
      <Text style={styles.btnText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  btnPrimary: {
    width: '100%',
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 16,
    backgroundColor: '#FFBA33',
  },
  btnText: {
    fontSize: 18,
    fontWeight: 700,
    textAlign: 'center',
    color: '#6A4029',
  },
};

export default ButtonPrimary;
