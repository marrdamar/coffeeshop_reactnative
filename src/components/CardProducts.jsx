import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const CardProducts = props => {
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
      {props.discount && (
        <View style={styles.discountCard}>
          <Text style={styles.textDiscount}>{props.discount}%</Text>
        </View>
      )}
      <Text style={styles.titleCard}>{props.prodName}</Text>
      <Text style={{color: '#6A4029', fontFamily: 'Poppins-Bold'}}>
        {/* IDR {props.price.toLocaleString('id-ID')} */}
        IDR {props.price}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 220,
    height: 270,
    backgroundColor: 'white',
    borderRadius: 32,
    alignItems: 'center',
    marginTop: 40,
    padding: 16,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  imageProd: {
    position: 'absolute',
    top: -30,
    borderRadius: 16,
    width: 168,
    height: 189,
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
  discountCard: {
    position: 'absolute',
    top: 20,
    right: 6,
    borderRadius: 12,
    backgroundColor: '#FFBA33',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textDiscount: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 20,
    color: '#6A4029',
  },
});

export default CardProducts;
