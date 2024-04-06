import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import styles from '../cssStyles/styles';
import {useNavigation} from '@react-navigation/native';
import {Alert} from 'react-native';
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
          }
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            Alert.alert(
              'Email already in use! Please choose a different email.',
            );
          } else {
            Alert.alert('Signup error: ' + error.message);
          }
        });
    } catch (error) {
      throw error;
    }
  };

  const handleLogin = async () => {
    // @ts-ignore
    navigation.navigate('Login');
  };

  return (
    <ScrollView testID="registerScreen">
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Welcome</Text>
          <TextInput
            testID="firstName"
            style={styles.input}
            placeholder="First Name"
            autoCapitalize="none"
            value={firstname}
            onChangeText={setFirstname}
          />
          <TextInput
            testID="lastName"
            style={styles.input}
            placeholder="Last Name"
            autoCapitalize="none"
            value={lastname}
            onChangeText={setLastname}
          />
          <TextInput
            testID="registerEmail"
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            testID="registerPassword"
            style={styles.input}
            placeholder="Password"
            textContentType="oneTimeCode"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            testID="registerButton"
            style={styles.button}
            onPress={handleSignup}>
            <Text style={styles.button}> Register </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.button}>
              {' '}
              Already have an account? Login here.{' '}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
