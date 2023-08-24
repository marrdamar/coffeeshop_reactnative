import {
  View,
  ScrollView,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import {NativeBaseProvider, Radio, Center, Modal, Button} from 'native-base';
import ButtonSecondary from '../../components/ButtonSecondary';
import globalStyle from '../../styles/globalStyle';
import {useDispatch, useSelector} from 'react-redux';
import {cartAction} from '../../redux/slices/cart';
import {useNavigation, useRoute} from '@react-navigation/native';
import {userAction} from '../../redux/slices/auth';

const ModalEdit = ({showModal, closeModal}) => {
  const dispatch = useDispatch();
  const userRedux = useSelector(state => state.user);
  const [name, setName] = useState(userRedux.displayName);
  const [address, setAddress] = useState(userRedux.address);
  const [phone, setPhone] = useState(userRedux.phone);

  const handleChange = () => {
    dispatch(userAction.editDeliveryAddress({name, address, phone}));
    closeModal();
  };
  return (
    <NativeBaseProvider>
      <Center>
        <Modal isOpen={showModal} onClose={() => closeModal()}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Delete</Modal.Header>
            <Modal.Body>
              <View style={{marginBottom: 24, width: '100%'}}>
                <Text style={styles.textLabel}>Display Name :</Text>
                <TextInput
                  style={globalStyle.inputLine}
                  placeholder="Enter receiver name"
                  value={name}
                  onChangeText={text => setName(text)}
                  placeholderTextColor={'black'}
                />
              </View>
              <View style={{marginBottom: 24, width: '100%'}}>
                <Text style={styles.textLabel}>Address :</Text>
                <TextInput
                  style={globalStyle.inputLine}
                  placeholder="Enter your delivery address"
                  value={address}
                  onChangeText={text => setAddress(text)}
                  placeholderTextColor={'black'}
                  multiline={true}
                />
              </View>
              <View style={{marginBottom: 24, width: '100%'}}>
                <Text style={styles.textLabel}>Phone Number :</Text>
                <TextInput
                  style={globalStyle.inputLine}
                  placeholder="Enter your phone number"
                  value={phone.toString()}
                  onChangeText={text => setPhone(text)}
                  placeholderTextColor={'black'}
                  keyboardType="number-pad"
                />
              </View>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2} justifyContent="center" marginBottom={4}>
                <Button
                  backgroundColor={'#6A4029'}
                  onPress={() => closeModal()}>
                  Cancel
                </Button>
                <Button backgroundColor={'#FFBA33'} onPress={handleChange}>
                  <Text style={{color: 'black'}}>Save Change</Text>
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>
    </NativeBaseProvider>
  );
};

const Delivery = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  // console.log(route.params.total);
  const userRedux = useSelector(state => state.user);
  const [showModal, setShowModal] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState(3);

  const onChangeDelivery = value => {
    setDeliveryMethod(value);
  };
  const handleConfirm = () => {
    // console.log(deliveryMethod);
    dispatch(cartAction.deliveryMethod(deliveryMethod));
    navigation.navigate('Payment', {subtotal: route.params.total});
  };
  return (
    <NativeBaseProvider>
      <ScrollView>
        <ModalEdit
          showModal={showModal}
          closeModal={() => setShowModal(false)}
        />
        <View style={styles.screen}>
          <Text style={globalStyle.titleScreen}>Delivery</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.titleContent}>Address details</Text>
            <Pressable onPress={() => setShowModal(true)}>
              <Text style={styles.textPress}>change</Text>
            </Pressable>
          </View>
          <View style={styles.content}>
            <Text style={styles.textAddress}>{userRedux.displayName}</Text>
            <View style={globalStyle.lineStyle}></View>
            <Text style={styles.textDesc}>{userRedux.address}</Text>
            <View style={globalStyle.lineStyle}></View>
            <Text style={styles.textDesc}>{userRedux.phone}</Text>
          </View>
          <Text style={[styles.titleContent, {marginTop: 16}]}>
            Delivery methods
          </Text>

          <View style={styles.content}>
            <Radio.Group
              // defaultValue="3"
              value={deliveryMethod}
              onChange={onChangeDelivery}
              name="delivery"
              // accessibilityLabel="select prize"
            >
              <Radio value={1} my={1} colorScheme="warning">
                Dine in
              </Radio>
              <View
                style={[globalStyle.lineStyle, {marginVertical: 12}]}></View>
              <Radio value={2} my={1} colorScheme="warning">
                Door Delivery
              </Radio>
              <View
                style={[globalStyle.lineStyle, {marginVertical: 12}]}></View>
              <Radio value={3} my={1} colorScheme="warning">
                Take Away
              </Radio>
            </Radio.Group>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 16,
            }}>
            <Text style={styles.textTotal}>Total</Text>
            <Text style={styles.textPrice}>
              IDR {route.params.total.toLocaleString('id-ID')}
            </Text>
          </View>
          <ButtonSecondary
            title="Confirm and Pay"
            handlePress={handleConfirm}
          />
        </View>
      </ScrollView>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    paddingHorizontal: '10%',
    paddingVertical: 16,
    gap: 10,
  },
  titleContent: {
    fontFamily: 'Poppins-Bold',
    color: 'black',
    fontSize: 17,
  },
  textPress: {
    color: '#6A4029',
    fontFamily: 'Poppins-Regular',
  },
  textAddress: {
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
  },
  textDesc: {
    fontFamily: 'Poppins-Bold',
    color: 'black',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 6,
  },
  textTotal: {
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
    fontSize: 18,
  },
  textPrice: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: 'black',
  },
  textLabel: {
    fontFamily: 'Poppins-Bold',
    color: '#9F9F9F',
  },
});

export default Delivery;
