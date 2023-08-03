import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import CardCartProd from '../../components/CardCartProd';
import ButtonPrimary from '../../components/ButtonPrimary';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import NoCart from '../../components/NoCart';

const Cart = () => {
  const navigation = useNavigation();
  const cartRedux = useSelector(state => state.cart);
  const {shoppingCart} = cartRedux;
  // console.log(shoppingCart);

  let subtotal = 0;
  shoppingCart.forEach(item => {
    subtotal += item.price * item.qty;
  });
  // const itemprice = cartRedux.item.price
  const taxFee = subtotal * 0.1;
  const total = subtotal + taxFee;
  console.log(cartRedux)
  return (
    <View style={styles.screen}>
      {shoppingCart.length < 1 ? (
        <NoCart />
      ) : (
        <>
          <ScrollView>
            <View style={{paddingBottom: 16}}>
              {shoppingCart.length >= 1 &&
                shoppingCart.map(cart => (
                  <CardCartProd key={cart.product_id} data={cart} />
                ))}
            </View>
          </ScrollView>
          <View style={{marginTop: 8, marginBottom: 16}}>
            <ButtonPrimary title="Apply Delivery Coupons  &#10140;" />
          </View>
          <View style={{borderBottomWidth: 2, borderColor: '#ADADAF'}}></View>
          <View style={{gap: 8, paddingVertical: 14, paddingHorizontal: 6}}>
            <View style={styles.infoPayment}>
              <Text style={styles.textInfo}>Item Total</Text>
              <Text style={styles.textPayment}>
                IDR {subtotal.toLocaleString('id-ID')}
              </Text>
            </View>
            <View style={styles.infoPayment}>
              <Text style={styles.textInfo}>Delivery Charge</Text>
              <Text style={styles.textPayment}>IDR 0</Text>
            </View>
            <View style={styles.infoPayment}>
              <Text style={styles.textInfo}>Tax</Text>
              <Text style={styles.textPayment}>
                IDR {taxFee.toLocaleString('id-ID')}
              </Text>
            </View>
            <View style={[styles.infoPayment, {marginTop: 16}]}>
              <Text style={styles.textTotal}>Total : </Text>
              <Text style={styles.textTotal}>
                IDR {total.toLocaleString('id-ID')}
              </Text>
            </View>
          </View>
          <ButtonPrimary
            title="&#10095;  CHECKOUT"
            handlePress={() => navigation.navigate('Delivery', {total})}
          />
        </>
      )}
    </View>
  );
};

styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: '10%',
    paddingBottom: 20,
  },
  infoPayment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInfo: {
    fontFamily: 'Poppins-Bold',
    color: '#ADADAF',
  },
  textPayment: {
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  textTotal: {
    fontFamily: 'Poppins-Bold',
    color: 'black',
    fontSize: 20,
  },
});

export default Cart;
