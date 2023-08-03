/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {Pressable, View} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Welcome from './src/screens/Welcome';
import Auth from './src/screens/Auth';
import Signup from './src/screens/Auth/Signup';
import Login from './src/screens/Auth/Login';
import Home from './src/screens/Home';
import {Provider, useSelector} from 'react-redux';
import store, {persistor} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import Forgot from './src/screens/Auth/Forgot';
import ProductDetails from './src/screens/Product/ProductDetails';
import Profile from './src/screens/Profile';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Cart from './src/screens/transaction/Cart';
import Products from './src/screens/Product';
import Delivery from './src/screens/transaction/Delivery';
import Payment from './src/screens/transaction/Payment';
import EditProfile from './src/screens/Profile/EditProfile';
import CustomDrawer from './src/components/CustomDrawer';
import MySplashScreen from './src/components/MySplashScreen';
import History from './src/screens/transaction/History';
import CreateProduct from './src/screens/Product/CreateProduct';
import EditProduct from './src/screens/Product/EditProduct';
import CreatePromo from './src/screens/Promo/CreatePromo';
import ManageOrder from './src/screens/transaction/ManageOrder';
import AllPromo from './src/screens/Promo';
import EditPromo from './src/screens/Promo/EditPromo';

const AdminNavigator = () => {
  const {Navigator, Screen} = createBottomTabNavigator();
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFBA33',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: {backgroundColor: '#6A4029', height: 86},
        tabBarItemStyle: {marginBottom: 6, marginTop: 6},
        tabBarLabelStyle: {fontFamily: 'Poppins-Regular', fontSize: 14},
      }}>
      <Screen
        name="CreateProduct"
        component={CreateProduct}
        options={{
          title: 'New Product',
          tabBarIcon: ({color}) => (
            <Ionicons name="add-circle-outline" size={44} color={color} />
          ),
        }}
      />
      <Screen
        name="CreatePromo"
        component={CreatePromo}
        options={{
          title: 'New Promo',
          tabBarActiveTintColor: '#FFBA33',
          tabBarIcon: ({color}) => (
            <Ionicons name="pricetags-outline" size={32} color={color} />
          ),
        }}
      />
    </Navigator>
  );
};

const DrawerNavigator = () => {
  const userRedux = useSelector(state => state.user);
  const navigation = useNavigation();
  const {Navigator, Screen} = createDrawerNavigator();
  return (
    <Navigator
      initialRouteName="Home"
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#6A4029',
        drawerActiveTintColor: 'white',
        drawerLabelStyle: {marginLeft: -20},
      }}>
      <Screen
        name="Home"
        component={Home}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
          },
          headerTitleStyle: {fontFamily: 'Poppins-Bold'},
          headerTitle: {backgroundColor: 'rgba(255, 255, 255, 0)'},
          drawerIcon: ({color}) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
          // headerLeft: () => (
          //   <Pressable onPress={() => navigation.toggleDrawer()}>
          //     <View style={{marginLeft: 10}}>
          //       <Ionicons
          //         name="ellipsis-vertical-outline"
          //         size={24}
          //         color="black"
          //       />
          //     </View>
          //   </Pressable>
          // ),
          headerRight: () => (
            <Pressable
              onPress={() => {
                if (userRedux.role === 1) navigation.navigate('ManageOrder');
                else navigation.navigate('Cart');
              }}>
              <View style={{marginRight: '8%'}}>
                <Ionicons name="cart-outline" size={24} color="black" />
              </View>
            </Pressable>
          ),
        }}
      />
      <Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
          },
          headerTitleStyle: {fontFamily: 'Poppins-Bold'},
          headerTitle: {backgroundColor: 'rgba(255, 255, 255, 0)'},
          drawerIcon: ({color}) => (
            <Ionicons name="person-circle-outline" size={24} color={color} />
          ),
        }}
      />
      {userRedux.role === 1 ? (
        <Screen
          name="ManageOrder"
          component={ManageOrder}
          options={{
            title: 'Manage Order',
            headerShown: true,
            headerStyle: {
              backgroundColor: 'rgba(255, 255, 255, 0)',
            },
            headerTitleStyle: {fontFamily: 'Poppins-Bold'},
            headerTitle: {backgroundColor: 'rgba(255, 255, 255, 0)'},
            drawerIcon: ({color}) => (
              <Ionicons name="cart-outline" size={24} color={color} />
            ),
          }}
        />
      ) : (
        <Screen
          name="Cart"
          component={Cart}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: 'rgba(255, 255, 255, 0)',
            },
            headerTitleStyle: {fontFamily: 'Poppins-Bold'},
            headerTitle: {backgroundColor: 'rgba(255, 255, 255, 0)'},
            drawerIcon: ({color}) => (
              <Ionicons name="cart-outline" size={24} color={color} />
            ),
          }}
        />
      )}
      <Screen
        name="Products"
        component={Products}
        options={{
          title: 'All Products',
          headerShown: true,
          headerStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
          },
          headerTitleStyle: {fontFamily: 'Poppins-Bold'},
          headerTitle: {backgroundColor: 'rgba(255, 255, 255, 0)'},
          drawerIcon: ({color}) => (
            <Ionicons name="grid-outline" size={24} color={color} />
          ),
        }}
      />
      {userRedux.role === 1 && (
        <Screen
          name="AdminNavigator"
          component={AdminNavigator}
          options={{
            title: 'Admin Page',
            headerShown: true,
            drawerIcon: ({color}) => (
              <Ionicons name="create-outline" size={24} color={color} />
            ),
          }}
        />
      )}
    </Navigator>
  );
};

