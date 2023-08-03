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

import {getProducts} from '../../utils/https/product';
import LoaderSpin from '../../components/LoaderSpin';
import CardListProduct from '../../components/CardListProduct';
import {useRoute} from '@react-navigation/native';

import {useNavigation} from '@react-navigation/native';

const Products = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {params} = route;
  // console.log(route.params);
  const controller = useMemo(() => new AbortController(), []);
  const [dataProduct, setDataProduct] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [category, setCategory] = useState(
    params && params.category ? params.category : '',
  );
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(params && params.page ? params.page : 1);
  const [sort, setSort] = useState('');
  const [totalPage, setTotalPage] = useState('');

  const fetching = async () => {
    setLoading(true);
    const params = {
      limit,
      page,
      category,
      search: searchInput,
      sort,
    };
    try {
      const result = await getProducts(params, controller);
      // console.log(result.data.meta);
      setDataProduct(result.data.data);
      setTotalPage(result.data.meta.totalPage);
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
    fetching();
  }, [category, searchInput, sort, route.params]);

  const handleSearch = debounce(text => {
    setPage(1);
    setSearchInput(text);
  }, 700);
  const handleCategory = info => {
    setPage(1);
    setCategory(info);
  };

  const handlePage = async () => {
    if (totalPage === page) return;
    const params = {limit, page: page + 1, category, search: searchInput, sort};
    try {
      console.log('FETCHING NEXT, PAGE', params.page);
      const result = await getProducts(params, controller);
      // console.log(result.data.data);
      const merged = [...dataProduct, ...result.data.data];
      setDataProduct(merged);
      setPage(params.page);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 404) {
        setNoData(true);
        setLoading(false);
      }
    }
  };
  console.log()
  return (
    <NativeBaseProvider>
      <View style={styles.mainScreen}>
        <View style={{paddingHorizontal: '5%', gap: 10, paddingVertical: 8}}>
          {/* <Text style={styles.titleScreen}>
            {category === ''
              ? 'All Products'
              : category === 1
              ? 'Coffee'
              : category === 2
              ? 'Non Coffee'
              : category === 3
              ? 'Foods'
              : 'Add On'}
          </Text> */}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={styles.SearchInput}>
              <Image
                source={require('../../assets/icons/icon-search.png')}
                style={{width: 18, height: 18}}
              />
              <TextInput
                style={{fontWeight: 'bold', width: '100%'}}
                placeholder="Search"
                onChangeText={handleSearch}
                placeholderTextColor={'black'}
                autoFocus={params ? params.search : false}
                // autoFocus={true}
              />
            </View>

            <Box alignItems="flex-end">
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
                <Menu.Item
                  onPress={() => {
                    setSort('cheapest');
                    setPage(1);
                  }}>
                  Cheapest
                </Menu.Item>
                <Menu.Item
                  onPress={() => {
                    setSort('priciest');
                    setPage(1);
                  }}>
                  priciest
                </Menu.Item>
              </Menu>
            </Box>
          </View>

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              // gap: 22,
              justifyContent: 'space-between',
              paddingVertical: 10,
            }}>
            <Pressable onPress={() => handleCategory('')}>
              <Text
                style={
                  category === '' ? styles.categoryActive : styles.categoryText
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
          // <View>
          // <ScrollView>
          //   <View style={styles.cardContainer}>
          //     {dataProduct.map(product => (
          //       <CardListProduct
          //         key={product.id}
          //         prodId={product.id}
          //         prodName={product.prod_name}
          //         image={product.image}
          //         price={product.price}
          //       />
          //     ))}
          //     {metapage && (
          //       <Pressable onPress={handlePage}>
          //         <Text>NEXT</Text>
          //       </Pressable>
          //     )}
          //   </View>
          // </ScrollView>
          <FlatList
            style={{width: '100%'}}
            data={dataProduct}
            renderItem={({item}) => {
              console.log(item)
              return (
                <View style={styles.cardContainer}>
                  <CardListProduct
                    key={item.id}
                    prodId={item.id}
                    prodName={item.names}
                    image={item.image}
                    price={item.prices}
                  />
                </View>
              )
            }
          }
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            onEndReached={handlePage}
            onEndReachedThreshold={0.1}
          />

          // </View>
        )}
      </View>
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
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 24,
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
    marginTop: 60,
  },
});

export default Products;
