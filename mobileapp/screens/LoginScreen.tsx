import {
  ScrollView,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import styles from '../cssStyles/styles';
import {useNavigation} from '@react-navigation/native';
// import {saveUserData} from '../services/firebaseDatabase';
import {useTheme} from 'react-native-paper';
import { Button } from 'react-native-paper';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignin = async () => {
    try {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          // Signed up
          const user = userCredential.user;
          if (user) {
            const id = user.uid;
            const name = user.displayName;
            // navigation.navigate('Home');
          }
        })
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert('Login error: ' + error.message);
        });
    } catch (error) {
      throw error;
    }
  };

  const handleSignup = async () => {
    navigation.navigate('Register');
  };

  const theme = useTheme();

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Closetify!</Text>
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
          <TouchableOpacity style={styles.button} onPress={handleSignin}>
            <Text style={styles.button}> Login </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.button}>
              Don't have an account? Sign-up here.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
