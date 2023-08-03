import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';

import {getPromos} from '../../utils/https/product';
import LoaderSpin from '../../components/LoaderSpin';

import {useNavigation} from '@react-navigation/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';

const CardListPromo = props => {
  const userState = useSelector(state => state.user);
  const navigation = useNavigation();

  return (
    <Pressable
      // onPress={() => navigation.navigate('Detail', {id: props.prodId})}
      style={styles.cardContent}>
      {props.image ? (
        <Image source={{uri: props.image}} style={styles.imageProd} />
      ) : (
        <Image
          source={require('../../assets/images/no-image.png')}
          style={styles.imageProd}
        />
      )}
      <View style={styles.discContainer}>
        <Text style={styles.discText}>{props.discount}%</Text>
      </View>
      {userState.role === 1 && (
        <Pressable
          onPress={() => navigation.navigate('EditPromo', {data: props.data})}
          style={styles.btnEdit}>
          <FontAwesomeIcon name="pencil" size={22} color="white" />
        </Pressable>
      )}
      <Text style={styles.titleCard}>{props.prodName}</Text>
      <Text style={{color: '#6A4029', fontFamily: 'Poppins-Bold'}}>
        {/* IDR {props.price.toLocaleString('id-ID')} */}
        IDR {props.price}
      </Text>
    </Pressable>
  );
};

const AllPromo = () => {
  const navigation = useNavigation();
  const controller = useMemo(() => new AbortController(), []);
  const [dataProduct, setDataProduct] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  const fetching = async () => {
    setLoading(true);
    try {
      const result = await getPromos(controller);
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

  useEffect(() => {
    const unsubFocus = navigation.addListener('focus', () => {
      fetching();
    });
    fetching();
    return unsubFocus;
  }, []);

  return (
    <View style={styles.mainScreen}>
      {isLoading ? (
        <LoaderSpin />
      ) : noData ? (
        <Text style={styles.notFound}>Data Not Found</Text>
      ) : (
        <ScrollView>
          <View style={styles.cardContainer}>
            {dataProduct.map(product => (
              <CardListPromo
                key={product.id}
                promoId={product.id}
                prodId={product.product_id}
                prodName={product.title}
                image={product.image}
                price={product.prices}
                discount={product.discount}
                data={product}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    // paddingVertical: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // paddingHorizontal: 26,
    paddingLeft: 20,
    paddingRight: 28,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 24,
  },
  notFound: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#6A4029',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 60,
  },
  // CARD LIST

  cardContent: {
    width: 156,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 32,
    alignItems: 'center',
    marginTop: 44,
    padding: 16,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  imageProd: {
    position: 'absolute',
    top: -48,
    borderRadius: 70,
    width: 128,
    height: 128,
    resizeMode: 'cover',
  },
  titleCard: {
    color: 'black',
    fontSize: 20,
    lineHeight: 22,
    fontFamily: 'Poppins-ExtraBold',
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 6,
  },
  btnEdit: {
    width: 46,
    height: 46,
    borderRadius: 30,
    backgroundColor: '#6A4029',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: -11,
    top: 160,
  },
  discContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: 64,
    height: 38,
    borderRadius: 20,
    backgroundColor: '#FFBA33',
    borderColor: '#FFBA33',
    borderWidth: 1,
    top: 56,
    right: -12,
  },
  discText: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 22,
    color: 'black',
  },
});

export default AllPromo;
