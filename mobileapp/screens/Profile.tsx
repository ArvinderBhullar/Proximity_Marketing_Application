import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {signOut} from 'firebase/auth';
import {auth} from '../services/Config';
import {Button} from 'react-native-paper';
import {toggleSimulation} from './Coupons';

const Profile = () => {
  const [buttonText, setButtonText] = useState('Begin');

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
      <Button testID="logoutButton" onPress={handleLogout}>
        Logout
      </Button>
      <Button
        testID="Simulation"
        onPress={() => {
          toggleSimulation();
          setButtonText(prevState => (prevState === 'Begin' ? 'End' : 'Begin'));
        }}>
        {buttonText} Simulation
      </Button>
    </View>
  );
};

export default Profile;
