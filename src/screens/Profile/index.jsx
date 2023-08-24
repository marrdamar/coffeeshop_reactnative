import {
  View,
  ScrollView,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import ButtonWhite from '../../components/ButtonWhite';
import ButtonSecondary from '../../components/ButtonSecondary';
import {useSelector} from 'react-redux';
import LoaderSpin from '../../components/LoaderSpin';
import {getProfile} from '../../utils/https/auth';
import {getHistory} from '../../utils/https/transaction';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import EditPassword from '../../components/EditPassword';

const CardOrder = ({data}) => {
  return (
    <View>
      {data.image ? (
        <Image source={{uri: data.image}} style={styles.imgOrder} />
      ) : (
        <Image
          source={require('../../assets/images/no-image.png')}
          style={styles.imgOrder}
        />
      )}
    </View>
  );
};

const Profile = () => {
  const userRedux = useSelector(state => state.user);
  // console.log('DATA REDUX USER', userRedux);
  const navigation = useNavigation();
  const controller = useMemo(() => new AbortController(), []);
  const [data, setData] = useState({});
  const [dataOrder, setDataOrder] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  // const [isToast, setToast] = useState(false);
  // const [toastInfo, setToastInfo] = useState({})

  const fetching = async () => {
    setLoading(true);
    try {
      const result = await getProfile(userRedux.token, controller);
      console.log('DATA PROFILE');
      setData(result.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTrans = async () => {
    try {
      const getHistoryOrder = await getHistory(userRedux.token, controller);
      // console.log('HISTORY ORDER', getHistoryOrder.data.data);
      setDataOrder(getHistoryOrder.data.data);
      if (getHistoryOrder === null) {
        console.log('belum ada trans')
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const unsubFocus = navigation.addListener('focus', () => {
      fetching();
      handleTrans();
    });
    fetching();
    handleTrans();
    return unsubFocus;
  }, []);

  return (
    <>
      {isLoading ? (
        <View style={styles.screenLoad}>
          <LoaderSpin />
        </View>
      ) : (
        <ScrollView>
          <EditPassword
            showModal={showModal}
            closeModal={() => setShowModal(false)}
            msg="Are you sure to delete the selected items?"
          />
          <View style={styles.screen}>
            <View style={{alignItems: 'center', paddingHorizontal: '10%'}}>
              <View style={{position: 'relative', marginBottom: 12}}>
                {data.profile_image ? (
                  <Image
                    source={{uri: data.profile_image}}
                    style={styles.imageProd}
                  />
                ) : (
                  <Image
                    source={require('../../assets/images/ph-users.png')}
                    style={styles.imageProd}
                  />
                )}
                {/* <Pressable style={styles.btnEdit}>
                  <FontAwesomeIcon name="pencil" size={18} color="white" />
                </Pressable> */}
              </View>
              <Text style={styles.textBold}>{data.display_name}</Text>
              <Text style={styles.textReg}>{data.email}</Text>
              <Text style={[styles.textReg, {marginBottom: 20}]}>
                {data.address || '*address not set*'}
              </Text>
            </View>
            <View style={styles.orderComponent}>
              <View style={styles.orderHistoryTitlte}>
                <Text style={styles.textBold}>Order History</Text>
                <Pressable onPress={() => navigation.navigate('History')}>
                  <Text style={styles.textReg}>See more</Text>
                </Pressable>
              </View>
              <ScrollView horizontal={true}>
                <View style={styles.orderCardContainer}>
                  {dataOrder.length >= 1 ? (
                    dataOrder.map((item, idx) => (
                      <CardOrder key={idx} data={item} />
                    ))
                  ) : (
                    <Text style={styles.textBold}>
                      {'>>>      - No Order History -     <<<'}
                    </Text>
                  )}
                </View>
              </ScrollView>
            </View>
            <View style={styles.actionContainer}>
              <ButtonWhite
                title="Edit Password"
                handlePress={() => setShowModal(true)}
              />
              <ButtonWhite title="FAQ" />
              <ButtonWhite title="Help" />
              <View style={{width: '100%'}}>
                <ButtonSecondary
                  title="Edit Profile"
                  handlePress={() => navigation.navigate('EditProfile')}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  screenLoad: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    flex: 1,
    // width: '100%',
    alignItems: 'center',
    // paddingHorizontal: '10%',
    paddingVertical: 20,
  },
  imageProd: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  textReg: {
    fontFamily: 'Poppins-Regular',
    color: '#6A4029',
  },
  textBold: {
    fontFamily: 'Poppins-Bold',
    color: '#6A4029',
    fontSize: 20,
  },
  imgOrder: {
    width: 59,
    height: 64,
    borderRadius: 20,
  },
  btnEdit: {
    width: 36,
    height: 36,
    borderRadius: 17,
    backgroundColor: '#6A4029',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 4,
  },
  orderHistoryTitlte: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '10%',
    paddingVertical: 8,
  },
  orderComponent: {
    width: '100%',
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderColor: '#BABABA30',
    marginBottom: 22,
  },
  orderCardContainer: {
    gap: 24,
    flexDirection: 'row',
    paddingHorizontal: 36,
    paddingTop: 8,
    paddingBottom: 16,
  },
  actionContainer: {
    width: '100%',
    gap: 16,
    paddingHorizontal: '10%',
  },
});

export default Profile;
