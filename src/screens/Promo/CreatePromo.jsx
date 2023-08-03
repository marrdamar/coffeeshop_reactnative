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

import {addPromos, getProducts} from '../../utils/https/product';
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

const CreatePromo = () => {
  const navigation = useNavigation();
  const userRedux = useSelector(state => state.user);
  const controller = useMemo(() => new AbortController(), []);
  const [dataProduct, setDataProduct] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [isPick, setPick] = useState(false);

  const [fetchLoading, setFetchLoad] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const [discPrice, setDiscPrice] = useState(0);
  const [prodPick, setProdPick] = useState({});
  const [discount, setDiscount] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [descript, setDescript] = useState('');
  const [expDate, setExpDate] = useState(new Date());
  const [title, setTitle] = useState('')
  const [showPicker, setShowPicker] = useState(false);

  const searching = async text => {
    setLoading(true);
    setPick(false);
    const params = {
      limit: 8,
      page: '',
      category: '',
      search: text,
      sort: '',
    };
    try {
      const result = await getProducts(params, controller);
      // console.log(result.data.meta);
      setDataProduct(result.data.data);
      setNoData(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 404) {
        setNoData(true);
        setLoading(false);
      }
    }
  };

  const handleSearch = debounce(text => {
    searching(text);
  }, 700);

  const handlePick = item => {
    // console.log(item);
    setProdPick(item);
    setPick(true);
  };

  const onChangeDiscount = text => {
    if (parseInt(text) > 100) return;
    setDiscount(text);
    const newPrice = (parseInt(prodPick.prices) * parseInt(text)) / 100;
    if (parseInt(text) > 0)
      return setDiscPrice(parseInt(prodPick.prices) - newPrice);
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
      product_id: prodPick.id,
      title,
      coupon_code: couponCode,
      discount: parseInt(discount),
      coupon_desc: descript,
      coupon_expired: expDate.toLocaleDateString(),
    };
    // console.log(form);
    setFetchLoad(true);
    try {
      const result = await addPromos(userRedux.token, form, controller);
      // console.log(result);
      setFetchLoad(false);
      if (result.status === 201) setSuccess(true);
    } catch (error) {
      console.log(error.response);
      setFetchLoad(false);
    }
  };

  return (
    <ScrollView>
      <View style={styles.mainScreen}>
        {isPick ? (
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
                  prodPick.image
                    ? {uri: prodPick.image}
                    : require('../../assets/images/no-image.png')
                }
                style={styles.imageProd}
              />
              <Pressable onPress={() => setPick(false)} style={styles.btnEdit}>
                <IonIcon name="close-circle" size={40} color="#6A4029" />
              </Pressable>
            </View>
            <Text style={styles.textName}>{prodPick.prod_name}</Text>
            {discPrice === '' || discPrice === 0 ? (
              <Text style={styles.textPrice}>
                IDR {prodPick.prices.toLocaleString('id-ID')}
              </Text>
            ) : (
              <View style={{position: 'relative'}}>
                <Text style={styles.onDiscount}>
                  IDR {prodPick.prices.toLocaleString('id-ID')}
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
                placeholder="Enter Title"
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
                value={discount}
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
              <ButtonSecondary
                title="Create Promo"
                handlePress={handleSubmit}
              />
            )}
          </View>
        ) : (
          <>
            <View style={{marginBottom: 24, width: '100%'}}>
              <Text style={styles.textLabel}>Product Name :</Text>
              <TextInput
                style={globalStyle.inputLine}
                placeholder="Search Product"
                onChangeText={handleSearch}
                placeholderTextColor={'black'}
              />
            </View>

            {dataProduct.length >= 1 && (
              <Text style={globalStyle.textBold}>Select Product</Text>
            )}

            <View style={styles.listContainer}>
              {isLoading ? (
                <LoaderSpin />
              ) : noData ? (
                <Text style={styles.notFound}>Data Not Found</Text>
              ) : (
                dataProduct.map(item => (
                  <Pressable
                    onPress={() => handlePick(item)}
                    key={item.id}
                    style={styles.cardContainer}>
                    <Text style={styles.textCard}>{item.names}</Text>
                  </Pressable>
                ))
              )}
            </View>
          </>
        )}
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
  btnEdit: {
    position: 'absolute',
    top: 0,
    right: 0,
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
});

export default CreatePromo;
