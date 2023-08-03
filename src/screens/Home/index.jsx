import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {NativeBaseProvider, Box, Menu} from 'native-base';
import {debounce} from 'lodash';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {getProducts, getPromos} from '../../utils/https/product';
import CardProducts from '../../components/CardProducts';
import LoaderSpin from '../../components/LoaderSpin';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const Home = () => {
  const navigation = useNavigation();
  const userRedux = useSelector(state => state.user);
  const controller = useMemo(() => new AbortController(), []);
  const [dataProduct, setDataProduct] = useState([]);
  const [dataPromo, setDataPromo] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState(4);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('');

  const fetching = async () => {
    setLoading(true);
    const params = {limit, page, category, search: searchInput, sort};
    try {
      const result = await getProducts(params, controller);
      // console.log(result.data.data);
      setDataProduct(result.data.data);
      const promos = await getPromos(controller);
      // console.log('DATA PROMO', promos.data.data);
      setDataPromo(promos.data.data);
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
    // const unsubFocus = navigation.addListener('focus', () => {
    //   console.log('NEW');
    fetching();
    // });
    // const unsubBlur = navigation.addListener('blur', () => {
    //   console.log('OUT');
    // });
    // return () => {
    //   unsubFocus();
    //   unsubBlur();
    // };
  }, [category]);

  // const handleSearch = debounce(text => {
  //   setPage(1);
  //   setSearchInput(text);
  // }, 700);
  const handleCategory = info => {
    setPage(1);
    setCategory(info);
  };

  return (
    <NativeBaseProvider>
      <ScrollView>
        <View style={styles.mainScreen}>
          <View style={{paddingHorizontal: '5%', gap: 10, paddingVertical: 8}}>
            <Text style={styles.titleScreen}>A good coffee is a good day</Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={styles.SearchInput}>
                <Image
                  source={require('../../assets/icons/icon-search.png')}
                  style={{width: 18, height: 18}}
                />
                <TextInput
                  style={{fontWeight: 'bold', width: '100%'}}
                  placeholder="Search"
                  // onChangeText={handleSearch}
                  placeholderTextColor={'black'}
                  onFocus={() =>
                    navigation.navigate('Products', {category, search: true})
                  }
                />
              </View>

              {userRedux.role === 1 && (
                <Pressable
                  onPress={() => navigation.navigate('AdminNavigator')}
                  style={styles.btnAdd}>
                  <FontAwesomeIcon name="plus" size={22} color="white" />
                </Pressable>
              )}
              {/* <Box alignItems="flex-end">
              <Menu
                w="190"
                trigger={triggerProps => {
                  return (
                    <Pressable {...triggerProps} style={styles.btnSort}>
                      <Text style={styles.btnSortText}>Sort By</Text>
                    </Pressable>
                  );
                }}>
                <Menu.Item bold onPress={() => setSort('')}>
                  Reset
                </Menu.Item>
                <Menu.Item onPress={() => setSort('cheapest')}>
                  Cheapest
                </Menu.Item>
                <Menu.Item onPress={() => setSort('priciest')}>
                  priciest
                </Menu.Item>
              </Menu>
            </Box> */}
            </View>

            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                // gap: 22,
                justifyContent: 'space-between',
                paddingVertical: 20,
              }}>
              <Pressable onPress={() => handleCategory('')}>
                <Text
                  style={
                    category === ''
                      ? styles.categoryActive
                      : styles.categoryText
                  }>
                  All
                </Text>
              </Pressable>
              <Pressable onPress={() => handleCategory(1)}>
                <Text
                  style={
                    category === 1 ? styles.categoryActive : styles.categoryText
                  }>
                  Coffee
                </Text>
              </Pressable>
              <Pressable onPress={() => handleCategory(2)}>
                <Text
                  style={
                    category === 2 ? styles.categoryActive : styles.categoryText
                  }>
                  Non Coffee
                </Text>
              </Pressable>
              <Pressable onPress={() => handleCategory(3)}>
                <Text
                  style={
                    category === 3 ? styles.categoryActive : styles.categoryText
                  }>
                  Foods
                </Text>
              </Pressable>
              <Pressable onPress={() => handleCategory(4)}>
                <Text
                  style={
                    category === 4 ? styles.categoryActive : styles.categoryText
                  }>
                  Adds on
                </Text>
              </Pressable>
            </View>
          </View>

          {isLoading ? (
            <LoaderSpin />
          ) : noData ? (
            <Text style={styles.notFound}>Data Not Found</Text>
          ) : (
            <View>
              <Pressable
                onPress={() =>
                  navigation.navigate('Products', {category, page: 1})
                }>
                <Text
                  style={{
                    color: '#6A4029',
                    textAlign: 'right',
                    paddingHorizontal: '5%',
                    fontFamily: 'Poppins-SemiBold',
                  }}>
                  See more
                </Text>
              </Pressable>
              <ScrollView horizontal={true}>
                <View style={styles.cardContainer}>
                  {dataProduct.map(product => (
                    <CardProducts
                      key={product.id}
                      prodId={product.id}
                      prodName={product.names}
                      image={product.image}
                      price={product.prices}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>
        {/* PROMO */}
        {isLoading ? (
          <Box></Box>
        ) : (
          <View>
            <View
              style={{
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexDirection: 'row',
                paddingHorizontal: '5%',
                marginTop: 12,
              }}>
              <Text
                style={{
                  color: '#6A4029',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 18,
                }}>
                Promo
              </Text>
              <Pressable onPress={() => navigation.navigate('Promos')}>
                <Text
                  style={{
                    color: '#6A4029',
                    textAlign: 'right',
                    fontFamily: 'Poppins-SemiBold',
                  }}>
                  See more
                </Text>
              </Pressable>
            </View>
            <ScrollView horizontal={true}>
              <View style={styles.cardContainer}>
                {dataPromo.map(product => (
                  <CardProducts
                    key={product.id}
                    prodId={product.product_id}
                    prodName={product.title}
                    image={product.image}
                    price={product.prices}
                    discount={product.discount}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    // paddingVertical: 20,
  },
  titleScreen: {
    fontSize: 34,
    fontFamily: 'Poppins-Bold',
    lineHeight: 40,
    color: 'black',
  },
  SearchInput: {
    width: '76%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CACACA',
    borderRadius: 24,
    paddingHorizontal: 20,
    gap: 12,
  },
  btnSort: {
    borderWidth: 2,
    borderColor: '#CACACA',
    padding: 10,
    borderRadius: 24,
  },
  btnSortText: {color: 'black', fontFamily: 'Poppins-Regular'},
  cardContainer: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 22,
  },
  categoryText: {
    color: 'black',
    fontFamily: 'Poppins-Bold',
  },
  categoryActive: {
    color: '#6A4029',
    fontFamily: 'Poppins-Bold',
    borderBottomWidth: 2,
    borderBottomColor: '#6A4029',
  },
  notFound: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#6A4029',
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: 60,
  },
  btnAdd: {
    width: 46,
    height: 46,
    borderRadius: 30,
    backgroundColor: '#6A4029',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
