import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {deleteTransaction, getHistory} from '../../utils/https/transaction';
import globalStyle from '../../styles/globalStyle';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ButtonSecondary from '../../components/ButtonSecondary';
import ButtonPrimary from '../../components/ButtonPrimary';
import ModalMsg from '../../components/ModalMsg';
import LoaderScreen from '../../components/LoaderScreen';

const Card = ({data, reff}) => {
  const {token} = useSelector(state => state.user);
  const controller = useMemo(() => new AbortController(), []);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    console.log(data.id);
    try {
      const result = await deleteTransaction(token, data.id, controller);
      // console.log(result);
      reff();
    } catch (error) {
      console.log(error);
      reff();
    }
  };

  const lengthText = text => {
    if (text.length > 15) {
      return text.substring(0, 12) + '...';
    } else {
      return text;
    }
  };

  return (
    <>
      <ModalMsg
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        msg="Are you sure want to delete the selected items?"
        onSubmit={handleDelete}
      />
      <View style={styles.cardContainer}>
        {data.image ? (
          <Image source={{uri: data.image}} style={styles.imageProd} />
        ) : (
          <Image
            source={require('../../assets/images/no-image.png')}
            style={styles.imageProd}
          />
        )}
        <View style={{marginLeft: 130}}>
          <Text style={styles.titleProd}>{lengthText(data.names)}</Text>
          <Text style={styles.textPrice}>{data.prices}</Text>
          <Text style={styles.textInfo}>
            {data.method === 'Door Delivery' ? 'Door Deliv' : data.method} at{' '}
            {new Date(data.created_at).toLocaleDateString()}
          </Text>
        </View>
        <Pressable onPress={() => setShowModal(true)} style={styles.btnDel}>
          <IonIcon name="trash" size={22} color="white" />
        </Pressable>
      </View>
    </>
  );
};

const History = () => {
  const userRedux = useSelector(state => state.user);
  // console.log('DATA REDUX USER', userRedux);
  const navigation = useNavigation();
  const controller = useMemo(() => new AbortController(), []);
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const fetching = async () => {
    setLoading(true);
    try {
      const result = await getHistory(userRedux.token, controller);
      setData(result.data.data);
      setLoading(false);
      console.log(result)
    } catch (error) {
      console.log('no data')
      console.log(error);
    }
  };

  useEffect(() => {
    fetching();
  }, [refresh]);

  // console.log(data);

  return (
    <>
      {data.length === 0 ? (
        <Text style={styles.textBold}>
        {'>>>      - No Order History -     <<<'}
      </Text>
      ) : (
        <ScrollView
          style={{
            flex: 1,
            paddingHorizontal: '5%',
            paddingVertical: 20,
          }}>
          <View style={{marginBottom: 40}}>
            {data.length >= 1 &&
              data.map(item => (
                <Card
                  key={item.id}
                  data={item}
                  reff={() => setRefresh(!refresh)}
                />
              ))}
          </View>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 20,
    marginTop: 22,
    marginBottom: 22,
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderBottomColor: '#6A4029',
    paddingVertical: 6,
  },
  textBold: {
    fontFamily: 'Poppins-Bold',
    color: '#6A4029',
    fontSize: 20,
  },
  imageProd: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: 'absolute',
    // borderWidth: 1,
    // borderColor: '#6A4029',
  },
  textInfo: {
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  textPrice: {
    fontFamily: 'Poppins-Bold',
    // fontSize: 12,
    color: '#6A4029',
  },
  titleProd: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: 'black',
  },
  btnQty: {
    width: 21,
    height: 21,
    backgroundColor: '#FFBA33',
    borderRadius: 12,
    alignItems: 'center',
  },
  btnDel: {
    marginLeft: 'auto',
    width: 40,
    height: 40,
    backgroundColor: '#6A4029',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScreen: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  modal: {
    height: 300,
    borderRadius: 32,
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
});

export default History;
