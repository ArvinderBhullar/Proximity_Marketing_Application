import React from 'react';
import {View, Text} from 'react-native';
import {signOut} from 'firebase/auth';
import {auth} from '../services/Config';
import {Button} from 'react-native-paper';

const Profile = () => {
  const handleLogout = async () => {
    // const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log('User signed out!');
      })
      .catch(error => {
        // An error happened.
        console.log('Logout error: ' + error.message);
      });
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Profile Screen</Text>
      <Button onPress={handleLogout}>Logout</Button>
    </View>
  );
};

export default Profile;
