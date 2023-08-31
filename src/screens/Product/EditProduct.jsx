import {
  View,
  ScrollView,
  Text,
  TextInput,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import {NativeBaseProvider, Radio, Stack, Box, Menu, NumberInput} from 'native-base';
import React, {useEffect, useMemo, useState} from 'react';
import ButtonSecondary from '../../components/ButtonSecondary';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import LoaderSpin from '../../components/LoaderSpin';
import {getProfile, updateProfile} from '../../utils/https/auth';
import globalStyle from '../../styles/globalStyle';
import ToastFetching from '../../components/ToastFetching';
import BtnLoadingSec from '../../components/BtnLoadingSec';
import ButtonPrimary from '../../components/ButtonPrimary';
import {useNavigation, useRoute} from '@react-navigation/native';

import {PermissionsAndroid} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  createProduct,
  deletingProduct,
  getProductsDetails,
  updateProduct,
} from '../../utils/https/product';
import LoaderScreen from '../../components/LoaderScreen';
import ModalMsg from '../../components/ModalMsg';

const EditProduct = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const userRedux = useSelector(state => state.user);
  // console.log('DATA REDUX USER', userRedux);
  const controller = useMemo(() => new AbortController(), []);
  const [isLoading, setLoading] = useState(false);
  const [isFetchLoading, setFetchLoading] = useState(false);
  const [isToast, setToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({});
  const [isSuccess, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [resultProd, setResultProd] = useState('');

  const [dataProd, setDataProd] = useState({});
  const [fileImage, setFileImage] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState(0);
  const [prices, setprices] = useState(0);
  const [desc, setDesc] = useState('');

  const fetching = async () => {
    setLoading(true);
    try {
      const result = await getProductsDetails(route.params.id, controller);
      setDataProd(result.data.data[0]);
      setName(result.data.data[0].names);
      const categ = result.data.data[0].categories_id;
      setCategory(categ === 'Coffee' ? 1 : categ === 'Foods' ? 3 : 2);
      setprices(result.data.data[0].prices);
      setDesc(result.data.data[0].desc_product)
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
console.log(dataProd);
  useEffect(() => {
    fetching();
  }, []);

  const onChangeCategory = value => {
    setCategory(value);
  };

  const handleSubmit = async () => {
    const form = {
      names: name,
      categories_id: category,
      prices,
      desc_product: desc,
    };
    if (name === '' || category === 0 || prices === '' || desc === '') {
      setToastInfo({msg: 'Input Empty', display: 'error'});
      setToast(true);
      return;
    }
    // console.log(form);
    setFetchLoading(true);
    try {
      const result = await updateProduct(
        userRedux.token,
        route.params.id,
        fileImage,
        form,
        controller,
      );
      // console.log(result.data.data[0]);
      if (result.status === 200) {
        setToastInfo({msg: 'Update Success', display: 'success'});
        setToast(true);
        setSuccess(true);
        setResultProd(result.data.data[0].id);
        console.log(result.data.data[0].id);
        console.log('SUCCESS');
      }
      setFetchLoading(false);
    } catch (error) {
      console.log(error);
      setFetchLoading(false);
    }
  };

  const handleInputImage = async method => {
    try {
      const checkGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (checkGranted) {
        console.log('Camera permission is granted.');
      } else {
        console.log('Camera permission is not granted.');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission to take pictures.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted.');
          // You can now access the camera.
        } else {
          console.log('Camera permission denied.');
          // Handle permission denied case.
        }
      }
    } catch (error) {
      console.log('Error checking camera permission:', error);
    }
    const option = {
      mediaType: 'photo',
      quality: 1,
    };
    if (method === 'camera') {
      // =======> CAMERA <=========
      launchCamera(option, res => {
        if (res.didCancel) {
          console.log('User cancel');
        } else if (res.errorCode) {
          console.log(res.errorMessage);
        } else {
          // const data = res.assets[0];
          console.log(res.assets);
          console.log('FILE IMAGE', res.assets);
          setFileImage(res.assets[0]);
        }
      });
    } else {
      // =======> GALERY <=========
      launchImageLibrary(option, res => {
        if (res.didCancel) {
          console.log('User cancel');
        } else if (res.errorCode) {
          console.log(res.errorMessage);
        } else {
          const data = res.assets;
          console.log('FILE IMAGE', data);
          setFileImage(res.assets[0]);
        }
      });
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deletingProduct(
        userRedux.token,
        route.params.id,
        controller,
      );
      console.log('RESULT', result.data);
      console.log('STATUS', result.status);
      if (result.status === 200) navigation.replace('Drawer');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoaderScreen />
      ) : (
        <NativeBaseProvider>
          <ToastFetching
            isShow={isToast}
            onClose={() => setToast(false)}
            info={toastInfo}
          />
          <View style={{position: 'absolute', top: 0}}>
            <ModalMsg
              showModal={showModal}
              closeModal={() => setShowModal(false)}
              msg={`Are you sure want to delete ${dataProd.names} from product list?`}
              onSubmit={handleDelete}
            />
          </View>
          <ScrollView style={{flex: 1}}>
            <Pressable onPress={() => setShowModal(true)} style={styles.btnDel}>
              <IonIcon name="trash" size={22} color="white" />
            </Pressable>
            <View style={styles.screen}>
              <View style={{marginBottom: 46}}>
                <Image
                  source={
                    fileImage
                      ? {uri: fileImage.uri}
                      : dataProd.image
                      ? {uri: dataProd.image}
                      : require('../../assets/images/no-image.png')
                  }
                  style={styles.imageProd}
                />
                <Box alignItems="flex-end">
                  <Menu
                    w="190"
                    trigger={triggerProps => {
                      return (
                        <Pressable {...triggerProps} style={styles.btnEdit}>
                          <FontAwesomeIcon
                            name="pencil"
                            size={24}
                            color="white"
                          />
                        </Pressable>
                      );
                    }}>
                    <Menu.Item onPress={() => handleInputImage('camera')}>
                      Camera
                    </Menu.Item>
                    <Menu.Item onPress={() => handleInputImage('galery')}>
                      Galery
                    </Menu.Item>
                  </Menu>
                </Box>
              </View>
              <View style={{marginBottom: 24, width: '100%'}}>
                <Text style={styles.textLabel}>Product Name :</Text>
                <TextInput
                  style={globalStyle.inputLine}
                  value={name}
                  onChangeText={text => setName(text)}
                  placeholder="Enter product name"
                  placeholderTextColor={'black'}
                />
              </View>

              <View style={{marginBottom: 24, width: '100%'}}>
                <Text style={styles.textLabel}>Prices :</Text>
                <TextInput
                  style={globalStyle.inputLine}
                  value={prices}
                  onChangeText={text => setprices(text)}
                  keyboardType="number-pad"
                  placeholder="Enter prices"
                  placeholderTextColor={'black'}
                />
              </View>

              <Radio.Group
                value={category}
                onChange={onChangeCategory}
                name="category"
                // accessibilityLabel="select prize"
              >
                <Text style={styles.textLabel}>Category :</Text>
                <Stack
                  direction="row"
                  space={2}
                  w="100%"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  marginTop={2}
                  marginBottom={6}>
                  <Radio value={1} my={1} colorScheme="warning">
                    Coffee
                  </Radio>
                  <Radio value={2} my={1} colorScheme="warning">
                    Non Coffee
                  </Radio>
                  <Radio value={3} my={1} colorScheme="warning">
                    Foods
                  </Radio>
                </Stack>
              </Radio.Group>

              <View style={{marginBottom: 24, width: '100%'}}>
                <Text style={styles.textLabel}>Description :</Text>
                <TextInput
                  style={globalStyle.inputLine}
                  value={desc}
                  onChangeText={text => setDesc(text)}
                  placeholder="Enter description"
                  placeholderTextColor={'black'}
                  multiline={true}
                />
              </View>

              <View style={{marginHorizontal: 20, width: '100%'}}>
                {isFetchLoading ? (
                  <BtnLoadingSec />
                ) : isSuccess ? (
                  <ButtonPrimary
                    title="See Product"
                    handlePress={() =>
                      navigation.replace('Detail', {id: resultProd})
                    }
                  />
                ) : (
                  <ButtonSecondary
                    title="Save Change"
                    handlePress={handleSubmit}
                  />
                )}
              </View>
            </View>
          </ScrollView>
        </NativeBaseProvider>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  screenLoad: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: '10%',
    paddingVertical: 20,
  },
  imageProd: {
    width: 240,
    height: 240,
    borderRadius: 36,
  },
  btnEdit: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6A4029',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -20,
    right: -20,
  },
  textReg: {
    fontFamily: 'Poppins-Regular',
    color: '#6A4029',
  },
  textBold: {
    fontFamily: 'Poppins-Bold',
    color: '#6A4029',
    fontSize: 20,
  },
  imgOrder: {
    width: 59,
    height: 64,
    borderRadius: 20,
  },
  textLabel: {
    fontFamily: 'Poppins-Bold',
    color: '#9F9F9F',
  },
  btnDel: {
    marginLeft: 'auto',
    marginRight: 20,
    width: 40,
    height: 40,
    backgroundColor: '#6A4029',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditProduct;
