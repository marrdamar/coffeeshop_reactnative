import {View, Text, ImageBackground} from 'react-native';
import React, {useMemo} from 'react';
import ButtonSecondary from '../../components/ButtonSecondary';
import ButtonPrimary from '../../components/ButtonPrimary';
import authStyle from '../../styles/authStyle';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {userAction} from '../../redux/slices/auth';
import {cartAction} from '../../redux/slices/cart';
import {authLogout} from '../../utils/https/auth';

const Logout = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const redux = useSelector(state => state);
  console.log(redux.user, redux.cart);
  const controller = useMemo(() => new AbortController(), []);

  const handleLogout = async () => {
    try {
      const result = await authLogout(redux.user.token, controller);
      console.log(result.data);
    } catch (error) {
      console.log(error.response);
    }
    dispatch(userAction.authLogout());
    dispatch(cartAction.resetCart());
    navigation.replace('Welcome');
  };
  return (
    <ImageBackground
      source={require('../../assets/images/bg-auth.png')}
      style={authStyle.bgAuth}>
      <View style={authStyle.mainAuth}>
        <View style={{width: '100%'}}>
          <Text style={authStyle.authTitle}>Goodbye!</Text>
          <Text style={authStyle.authDesc}>Are you sure wan't to logout</Text>
        </View>
        <View style={authStyle.btnContainer}>
          <ButtonSecondary title="Logout" handlePress={handleLogout} />
          <ButtonPrimary
            title="Cancel"
            handlePress={() => navigation.navigate('Home')}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default Logout;
