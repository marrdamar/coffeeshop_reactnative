import React, {useEffect} from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const MySplashScreen = () => {
  const navigation = useNavigation();
  const userRedux = useSelector(state => state.user);
  // console.log(userRedux.token);
  useEffect(() => {
    setTimeout(() => {
      if (userRedux.token) navigation.replace('Drawer');
      else navigation.replace('Welcome');
    }, 5000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/icons/icon-logo.png')}
        style={styles.logo}
      />
      <Text style={styles.textBrand}>CoffeeShop</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  textNot: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 36,
    color: '#FFBA33',
    textAlign: 'center',
    marginTop: 40,
  },
  textBrand: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 36,
    color: '#6A4029',
    textAlign: 'center',
  },
});

export default MySplashScreen;
