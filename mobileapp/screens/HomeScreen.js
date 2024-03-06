import React from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../cssStyles/styles';
import {getAuth, signOut, onAuthStateChanged} from 'firebase/auth';

const HomeScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
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
  const handleLogout = async () => {
    // const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log('User signed out!');
      })
      .catch(error => {
        // An error happened.
        alert('Logout error: ' + error.message);
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Hello World!</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.button}> Logout </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomeScreen;
