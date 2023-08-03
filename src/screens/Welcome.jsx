import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import React from 'react';
import ButtonPrimary from '../components/ButtonPrimary';
import {useNavigation} from '@react-navigation/native';

const Welcome = () => {
  const navigation = useNavigation();
  return (
    <ImageBackground
      source={require('../assets/images/bg-main.png')}
      style={styles.bgHome}>
      <View style={styles.mainHome}>
        <Text style={styles.homeText}>Coffee for Everyone</Text>
        <View style={{width: '90%'}}>
          <ButtonPrimary
            title="Get Started"
            handlePress={() => navigation.navigate('Auth')}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgHome: {
    flex: 1,
    resizeMode: 'cover',
  },
  mainHome: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 30,
  },
  homeText: {
    marginTop: 110,
    fontSize: 65,
    // fontWeight: 700,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    color: 'white',
  },
});

export default Welcome;
