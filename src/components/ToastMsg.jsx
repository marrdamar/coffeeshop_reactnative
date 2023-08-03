import {View, Text} from 'react-native';
import {NativeBaseProvider, Slide, Alert} from 'native-base';
import React, {useEffect} from 'react';

const ToastMsg = ({isShow, onClose, info}) => {
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
    <NativeBaseProvider>
      <Slide in={isShow} placement="top">
        <Alert justifyContent="center" status="error" safeAreaTop={8}>
          <Alert.Icon />
          <Text color="error.600" fontWeight="medium">
            No Internet Connection
          </Text>
        </Alert>
      </Slide>
    </NativeBaseProvider>
  );
};

export default ToastMsg;
