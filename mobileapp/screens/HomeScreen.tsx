import React from 'react';
import {View} from 'react-native';
// import { createNavigator, TabRouter } from 'react-navigation'
// import {useNavigation} from '@react-navigation/native';
import {auth} from '../services/Config';
import {onAuthStateChanged} from 'firebase/auth';
import {createMaterialBottomTabNavigator} from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Profile from './Profile';
import Coupons from './Coupons';
import SavedCoupons from './SavedCoupons';
import NearestScreen from './NearestScreen';
const Tab = createMaterialBottomTabNavigator();

// FR - 12: 12.1 Landing page
const HomeScreen = () => {

  onAuthStateChanged(auth, user => {
    if (user) {
      // User is signed in
    } else {
      // User is signed out
    }
  });

  const couponsTabOptions = {
    tabBarLabel: 'Coupons',
    tabBarIcon: ({color}: {color: string}) => (
      <MaterialCommunityIcons name="basket" color={color} size={20} />
    ),
  };

  const favoritesTabOptions = {
    tabBarLabel: 'Saved',
    tabBarIcon: ({color}: {color: string}) => (
      <MaterialCommunityIcons name="heart" color={color} size={20} />
    ),
    tabBarTestIDs: 'saveTab',
  };

  const profileTabOptions = {
    tabBarLabel: 'Profile',
    tabBarIcon: ({color}: {color: string}) => (
      <MaterialCommunityIcons name="account" color={color} size={20} />
    ),
  };

  const NearestTabOptions = {
    tabBarLabel: 'Nearby',
    tabBarIcon: ({color}: {color: string}) => (
      <MaterialCommunityIcons name="bell" color={color} size={20} />
    ),
  };

  return (
    <View style={{flex: 1}}>
      <Tab.Navigator initialRouteName="Coupons" barStyle={{height: 70}}>
        <Tab.Screen
          name="Coupons"
          component={Coupons}
          options={{tabBarButtonTestID: 'couponTab', ...couponsTabOptions}}
        />
        <Tab.Screen
          name="Saved Coupons"
          component={SavedCoupons}
          options={{tabBarButtonTestID: 'saveTab', ...favoritesTabOptions}}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{tabBarButtonTestID: 'profileTab', ...profileTabOptions}}
        />
        <Tab.Screen
          name="Nearest"
          component={NearestScreen}
          options={{tabBarButtonTestID: 'nearestTab', ...NearestTabOptions}}
        />
      </Tab.Navigator>
    </View>
  );
};

export default HomeScreen;
