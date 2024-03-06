import {
  ScrollView,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import styles from '../cssStyles/styles';
import {useNavigation} from '@react-navigation/native';
// import {saveUserData} from '../services/firebaseDatabase';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const navigation = useNavigation();

  const handleSignup = async () => {
    try {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          // Signed up
          const user = userCredential.user;
          if (user) {
            const id = user.uid;
            const name = user.displayName;
            navigation.navigate('Home');
          }
        })
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (error.code === 'auth/email-already-in-use') {
            alert('Email already in use! Please choose a different email.');
          } else {
            alert('Signup error: ' + error.message);
          }
          // ..
        });
    } catch (error) {
      throw error;
    }
  };

  const handleLogin = async () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            autoCapitalize="none"
            value={firstname}
            onChangeText={setFirstname}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            autoCapitalize="none"
            value={lastname}
            onChangeText={setLastname}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.button}> Register </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogin}>
            <Text> Already have an account? Login here. </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
