import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';

const CardListProduct = props => {
  const userState = useSelector(state => state.user);
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => navigation.navigate('Detail', {id: props.prodId})}
      style={styles.cardContainer}>
      {props.image ? (
        <Image source={{uri: props.image}} style={styles.imageProd} />
      ) : (
        <Image
          source={require('../assets/images/no-image.png')}
          style={styles.imageProd}
        />
      )}
      {userState.role === 1 && (
        <Pressable
          onPress={() => navigation.navigate('EditProduct', {id: props.prodId})}
          style={styles.btnEdit}>
          <FontAwesomeIcon name="pencil" size={22} color="white" />
        </Pressable>
      )}
      <Text style={styles.titleCard}>{props.prodName}</Text>
      <Text style={{color: '#6A4029', fontFamily: 'Poppins-Bold'}}>
        IDR {props.price.toLocaleString('id-ID')}
        {/* {props.prices} */}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
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
});

export default CardListProduct;
