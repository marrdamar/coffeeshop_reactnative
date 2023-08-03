import {View, Text, ImageBackground, TextInput} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import ButtonGoogle from '../../components/ButtonGoogle';
import ButtonSecondary from '../../components/ButtonSecondary';
import authStyle from '../../styles/authStyle';

import {useNavigation} from '@react-navigation/native';
import BtnLoadingSec from '../../components/BtnLoadingSec';
import {register} from '../../utils/https/auth';
import ToastFetching from '../../components/ToastFetching';
import {useSelector} from 'react-redux';

const Signup = () => {
  const controller = useMemo(() => new AbortController(), []);
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [isToast, setToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({});
  const [formEmail, setFormEmail] = useState('');
  const [formPass, setFormPass] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const userRedux = useSelector(state => state.user);
  // console.log(userRedux.token);
  useEffect(() => {
    if (userRedux.token) navigation.replace('Drawer');
  }, []);

  const handleSubmit = async () => {
    if ((formEmail === '', formPass === '', formPhone === '')) {
      setToast(true);
      setToastInfo({msg: 'Input Empty', display: 'error'});
      return;
    }
    setLoading(true);
    console.log(formEmail, formPass, formPhone);
    try {
      const result = await register(formEmail, formPass, formPhone, controller);
      console.log(result);
      setToast(true);
      setToastInfo({msg: 'Register Success', display: 'success'});
      setSuccess(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        setToast(true);
        setToastInfo({msg: error.response.data.msg, display: 'error'});
      }
      setLoading(false);
    }
  };
  return (
    <ImageBackground
      source={require('../../assets/images/bg-signup.png')}
      style={authStyle.bgAuth}>
      <ToastFetching
        isShow={isToast}
        onClose={() => setToast(false)}
        info={toastInfo}
      />
      <View style={authStyle.mainAuth}>
        <Text style={authStyle.authTitle}>Sign Up</Text>
        <View style={{width: '100%', paddingHorizontal: '5%', gap: 20}}>
          <TextInput
            style={authStyle.inputAuth}
            value={formEmail}
            onChangeText={text => setFormEmail(text)}
            placeholder="Enter your email address"
            placeholderTextColor={'white'}
          />
          <TextInput
            style={authStyle.inputAuth}
            value={formPass}
            onChangeText={text => setFormPass(text)}
            secureTextEntry={true}
            placeholder="Enter your password"
            placeholderTextColor={'white'}
          />
          <TextInput
            style={authStyle.inputAuth}
            value={formPhone}
            onChangeText={text => setFormPhone(text)}
            placeholder="Enter your phone number"
            placeholderTextColor={'white'}
            keyboardType="numeric"
          />
        </View>
        <View style={authStyle.btnContainer}>
          {isLoading ? (
            <BtnLoadingSec />
          ) : isSuccess ? (
            <ButtonSecondary
              title="Go Login"
              handlePress={() => navigation.navigate('Login')}
            />
          ) : (
            <ButtonSecondary
              title="Create Account"
              handlePress={handleSubmit}
            />
          )}
          <ButtonGoogle title="Create with Google" />
        </View>
      </View>
    </ImageBackground>
  );
};

export default Signup;
