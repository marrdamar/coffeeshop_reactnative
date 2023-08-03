import {TouchableOpacity, Text, ActivityIndicator, View} from 'react-native';
import React from 'react';

const BtnLoadingSec = props => {
  return (
    <TouchableOpacity style={styles.btnWhite} onPress={props.handleNavigate}>
      <View style={styles.innerBtn}>
        <ActivityIndicator size="large" color="#FFBA33" />
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  btnWhite: {
    width: '100%',
    paddingTop: 14,
    paddingBottom: 14,
    borderRadius: 16,
    backgroundColor: '#6A4029',
  },
  innerBtn: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
};

export default BtnLoadingSec;
