import {View, Text, ActivityIndicator} from 'react-native';
import React, {useMemo, useState} from 'react';
import {NativeBaseProvider, Center, Modal, Button} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {userAction} from '../redux/slices/auth';
import {cartAction} from '../redux/slices/cart';
import {authLogout} from '../utils/https/auth';

const Logout = ({showModal, closeModal}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const redux = useSelector(state => state);
  // console.log(redux.user, redux.cart);
  const controller = useMemo(() => new AbortController(), []);
  const [isLoading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const result = await authLogout(redux.user.token, controller);
      console.log(result.data);
    } catch (error) {
      console.log(error.response);
    }
    dispatch(userAction.authLogout());
    dispatch(cartAction.resetCart());
    setLoading(false);
    closeModal();
    navigation.replace('Welcome');
  };
  return (
    <NativeBaseProvider>
      <Center>
        <Modal isOpen={showModal} onClose={() => closeModal()}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Logout</Modal.Header>
            <Modal.Body>
              <Text>Are you sure want to logout?</Text>
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
                      Cancel
                    </Button>
                    <Button backgroundColor={'#FFBA33'} onPress={handleLogout}>
                      <Text style={{color: 'black'}}>Logout</Text>
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

export default Logout;
