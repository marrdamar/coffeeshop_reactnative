import {TouchableOpacity, Text, ActivityIndicator, View} from 'react-native';
import React from 'react';

const BtnLoadingPrim = props => {
  return (
    <TouchableOpacity style={styles.btnWhite} onPress={props.handleNavigate}>
      <View style={styles.innerBtn}>
        <ActivityIndicator size="large" color="#6A4029" />
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
    backgroundColor: '#FFBA33',
  },
  innerBtn: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
};

export default BtnLoadingPrim;
