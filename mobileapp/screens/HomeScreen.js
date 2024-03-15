import React, {useCallback} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import { createNavigator, TabRouter } from 'react-navigation'
import {useNavigation} from '@react-navigation/native';
import styles from '../cssStyles/styles';
import {auth} from '../services/Config';
import {getAuth, signOut, onAuthStateChanged} from 'firebase/auth';
import {createMaterialBottomTabNavigator} from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Profile from './Profile';
import Coupons from './Coupons';
import SavedCoupons from './SavedCoupons';

const Tab = createMaterialBottomTabNavigator();
const HomeScreen = () => {
  const navigation = useNavigation();
  // const auth = getAuth();
  var displayName = '';
  var uid = '';

  onAuthStateChanged(auth, user => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      console.log('User email: ', user.email);
      uid = user.uid;
      displayName = user.displayName;
    } else {
      // User is signed out
    }
  });

  const couponsTabOptions = {
    tabBarLabel: 'Coupons',
    tabBarIcon: ({color}) => (
      <MaterialCommunityIcons name="basket" color={color} size={20} />
    ),
  };

  const favoritesTabOptions = {
    tabBarLabel: 'Saved',
    tabBarIcon: ({color}) => (
      <MaterialCommunityIcons name="heart" color={color} size={20} />
    ),
  };

  const profileTabOptions = {
    tabBarLabel: 'Profile',
    tabBarIcon: ({color}) => (
      <MaterialCommunityIcons name="account" color={color} size={20} />
    ),
  };

  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        activeColor={'#03145b'}
        inactiveColor={'#0bb3e0'}
        initialRouteName="Coupons">
        <Tab.Screen
          name="Coupons"
          component={Coupons}
          options={couponsTabOptions}
        />
        <Tab.Screen
          name="Saved Coupons"
          component={SavedCoupons}
          options={favoritesTabOptions}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={profileTabOptions}
        />
      </Tab.Navigator>
    </View>
  );
};

export default HomeScreen;
