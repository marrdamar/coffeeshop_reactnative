import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {getProductsDetails} from '../../utils/https/product';
import LoaderScreen from '../../components/LoaderScreen';
import ButtonSecondary from '../../components/ButtonSecondary';
import {useDispatch, useSelector} from 'react-redux';
import {cartAction} from '../../redux/slices/cart';
import ToastFetching from '../../components/ToastFetching';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const ProductDetails = () => {
  const route = useRoute();
  const {id} = route.params;
  const dispatch = useDispatch();
  const userRedux = useSelector(state => state.user);
  const controller = useMemo(() => new AbortController(), []);
  const [isLoading, setLoading] = useState(true);
  const [isToast, setToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({});
  const [dataProd, setDataProd] = useState();
  const [size, setSize] = useState(1);
  const [newPrice, setNewPrice] = useState('');
  const sizeL = 2000;
  const sizeXL = 4000;

  const fetching = async () => {
    setLoading(true);
    try {
      const result = await getProductsDetails(id, controller);
      // console.log(result);
      setDataProd(result.data.data[0]);
      setNewPrice(result.data.data[0].prices);
      setLoading(false);
      // console.log(newPrice)
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    fetching();
  }, []);
  // console.log(dataProd);

  const handleAddToCart = () => {
    const cart = {
      product_id: id,
      prodName: dataProd.names,
      image: dataProd.image || '',
      size_id: size || 1,
      qty: 1,
      price: newPrice,
    };
    setToastInfo({
      msg: `Adding ${dataProd.names}`,
      display: 'success',
    });
    setToast(true);
    dispatch(cartAction.addtoCart(cart));
  };
  console.log(newPrice);
  // const image = dataProd.image
  return (
    <>
      {isLoading ? (
        <LoaderScreen />
      ) : (
        <ScrollView>
          <ToastFetching
            isShow={isToast}
            onClose={() => setToast(false)}
            info={toastInfo}
          />

          {userRedux.role === 1 && (
            <Pressable
              onPress={() =>
                navigation.navigate('EditProduct', {id: props.prodId})
              }
              style={styles.btnEdit}>
              <FontAwesomeIcon name="pencil" size={22} color="white" />
            </Pressable>
          )}
          <View style={styles.container}>
            {dataProd.image ? (
              <Image source={{uri: dataProd.image}} style={styles.imageProd} />
            ) : (
              <Image
                style={styles.imageProd}
                source={require('../../assets/images/no-image.png')}
              />
            )}
            <Text style={styles.titleProd}>{dataProd.names}</Text>
            <Text style={styles.textPrice}>
              {/* IDR {dataProd.prices.toLocaleString('id-ID')} */}
              IDR {dataProd.prices}
            </Text>

            <View style={styles.containerDesc}>
              <Text style={styles.textTitle}>Delivery Info</Text>
              <Text style={{color: 'black'}}>
                Delivered only on monday until friday from 1 pm to 7 pm
              </Text>
            </View>
            <View style={styles.containerDesc}>
              <Text style={styles.textTitle}>Description</Text>
              <Text style={{color: 'black'}}>
                {dataProd.desc_product}
              </Text>
            </View>
            <Text style={{fontFamily: 'Poppins-Bold', fontSize: 20}}>
              Choose Size
            </Text>
            <View style={{flexDirection: 'row', gap: 20}}>
              <Pressable
                onPress={() => {
                  setSize(1);
                  setNewPrice(dataProd.prices);
                }}
                style={size === 1 ? styles.selectedSize : styles.selectSize}>
                <Text style={size === 1 ? styles.sizedTitle : styles.sizeTitle}>
                  R
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setSize(2);
                  setNewPrice(dataProd.prices + 2000);
                }}
                style={size === 2 ? styles.selectedSize : styles.selectSize}>
                <Text style={size === 2 ? styles.sizedTitle : styles.sizeTitle}>
                  L
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setSize(3);
                  setNewPrice(dataProd.prices + 4000);
                }}
                style={size === 3 ? styles.selectedSize : styles.selectSize}>
                <Text style={size === 3 ? styles.sizedTitle : styles.sizeTitle}>
                  XL
                </Text>
              </Pressable>
            </View>
            <View style={{marginTop: 20, width: '100%'}}>
              {userRedux.role === 2 && (
                <ButtonSecondary
                title="Add to cart"
                handlePress={handleAddToCart}
              />
              )}
              
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: '10%',
    paddingVertical: 16,
  },
  imageProd: {
    width: 200,
    height: 200,
    borderRadius: 200,
    resizeMode: 'cover',
  },
  titleProd: {
    fontSize: 28,
    fontFamily: 'Poppins-ExtraBold',
    color: 'black',
    textAlign: 'center',
  },
  textPrice: {
    fontSize: 22,
    color: '#6A4029',
    fontFamily: 'Poppins-Bold',
  },
  textTitle: {
    fontFamily: 'Poppins-ExtraBold',
    color: 'black',
  },
  containerDesc: {
    width: '100%',
    paddingTop: 20,
  },
  selectSize: {
    width: 50,
    height: 50,
    paddingTop: 4,
    borderRadius: 25,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFBA33',
  },
  selectedSize: {
    width: 50,
    height: 50,
    paddingTop: 4,
    borderRadius: 25,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6A4029',
  },
  sizeTitle: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Poppins-ExtraBold',
    color: 'black',
  },
  sizedTitle: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Poppins-ExtraBold',
    color: '#FFBA33',
  },
  btnEdit: {
    width: 46,
    height: 46,
    borderRadius: 30,
    backgroundColor: '#6A4029',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 12,
    top: 12,
  },
});

export default ProductDetails;
