import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ButtonSecondary from './ButtonSecondary';
import {useNavigation} from '@react-navigation/native';

const NoCart = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="cart-outline" size={160} color="#C7C7C7" />
        <Text style={styles.textTitle}>No orders yet</Text>
        <Text style={styles.textInfo}>
          Hit the orange button down below to Create an order
        </Text>
      </View>
      <ButtonSecondary
        title="Start Ordering"
        handlePress={() => navigation.navigate('Products')}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    marginTop: 140,
    alignItems: 'center',
  },
  textTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: 'black',
  },
  textInfo: {
    maxWidth: 260,
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: 'black',
    textAlign: 'center',
  },
});

export default NoCart;
