import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  changeOrderDone,
  deleteTransaction,
  getAllOrder,
  getDoneOrder,
  getHistory,
} from '../../utils/https/transaction';
import globalStyle from '../../styles/globalStyle';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ButtonSecondary from '../../components/ButtonSecondary';
import ButtonPrimary from '../../components/ButtonPrimary';
import ModalMsg from '../../components/ModalMsg';
import LoaderScreen from '../../components/LoaderScreen';

const Card = ({data, reff}) => {
  const {token} = useSelector(state => state.user);
  const controller = useMemo(() => new AbortController(), []);
  const [isLoading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // console.log("STATUS ORDER",data.pay_status_id);

  const handleDone = async () => {
    console.log(data.id);
    setLoading(true);
    try {
      const result = await changeOrderDone(token, data.id, controller);
      console.log(result);
      reff();
      setLoading(false);
    } catch (error) {
      console.log(error);
      reff();
      setLoading(false);
    }
  };
  console.log(data)
  // const lengthText = text => {
  //   if (text.length > 15) {
  //     return text.substring(0, 12) + '...';
  //   } else {
  //     return text;
  //   }
  // };

  return (
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
        <Text style={styles.titleProd}>
          {/* {lengthText(data.prod_name)} */}
          {data.prod_name}
        </Text>
        <Text style={styles.textPrice}>{data.prices}</Text>
        <Text style={styles.textInfo}>
          {data.method === 'Door Delivery' ? 'Door Deliv' : data.method} at{' '}
          {new Date(data.created_at).toLocaleDateString()}
        </Text>
      </View>
      {data.status_id !== 2 && isLoading ? (
        <Pressable style={styles.btnDel}>
          <ActivityIndicator size="large" color="#FFBA33" />
        </Pressable>
      ) : (
        data.status_id !== 2 && (
          <Pressable onPress={handleDone} style={styles.btnDel}>
            <IonIcon name="checkmark-done-outline" size={22} color="white" />
          </Pressable>
        )
      )}
    </View>
  );
};

const ManageOrder = () => {
  const userRedux = useSelector(state => state.user);
  // console.log('DATA REDUX USER', userRedux);
  // console.log('TOKEN', userRedux.token);
  const navigation = useNavigation();
  const controller = useMemo(() => new AbortController(), []);
  const [data, setData] = useState([]);
  const [dataDone, setDataDone] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const fetching = async () => {
    // setLoading(true);
    try {
      const result = await getAllOrder(userRedux.token, controller);
      setData(result.data.data);
      const resDone = await getDoneOrder(userRedux.token, controller);
      setDataDone(resDone.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubFocus = navigation.addListener('focus', () => {
      fetching();
    });
    fetching();
    return unsubFocus;
  }, [refresh]);

  // console.log(data);

  return (
    <>
      {isLoading ? (
        <LoaderScreen />
      ) : (
        <ScrollView
          style={{
            flex: 1,
            paddingHorizontal: '5%',
            paddingVertical: 20,
          }}>
          <View style={{marginBottom: 40}}>
            <Text style={[globalStyle.textBold, {fontSize: 24}]}>Just now</Text>
            {data.length >= 1 &&
              data.map(item => (
                <Card
                  key={item.id}
                  data={item}
                  reff={() => setRefresh(!refresh)}
                />
              ))}
          </View>
          <View style={{paddingTop: 40, marginBottom: 40}}>
            <Text style={[globalStyle.textBold, {fontSize: 24}]}>Finished</Text>
            {dataDone.length >= 1 &&
              dataDone.map(item => (
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

export default ManageOrder;
