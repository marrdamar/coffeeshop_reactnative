import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';

const ToastFetching = ({isShow, onClose, info}) => {
  const backgroundColor = info.display === 'error' ? '#FECACA' : '#BBF7D0';

  useEffect(() => {
    let timeout;
    if (isShow) {
      timeout = setTimeout(() => {
        onClose();
      }, 5000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isShow, onClose]);

  return (
    <>
      {isShow && (
        <View style={styles.mainScreen}>
          <View style={[styles.container, {backgroundColor}]}>
            <Text style={styles.textMsg}>{info.msg}</Text>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  mainScreen: {
    position: 'absolute',
    zIndex: 100,
    top: 20,
    left: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    maxWidth: '90%',
    padding: 10,
    paddingHorizontal: 20,
    // backgroundColor: 'rgba(255, 255, 255, 0.6)',
    // backgroundColor: {info.display === 'error' ? "#FECACA" : "#bae6fd"},
    borderRadius: 8,
    // borderWidth: 2,
    // borderColor: 'red',
    alignItems: 'center',
  },
  textMsg: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: 'black',
  },
});

export default ToastFetching;
