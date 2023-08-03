import {
  ScrollView,
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import ButtonSecondary from '../../components/ButtonSecondary';
import globalStyle from '../../styles/globalStyle';
import {useDispatch, useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/native';
import PaymentProdList from '../../components/PaymentProdList';
import {addTransactions} from '../../utils/https/transaction';
import BtnLoadingSec from '../../components/BtnLoadingSec';
import ToastFetching from '../../components/ToastFetching';
import {useNavigation} from '@react-navigation/native';
import {cartAction} from '../../redux/slices/cart';
import ButtonPrimary from '../../components/ButtonPrimary';

import notifee from '@notifee/react-native';

const Payment = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  // console.log(route.params);
  const reduxStore = useSelector(state => state);
  const cartRedux = reduxStore.cart;
  // console.log('CART REDUX', cartRedux);
  const controller = useMemo(() => new AbortController(), []);
  const [isLoading, setLoading] = useState(false);
  const [isToast, setToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({});
  const [isSuccess, setSuccess] = useState(false);

  const handleSubmit = async () => {
    const dataShopping = cartRedux.shoppingCart.map(item => {
      const {image, prodName, price, qty, ...newItem} = item;
      return {...newItem, subtotal: price * qty, qty};
    });
    const body = {
      promo_id: 1,
      delivery_id: cartRedux.delivery,
      notes: '',
      pay_status_id: 1,
      payment_id: 1,
      products: dataShopping,
    };
    // console.log('BODY FETCHING', body);
    setLoading(true);
    try {
      const result = await addTransactions(
        reduxStore.user.token,
        body,
        controller,
      );
      // console.log('ADD TRANSACTION', result.data.data[0].history_id);
      if (result.status === 201) {
        try {
          await notifee.displayNotification({
            android: {channelId: 'urgent'},
            title: 'Thank You',
            subtitle: `ID = BC-${result.data.data[0].history_id}`,
            body: 'Your transaction order success',
          });
        } catch (error) {
          console.log(error);
        }
        setLoading(false);
        setToastInfo({msg: 'Transaction Success', display: 'success'});
        setToast(true);
        dispatch(cartAction.resetCart());
        setSuccess(true);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const taxFee = cartRedux.delivery == 2 ? 10000 : 0;
  const grandTotal = route.params.subtotal + taxFee;
  return (
    <ScrollView>
      <ToastFetching
        isShow={isToast}
        onClose={() => setToast(false)}
        info={toastInfo}
      />
      <View style={styles.screen}>
        <Text
          style={[
            globalStyle.titleScreen,
            {fontSize: 28, alignSelf: 'flex-start'},
          ]}>
          Payment Methods
        </Text>
        <View style={globalStyle.lineStyle}></View>
        <ScrollView horizontal={true}>
          <View style={{paddingVertical: 12}}>
            <Image
              source={require('../../assets/images/pay-card.png')}
              style={styles.cardPay}
            />
          </View>
        </ScrollView>
        <View style={{flexDirection: 'row', gap: 16, justifyContent: 'center'}}>
          <Pressable></Pressable>
          <Pressable></Pressable>
          <Pressable></Pressable>
          <Pressable></Pressable>
        </View>
        <View style={globalStyle.lineStyle}></View>
        <View style={{width: '100%', paddingVertical: 20, gap: 16}}>
          {cartRedux.shoppingCart.map(item => (
            <PaymentProdList key={item.product_id} data={item} />
          ))}
        </View>
        <View style={[globalStyle.lineStyle, styles.mb4]}></View>
        <View style={globalStyle.contentBetween}>
          <Text style={globalStyle.textReg}>Subtotal</Text>
          <Text style={globalStyle.textReg}>
            IDR {route.params.subtotal.toLocaleString('id-ID')}
          </Text>
        </View>
        <View style={[globalStyle.contentBetween, styles.mb4]}>
          <Text style={globalStyle.textReg}>Tax</Text>
          <Text style={globalStyle.textReg}>
            IDR {taxFee.toLocaleString('id-ID')}
          </Text>
        </View>
        <View style={globalStyle.contentBetween}>
          <Text style={[globalStyle.textBold, {fontSize: 20}]}>Total</Text>
          <Text style={[globalStyle.textBold, styles.mb4, {fontSize: 20}]}>
            IDR {grandTotal.toLocaleString('id-ID')}
          </Text>
        </View>
        {isLoading ? (
          <BtnLoadingSec />
        ) : isSuccess ? (
          <ButtonPrimary
            title="Go Home"
            handlePress={() => navigation.navigate('Home')}
          />
        ) : (
          <ButtonSecondary title="Pay Now" handlePress={handleSubmit} />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: '10%',
    paddingVertical: 16,
  },
  cardPay: {
    width: 300,
    height: 184,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  mb4: {
    marginBottom: 16,
  },
});

export default Payment;
