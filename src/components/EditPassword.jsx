import { View, Text, ActivityIndicator, TextInput } from 'react-native';
import React, { useMemo, useState } from 'react';
import { NativeBaseProvider, Center, Modal, Button } from 'native-base';
import globalStyle from '../styles/globalStyle';
import { editPasswordNoOtp } from '../utils/https/auth';
import { useSelector } from 'react-redux';
import BtnLoadingPrim from './BtnLoadingPrim';
import ToastFetching from './ToastFetching';

const EditPassword = ({ showModal, closeModal }) => {
  const userRedux = useSelector(state => state.user);
  const controller = useMemo(() => new AbortController(), []);
  const [oldPassword, setOldPass] = useState('');
  const [newPassword, setNewPass] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isToast, setToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({});

  const handleSubmit = async () => {
    const form = { oldPassword, newPassword };
    // console.log(form);
    setLoading(true);
    try {
      const result = await editPasswordNoOtp(userRedux.token, form, controller);
      console.log(result.data);
      if (result.status === 200) {
        setOldPass('');
        setNewPass('');
        setToastInfo({
          msg: `Password Updated!`,
          display: 'success',
        });
        setToast(true);
      }
      // if (result.status === 403) {
      // setToastInfo({
      //   msg: `Wrong Old Password!`,
      //   display: 'success',
      // });
      // setToast(true);
      // } else {
      //   setToastInfo({
      //     msg: `Password Updated!`,
      //     display: 'success',
      //   });
      //   setToast(true);
      // }
      setLoading(false);
    } catch (error) {
      console.log(error.response.status);
      if (error.response.status === 403) {
        setToastInfo({
          msg: `Wrong Old Password!`,
          display: 'success',
        });
        setToast(true);
      }
      setLoading(false);
    }
  };

  return (
    <NativeBaseProvider>
      <Center>
        <Modal isOpen={showModal} onClose={() => closeModal()}>
        <ToastFetching
          isShow={isToast}
          onClose={() => setToast(false)}
          info={toastInfo}
        />
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Edit Password</Modal.Header>
            <Modal.Body>
              <View style={{ marginBottom: 24, width: '100%' }}>
                <Text>Old Password :</Text>
                <TextInput
                  style={globalStyle.inputLine}
                  value={oldPassword}
                  onChangeText={text => setOldPass(text)}
                  secureTextEntry={true}
                  placeholder="Enter your old password"
                  placeholderTextColor={'black'}
                />
              </View>
              <View style={{ marginBottom: 24, width: '100%' }}>
                <Text>New Password :</Text>
                <TextInput
                  style={globalStyle.inputLine}
                  value={newPassword}
                  onChangeText={text => setNewPass(text)}
                  secureTextEntry={true}
                  placeholder="Enter your new password"
                  placeholderTextColor={'black'}
                />
              </View>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2} justifyContent="center" marginBottom={4}>
                {isLoading ? (
                  <Button backgroundColor={'#FFBA33'} w="100%">
                    <ActivityIndicator size="small" color="#6A4029" />
                  </Button>
                ) : (
                  <>
                    <Button
                      backgroundColor={'#6A4029'}
                      onPress={() => closeModal()}>
                      Close
                    </Button>
                    <Button backgroundColor={'#FFBA33'} onPress={handleSubmit}>
                      <Text style={{ color: 'black' }}>Save Change</Text>
                    </Button>
                  </>
                )}
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>
    </NativeBaseProvider>
  );
};

export default EditPassword;
