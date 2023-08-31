import {
  View,
  ScrollView,
  Text,
  TextInput,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import {NativeBaseProvider, Radio, Stack, Box, Menu} from 'native-base';
import React, {useEffect, useMemo, useState} from 'react';
import ButtonSecondary from '../../components/ButtonSecondary';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import LoaderSpin from '../../components/LoaderSpin';
import {getProfile, updateProfile} from '../../utils/https/auth';
import globalStyle from '../../styles/globalStyle';
import ToastFetching from '../../components/ToastFetching';
import BtnLoadingSec from '../../components/BtnLoadingSec';
import ButtonPrimary from '../../components/ButtonPrimary';
import {useNavigation} from '@react-navigation/native';

import DateTimePicker from '@react-native-community/datetimepicker';
import {PermissionsAndroid} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {userAction} from '../../redux/slices/auth';

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userRedux = useSelector(state => state.user);
  // console.log('DATA REDUX USER', userRedux);
  const controller = useMemo(() => new AbortController(), []);
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [isToast, setToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({});
  const [isSuccess, setSuccess] = useState(false);

  const [disName, setDisName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [fileImage, setFileImage] = useState('');

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
    // console.log(currentDate);
  };

  const fetching = async () => {
    setLoading(true);
    try {
      const result = await getProfile(userRedux.token, controller);
      console.log('DATA PROFILE', result.data.data);
      setData(result.data.data);
      setDisName(result.data.data.display_name || '');
      setFirstName(result.data.data.first_name || '');
      setLastName(result.data.data.last_name || '');
      setGender(result.data.data.genders || '');
      setDate(new Date(result.data.data.birth_date) || new Date());
      setAddress(result.data.data.address || '');
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetching();
  }, []);

  const onChangeGender = value => {
    setGender(value);
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
  // console.log('TOKEN', userRedux.token);
  // console.log(data.profile_picture);
  // console.log(date);

  const handleEditProfile = async () => {
    const userData = {};
    if (disName !== '') userData.display_name = disName;
    if (firstName !== '') userData.first_name = firstName;
    if (lastName !== '') userData.last_name = lastName;
    if (gender !== '') userData.genders = gender;
    if (date !== new Date()) userData.birth_date = date.toLocaleDateString();
    if (address !== '') userData.address = address;
    // const userData = {
    //   display_name: disName,
    //   first_name: firstName,
    //   last_name: lastName,
    //   gender,
    //   email,
    //   phone,
    //   birth_date: date.toLocaleDateString(),
    //   address,
    // };
    console.log('BODY', userData);
    setFetchLoading(true);
    try {
      const result = await updateProfile(
        userRedux.token,
        fileImage,
        userData,
        controller,
      );
      console.log('HASIL UPDATE', result);
      if (result.status === 200) {
        dispatch(userAction.editProfile(result.data.data[0]));
        setToastInfo({msg: 'Update Success', display: 'success'});
        setToast(true);
        setSuccess(true);
        setFetchLoading(false);
      }
    } catch (error) {
      console.log(error);
      setFetchLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <View style={styles.screenLoad}>
          <LoaderSpin />
        </View>
      ) : (
        <NativeBaseProvider>
          <ToastFetching
            isShow={isToast}
            onClose={() => setToast(false)}
            info={toastInfo}
          />
          <ScrollView style={{flex: 1}}>
            <View style={styles.screen}>
              <View style={{marginBottom: 24}}>
                <Image
                  source={
                    fileImage !== ''
                      ? {uri: fileImage.uri}
                      : data.profile_image
                      ? {uri: data.profile_image}
                      : require('../../assets/images/ph-users.png')
                  }
                  style={styles.imageUser}
                />

                <Box alignItems="flex-end">
                  <Menu
                    w="190"
                    trigger={triggerProps => {
                      return (
                        <Pressable {...triggerProps} style={styles.btnEdit}>
                          <FontAwesomeIcon
                            name="pencil"
                            size={18}
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
                <Text style={styles.textLabel}>Display Name :</Text>
                <TextInput
                  style={globalStyle.inputLine}
                  value={disName}
                  onChangeText={text => setDisName(text)}
                  placeholder="Enter your display name"
                  placeholderTextColor={'black'}
                />
              </View>
              <View style={{marginBottom: 24, width: '100%'}}>
                <Text style={styles.textLabel}>First Name :</Text>
                <TextInput
                  style={globalStyle.inputLine}
                  value={firstName}
                  onChangeText={text => setFirstName(text)}
                  placeholder="Enter your first name"
                  placeholderTextColor={'black'}
                />
              </View>
              <View style={{marginBottom: 24, width: '100%'}}>
                <Text style={styles.textLabel}>Last Name :</Text>
                <TextInput
                  style={globalStyle.inputLine}
                  value={lastName}
                  onChangeText={text => setLastName(text)}
                  placeholder="Enter your last name"
                  placeholderTextColor={'black'}
                />
              </View>

              <Radio.Group
                flexDirection="row"
                value={gender}
                onChange={onChangeGender}
                name="gender"
                // accessibilityLabel="select prize"
              >
                <Stack direction="row" space={6} w="100%" marginBottom={6}>
                  <Text style={styles.textLabel}>Gender :</Text>
                  <Radio value="male" my={1} colorScheme="warning">
                    Male
                  </Radio>
                  <Radio value="female" my={1} colorScheme="warning">
                    Female
                  </Radio>
                </Stack>
              </Radio.Group>

              {/* <View style={{marginBottom: 24, width: '100%'}}>
                <Text style={styles.textLabel}>Email :</Text>
                <TextInput
                  style={globalStyle.inputLine}
                  value={email}
                  onChangeText={text => setEmail(text)}
                  placeholder="Enter your email address"
                  placeholderTextColor={'black'}
                />
              </View>
              <View style={{marginBottom: 24, width: '100%'}}>
                <Text style={styles.textLabel}>Phone Number :</Text>
                <TextInput
                  style={globalStyle.inputLine}
                  value={phone}
                  onChangeText={text => setPhone(text)}
                  placeholder="Enter your phone number"
                  keyboardType="numeric"
                  placeholderTextColor={'black'}
                />
              </View> */}
              {/* BRITHDATE */}
              <View style={{marginBottom: 24, width: '100%'}}>
                <Text style={styles.textLabel}>Birth Date :</Text>
                <Pressable
                  onPress={() => setShowPicker(true)}
                  style={styles.dateStyle}>
                  <Text style={styles.textDate}>
                    {date.toLocaleDateString('id-ID')}
                  </Text>
                  <FontAwesomeIcon name="calendar" size={22} color="#9F9F9F" />
                </Pressable>
                {showPicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChange}
                  />
                )}
              </View>

              <View style={{marginBottom: 24, width: '100%'}}>
                <Text style={styles.textLabel}>Delivery Address :</Text>
                <TextInput
                  style={globalStyle.inputLine}
                  value={address}
                  onChangeText={text => setAddress(text)}
                  placeholder="Enter your delivery address"
                  placeholderTextColor={'black'}
                  multiline={true}
                />
              </View>
              <View style={{marginHorizontal: 20, width: '100%'}}>
                {fetchLoading ? (
                  <BtnLoadingSec />
                ) : isSuccess ? (
                  <ButtonPrimary
                    title="Back Profile"
                    handlePress={() => navigation.navigate('Profile')}
                  />
                ) : (
                  <ButtonSecondary
                    title="Save Change"
                    handlePress={handleEditProfile}
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
  imageUser: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  btnEdit: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6A4029',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 4,
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
  dateStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'black',
    paddingVertical: 10,
  },
  textDate: {
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
});

export default EditProfile;
