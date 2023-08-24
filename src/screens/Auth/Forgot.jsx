import {View, Text, ImageBackground, TextInput} from 'react-native';
import React, {useMemo, useState} from 'react';
import ButtonSecondary from '../../components/ButtonSecondary';
import authStyle from '../../styles/authStyle';
import BtnLoadingSec from '../../components/BtnLoadingSec';
import {forgotEmail, setPassbyForgot} from '../../utils/https/auth';
import ButtonPrimary from '../../components/ButtonPrimary';
import BtnLoadingPrim from '../../components/BtnLoadingPrim';

import {useNavigation} from '@react-navigation/native';
import ToastFetching from '../../components/ToastFetching';

const Forgot = () => {
  const navigation = useNavigation();
  const controller = useMemo(() => new AbortController(), []);
  const [isLoading, setLoading] = useState(false);
  const [isToast, setToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({});
  const [isCode, setCode] = useState(false);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');

  const handleSendLink = async () => {
    if (email === '') {
      setToast(true);
      setToastInfo({msg: 'Input Empty', display: 'error'});
      setLoading(false);
      return;
    }
    setLoading(true);
    console.log(email);
    try {
      const result = await forgotEmail(email, controller);
      // console.log(result.data);
      if (result.status && result.status === 200) {
        setLoading(false);
        setCode(true);
      }
    } catch (error) {
      console.log(error.response);
      console.log(error.status);
      setLoading(false);
    }
  };

  const handleChangePass = async () => {
    if (email === '' || otp === '' || password === '') {
      setToast(true);
      setToastInfo({msg: 'Input Empty', display: 'error'});
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const result = await setPassbyForgot(email, otp, password, controller);
      // if (result.status === 403) {
      //   setToast(true);
      //   setToastInfo({msg: 'OTP Salah!', display: 'error'});
      // } else if (result.status === 500) {
      //   setToast(true);
      //   setToastInfo({msg: 'Input Salah!', display: 'error'});
      // } 
      // else {
      //   navigation.replace('Login');
      // }
      if (result.status === 200) {
        navigation.replace('Login');
      }
      setLoading(false);
    } catch (error) {
      if (error.response !== 200) {
        setToast(true);
        setToastInfo({msg: 'Wrong OTP Code!', display: 'error'});
      }
      // console.log('otp salah')
      // console.log(error.response);
      setLoading(false);
    }
  };
  return (
    <ImageBackground
      source={require('../../assets/images/bg-forgot.png')}
      style={authStyle.bgAuth}>
      <ToastFetching
        isShow={isToast}
        onClose={() => setToast(false)}
        info={toastInfo}
      />
      <View style={authStyle.mainAuth}>
        <View style={{alignItems: 'center'}}>
          <Text style={isCode ? authStyle.authTitleCode : authStyle.authTitle}>
            Don’t Worry!
          </Text>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Poppins-Regular',
              textAlign: 'center',
              maxWidth: '60%',
            }}>
            We’ve just sent a link to your email to request a new password
          </Text>
        </View>
        <View style={{width: '100%', paddingHorizontal: '5%', gap: 20}}>
          <TextInput
            style={authStyle.inputAuth}
            value={email}
            onChangeText={text => setEmail(text)}
            placeholder="Enter your email address"
            placeholderTextColor={'white'}
          />
          {isCode && (
            <>
              <TextInput
                style={[authStyle.inputAuth, {marginTop: 60}]}
                value={otp}
                onChangeText={text => setOtp(text)}
                placeholder="Enter your OTP"
                placeholderTextColor={'white'}
              />
              <TextInput
                style={[authStyle.inputAuth, {marginBottom: 20}]}
                value={password}
                onChangeText={text => setPassword(text)}
                placeholder="Enter your new password"
                placeholderTextColor={'white'}
              />
              {isLoading ? (
                <BtnLoadingPrim />
              ) : (
                <ButtonPrimary
                  title="Change Password"
                  handlePress={handleChangePass}
                />
              )}
            </>
          )}
        </View>
        <View style={authStyle.btnContainer}>
          {isCode && (
            <Text style={{color: 'white', fontFamily: 'Poppins-Regular'}}>
              Haven’t received any OTP?
            </Text>
          )}
          {isLoading ? (
            <BtnLoadingSec />
          ) : (
            <ButtonSecondary
              title={isCode ? 'Resend OTP' : 'Get OTP'}
              handlePress={handleSendLink}
            />
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

export default Forgot;