const StackNavigator = () => {
  const userRedux = useSelector(state => state.user);
  const navigation = useNavigation();
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={MySplashScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Forgot" component={Forgot} />
      <Stack.Screen
        name="History"
        component={History}
        options={{
          title: 'History Order',
          headerShown: true,
          headerStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
          },
          headerTitleStyle: {fontFamily: 'Poppins-Bold'},
          headerTitle: {backgroundColor: 'rgba(255, 255, 255, 0)'},
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          title: 'Edit Profile',
          headerShown: true,
          headerStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
          },
          headerTitleStyle: {fontFamily: 'Poppins-Bold'},
          headerTitle: {backgroundColor: 'rgba(255, 255, 255, 0)'},
        }}
      />
      <Stack.Screen
        name="Products"
        component={Products}
        options={{
          title: 'All Products',
          headerShown: true,
          headerShown: true,
          headerStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
          },
          headerTitleStyle: {fontFamily: 'Poppins-Bold'},
          headerTitle: {backgroundColor: 'rgba(255, 255, 255, 0)'},
        }}
      />
      <Stack.Screen
        name="Promos"
        component={AllPromo}
        options={{
          title: 'All Promo',
          headerShown: true,
          headerStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
          },
          headerTitleStyle: {fontFamily: 'Poppins-Bold'},
          headerTitle: {backgroundColor: 'rgba(255, 255, 255, 0)'},
        }}
      />
      <Stack.Screen
        name="EditPromo"
        component={EditPromo}
        options={{
          title: 'Edit Promo',
          headerShown: true,
          headerStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
          },
          headerTitleStyle: {fontFamily: 'Poppins-Bold'},
          headerTitle: {backgroundColor: 'rgba(255, 255, 255, 0)'},
        }}
      />
      {/* <Stack.Screen
        name="CreateProduct"
        component={CreateProduct}
        options={{
          title: 'Create Product',
          headerShown: true,
          headerStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
          },
        }}
      /> */}
      {/* <Stack.Screen
        name="CreatePromo"
        component={CreatePromo}
        options={{
          title: 'Create Promo',
          headerShown: true,
          headerStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
          },
        }}
      /> */}
      <Stack.Screen
        name="EditProduct"
        component={EditProduct}
        options={{
          title: '',
          headerShown: true,
          headerStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
          },
          headerTitleStyle: {fontFamily: 'Poppins-Bold'},
          headerTitle: {backgroundColor: 'rgba(255, 255, 255, 0)'},
        }}
      />
      <Stack.Screen
        name="Delivery"
        component={Delivery}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
          },
          headerTitleStyle: {fontFamily: 'Poppins-Bold'},
          headerTitle: {backgroundColor: 'rgba(255, 255, 255, 0)'},
        }}
      />
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
          },
          headerTitleStyle: {fontFamily: 'Poppins-Bold'},
          headerTitle: {backgroundColor: 'rgba(255, 255, 255, 0)'},
        }}
      />
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen
        name="Detail"
        component={ProductDetails}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
          },
          headerTitleStyle: {fontFamily: 'Poppins-Bold'},
          headerTitle: {backgroundColor: 'rgba(255, 255, 255, 0)'},

          headerRight: () => (
            <Pressable
              onPress={() => {
                if (userRedux.role === 1) navigation.navigate('ManageOrder');
                else navigation.navigate('Cart');
              }}>
              <View style={{marginRight: '10%'}}>
                <Ionicons name="cart-outline" size={24} color="black" />
              </View>
            </Pressable>
          ),
        }}
        // options={({route}) => ({
        //   title: `Detail: ${route.params.id}`,
        //   headerShown: true,
        // })}
      />
    </Stack.Navigator>
  );
};

const Router = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default Router;
