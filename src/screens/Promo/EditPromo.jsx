import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  FlatList,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {NativeBaseProvider, Box, Menu} from 'native-base';
import {debounce} from 'lodash';

import {
  addPromos,
  deletingPromo,
  editingPromo,
  getProducts,
} from '../../utils/https/product';
import LoaderSpin from '../../components/LoaderSpin';
import CardListProduct from '../../components/CardListProduct';
import {useRoute} from '@react-navigation/native';

import {useNavigation} from '@react-navigation/native';
import globalStyle from '../../styles/globalStyle';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import ButtonSecondary from '../../components/ButtonSecondary';
import BtnLoadingSec from '../../components/BtnLoadingSec';
import ButtonPrimary from '../../components/ButtonPrimary';
import {useSelector} from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import ModalMsg from '../../components/ModalMsg';

const EditPromo = () => {
  const route = useRoute();
  const {data} = route.params;
  // console.log(data.id);
  const navigation = useNavigation();
  const userRedux = useSelector(state => state.user);
  const controller = useMemo(() => new AbortController(), []);
  const [isToast, setToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [fetchLoading, setFetchLoad] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const [discPrice, setDiscPrice] = useState(
    data.prices - (data.prices * data.discount) / 100,
  );
  const [discount, setDiscount] = useState(data.discount);
  const [couponCode, setCouponCode] = useState(data.coupon_code);
  const [descript, setDescript] = useState(data.coupon_desc);
  const [expDate, setExpDate] = useState(new Date(data.coupon_expired));
  const [title, setTitle] = useState(data.title)
  const [showPicker, setShowPicker] = useState(false);

  const onChangeDiscount = text => {
    if (parseInt(text) > 100) return;
    setDiscount(text);
    const newPrice = (parseInt(data.prices) * parseInt(text)) / 100;
    if (parseInt(text) > 0)
      return setDiscPrice(parseInt(data.prices) - newPrice);
    setDiscPrice('');
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || expDate;
    setShowPicker(false);
    setExpDate(currentDate);
    // console.log(currentDate);
  };

  const handleSubmit = async () => {
    const form = {
      product_id: data.product_id,
      title,
      coupon_code: couponCode.toUpperCase(),
      discount: parseInt(discount),
      description: descript,
      expired_at: expDate.toLocaleDateString(),
    };
    // console.log(form);
    setFetchLoad(true);
    try {
      const result = await editingPromo(
        userRedux.token,
        data.id,
        form,
        controller,
      );
      // console.log(result);
      setFetchLoad(false);
      if (result.status === 200) setSuccess(true);
    } catch (error) {
      console.log(error.response);
      setFetchLoad(false);
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deletingPromo(userRedux.token, data.id, controller);
      console.log(result);
      console.log(result.status);
      if (result.status === 200) {
        setShowModal(false);
        navigation.replace('Promos');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView>
      <ModalMsg
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        msg={`Are you sure want to delete ${data.names} from promo list?`}
        onSubmit={handleDelete}
      />
      <View style={styles.mainScreen}>
        <View style={{alignItems: 'center'}}>
          <View
            style={{
              position: 'relative',
              width: '100%',
              alignItems: 'center',
              marginBottom: 24,
            }}>
            <Image
              source={
                data.image
                  ? {uri: data.image}
                  : require('../../assets/images/no-image.png')
              }
              style={styles.imageProd}
            />
            <Pressable onPress={() => setShowModal(true)} style={styles.btnDel}>
              <IonIcon name="trash" size={22} color="white" />
            </Pressable>
          </View>
          <Text style={styles.textName}>{data.names}</Text>
          {discPrice === '' || discPrice === 0 ? (
            <Text style={styles.textPrice}>
              IDR {data.prices.toLocaleString('id-ID')}
            </Text>
          ) : (
            <View style={{position: 'relative'}}>
              <Text style={styles.onDiscount}>
                IDR {data.prices.toLocaleString('id-ID')}
              </Text>
              <View style={styles.lineDiscount}></View>
              <Text style={styles.textDiscPrice}>
                IDR {discPrice.toLocaleString('id-ID')}
              </Text>
            </View>
          )}
          <View style={{marginBottom: 24, width: '100%'}}>
            <Text style={styles.textLabel}>Title :</Text>
            <TextInput
              style={globalStyle.inputLine}
              placeholder="Enter title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={'black'}
            />
          </View>
          <View style={{marginBottom: 24, width: '100%'}}>
            <Text style={styles.textLabel}>Discount :</Text>
            <TextInput
              style={globalStyle.inputLine}
              placeholder="Enter discount"
              value={discount.toString()}
              onChangeText={onChangeDiscount}
              placeholderTextColor={'black'}
              keyboardType="number-pad"
            />
          </View>
          <View style={{marginBottom: 24, width: '100%'}}>
            <Text style={styles.textLabel}>Coupon Code :</Text>
            <TextInput
              style={globalStyle.inputLine}
              placeholder="Enter coupon code"
              value={couponCode}
              onChangeText={text => setCouponCode(text)}
              placeholderTextColor={'black'}
            />
          </View>

          <View style={{marginBottom: 24, width: '100%'}}>
            <Text style={styles.textLabel}>Expired Date :</Text>
            <Pressable
              onPress={() => setShowPicker(true)}
              style={styles.dateStyle}>
              <Text style={styles.textDate}>
                {expDate.toLocaleDateString('id-ID')}
              </Text>
              <FontAwesomeIcon name="calendar" size={22} color="#9F9F9F" />
            </Pressable>
            {showPicker && (
              <DateTimePicker
                value={expDate}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
          </View>

          <View style={{marginBottom: 24, width: '100%'}}>
            <Text style={styles.textLabel}>Description :</Text>
            <TextInput
              style={globalStyle.inputLine}
              placeholder="Enter Description"
              value={descript}
              onChangeText={text => setDescript(text)}
              placeholderTextColor={'black'}
            />
          </View>
          {isSuccess ? (
            <ButtonPrimary
              title="Go Home"
              handlePress={() => navigation.replace('Drawer')}
            />
          ) : fetchLoading ? (
            <BtnLoadingSec />
          ) : (
            <ButtonSecondary title="Save Change" handlePress={handleSubmit} />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  content: {
    justifyContent: 'center',
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
  notFound: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#6A4029',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 60,
  },
  listContainer: {
    marginTop: 18,
    gap: 16,
  },
  cardContainer: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 16,
  },
  textCard: {
    fontFamily: 'Poppins-Bold',
    color: 'black',
  },
  imageProd: {
    width: 240,
    height: 240,
    borderRadius: 36,
  },
  textName: {
    fontFamily: 'Poppins-Bold',
    color: 'black',
    fontSize: 24,
  },
  textPrice: {
    fontFamily: 'Poppins-Bold',
    color: '#6A4029',
    fontSize: 20,
    marginBottom: 20,
  },
  onDiscount: {
    fontFamily: 'Poppins-Bold',
    color: '#9F9F9F',
    fontSize: 20,
    marginBottom: 20,
  },
  textDiscPrice: {
    fontFamily: 'Poppins-Bold',
    color: '#6A4029',
    fontSize: 20,
    position: 'absolute',
    top: 20,
    left: 20,
  },
  lineDiscount: {
    position: 'absolute',
    width: 120,
    height: 2,
    borderBottomWidth: 2,
    borderBottomColor: '#9F9F9F',
    top: 14,
    left: -6,
  },
  btnDel: {
    position: 'absolute',
    top: -4,
    right: -10,
    marginLeft: 'auto',
    marginRight: 20,
    width: 40,
    height: 40,
    backgroundColor: '#6A4029',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditPromo;
