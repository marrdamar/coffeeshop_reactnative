import {View, Text} from 'react-native';
import React from 'react';
import {NativeBaseProvider, Center, Modal, Button} from 'native-base';

const ModalMsg = ({showModal, closeModal, onSubmit, msg}) => {
  return (
    <NativeBaseProvider>
      <Center>
        <Modal isOpen={showModal} onClose={() => closeModal()}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Delete</Modal.Header>
            <Modal.Body>
              <Text>{msg}</Text>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2} justifyContent="center" marginBottom={4}>
                <Button
                  backgroundColor={'#6A4029'}
                  onPress={() => closeModal()}>
                  Cancel
                </Button>
                <Button backgroundColor={'#FFBA33'} onPress={() => onSubmit()}>
                  <Text style={{color: 'black'}}>Delete</Text>
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>
    </NativeBaseProvider>
  );
};

export default ModalMsg;
