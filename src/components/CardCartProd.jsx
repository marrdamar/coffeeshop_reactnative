import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {cartAction} from '../redux/slices/cart';

const CardCartProd = ({data}) => {
  const dispatch = useDispatch();
  const [isDelete, setDelete] = useState(false);

  const handleQty = info => {
    if (info === 'inc') {
      dispatch(cartAction.increment({id: data.product_id, size: data.size_id}));
    } else {
      if (data.qty === 1) return setDelete(true);
      dispatch(cartAction.decrement({id: data.product_id, size: data.size_id}));
    }
  };

  const handleDelete = () => {
    dispatch(cartAction.deleteItem({id: data.product_id, size: data.size_id}));
  };
  // console.log(data)
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardProd}>
        {data.image ? (
          <Image source={{uri: data.image}} style={styles.imageProd} />
        ) : (
          <Image
            source={require('../assets/images/no-image.png')}
            style={styles.imageProd}
          />
        )}
        <Text style={styles.textPrice}>
          {/* IDR {data.price.toLocaleString('id-ID')} */}
          IDR {data.price}
        </Text>
      </View>
      <View style={{gap: 8, width: '100%'}}>
        {isDelete ? (
          <>
            <Text style={styles.titleProd}>Remove in cart ?</Text>
            <View style={{flexDirection: 'row', gap: 30}}>
              <TouchableOpacity
                style={styles.btnDlt}
                onPress={() => setDelete(false)}>
                <Text style={styles.textBtnDlt}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnDlt} onPress={handleDelete}>
                <Text style={styles.textBtnDlt}>Yes</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.titleProd}>{data.prodName}</Text>
            <Text style={styles.titleSize}>
              {data.size_id === 1
                ? 'Regular'
                : data.size_id === 2
                ? 'Large'
                : 'Extra Large'}
            </Text>
            <View style={{flexDirection: 'row', gap: 30}}>
              <TouchableOpacity
                onPress={() => handleQty('dec')}
                style={styles.btnQty}>
                <Text style={styles.titleProd}>-</Text>
              </TouchableOpacity>
              <Text style={styles.titleProd}>{data.qty}</Text>
              <TouchableOpacity
                onPress={() => handleQty('inc')}
                style={styles.btnQty}>
                <Text style={styles.titleProd}>+</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 20,
    marginTop: 40,
  },
  cardProd: {
    width: 104,
    height: 104,
    borderRadius: 32,
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 16,
  },
  imageProd: {
    width: 84,
    height: 84,
    position: 'absolute',
    top: -22,
    borderRadius: 42,
  },
  textPrice: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#6A4029',
  },
  titleProd: {
    fontFamily: 'Poppins-Bold',
    color: 'black',
  },
  titleSize: {
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  btnQty: {
    width: 21,
    height: 21,
    backgroundColor: '#FFBA33',
    borderRadius: 12,
    alignItems: 'center',
  },
  btnDlt: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#6A4029',
    borderRadius: 12,
  },
  textBtnDlt: {
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
});

export default CardCartProd;
