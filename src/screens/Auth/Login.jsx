import {
  View,
  Text,
  ImageBackground,
  Pressable,
  TextInput,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import ButtonGoogle from '../../components/ButtonGoogle';
import authStyle from '../../styles/authStyle';
import ButtonPrimary from '../../components/ButtonPrimary';

import {useNavigation} from '@react-navigation/native';
import {fetchLogin} from '../../utils/https/auth';
import {useDispatch, useSelector} from 'react-redux';
import {userAction} from '../../redux/slices/auth';
import ToastFetching from '../../components/ToastFetching';
import BtnLoadingPrim from '../../components/BtnLoadingPrim';

const Login = () => {
  const dispatch = useDispatch();
  const controller = useMemo(() => new AbortController(), []);
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(false);
  const [isToast, setToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({});
  const [formEmail, setFormEmail] = useState('');
  const [formPass, setFormPass] = useState('');
  const userRedux = useSelector(state => state.user);
  // console.log(userRedux.token);
  useEffect(() => {
    if (userRedux.token) navigation.replace('Drawer');
  }, []);

  const handleSubmit = async () => {
    if (formEmail === '' || formPass === '') {
      setToast(true);
      setToastInfo({msg: 'Input Empty', display: 'error'});
      setLoading(false);
      return;
    }
    setLoading(true);
    console.log(formEmail, formPass);
    const form = {email: formEmail, password: formPass};
    try {
      const result = await fetchLogin(form, controller);
      console.log(result);
      dispatch(userAction.authLogin(result.data));
      navigation.replace('Drawer');
      setLoading(false);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        console.log(error.response.data);
        setToastInfo({msg: error.response.data.msg, display: 'error'});
        setToast(true);
      }
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/bg-login.png')}
      style={authStyle.bgAuth}>
      <ToastFetching
        isShow={isToast}
        onClose={() => setToast(false)}
        info={toastInfo}
      />
      <View style={authStyle.mainAuth}>
        <Text style={authStyle.authTitle}>Login</Text>
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
          <Pressable onPress={() => navigation.navigate('Forgot')}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>
        </View>
        <View style={authStyle.btnContainer}>
          {isLoading ? (
            <BtnLoadingPrim />
          ) : (
            <ButtonPrimary title="Login" handlePress={handleSubmit} />
          )}
          <View style={styles.lineContainer}>
            <View style={styles.line}></View>
            <Text style={{color: 'white', fontFamily: 'Poppins-Regular'}}>
              or Login in with
            </Text>
            <View style={styles.line}></View>
          </View>
          <ButtonGoogle
            title="Login with Google"
            // handlePress={() => navigation.navigate('Drawer')}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  lineContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: '5%',
    gap: 12,
  },
  forgotText: {
    textDecorationLine: 'underline',
    fontFamily: 'Poppins-Regular',
    color: 'white',
    marginTop: 10,
  },
  line: {
    height: 1,
    width: '28%',
    borderBottomWidth: 1,
    borderColor: 'white',
  },
});

export default Login;
