import React, {useEffect} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../cssStyles/styles';
import {auth} from '../services/Config';
import {getAuth, signOut, onAuthStateChanged} from 'firebase/auth';
import useBLE from './../services/BLEScan';

const HomeScreen = () => {
  const navigation = useNavigation();
  const {requestPermissions, scanForDevices, allDevices} = useBLE();
  // const auth = getAuth();
  var displayName = '';
  var uid = '';

  // Functionality to scan for new devices every 10 seconds
  useEffect(() => {
    const fetchDevicesInterval = setInterval(() => {
      fetchAllDevices();
    }, 10000); // Fetch devices every 10 seconds

    return () => clearInterval(fetchDevicesInterval);
  }, []);

  // Function to scan for devices if permission was granted by the user to do so
  const fetchAllDevices = () => {
    requestPermissions(isGranted => {
      console.log(isGranted ? 'Granted' : 'Not Granted');
      if (isGranted) {
        scanForDevices();
      }
    });
  };

  // DEBUG: simple code just to print the name and RSSI of the device
  const printAllDevices = () => {
    allDevices.forEach(device => {
      console.log(
        `Device Name: ${device['localName']}, RSSI: ${device['rssi']}`,
      );
    });
  };

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
      <TouchableOpacity style={styles.button} onPress={printAllDevices}>
        {/* Can remove the button once we dont need to print the devices */}
        <Text style={styles.button}> Print devices </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomeScreen;
