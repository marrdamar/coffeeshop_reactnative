import {View, Text, ImageBackground} from 'react-native';
import React from 'react';
import ButtonSecondary from '../../components/ButtonSecondary';
import ButtonPrimary from '../../components/ButtonPrimary';
import authStyle from '../../styles/authStyle';
import {useNavigation} from '@react-navigation/native';

const Auth = () => {
  const navigation = useNavigation();
  return (
    <ImageBackground
      source={require('../../assets/images/bg-auth.png')}
      style={authStyle.bgAuth}>
      <View style={authStyle.mainAuth}>
        <View style={{width: '100%'}}>
          <Text style={authStyle.authTitle}>Welcome!</Text>
          <Text style={authStyle.authDesc}>
            Get a cup of coffee for free every sunday morning
          </Text>
        </View>
        <View style={authStyle.btnContainer}>
          <ButtonSecondary
            title="Create New Account"
            handlePress={() => navigation.navigate('Signup')}
          />
          <ButtonPrimary
            title="Login"
            handlePress={() => navigation.navigate('Login')}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default Auth;
