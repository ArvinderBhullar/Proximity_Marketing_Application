import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import styles from '../cssStyles/styles';
import {useNavigation} from '@react-navigation/native';

// FR - 11: User Login
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignin = async () => {
    try {
      const auth = getAuth();
      // FR - 11: 11.2.1 Username and password verification
      signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          // Signed up
          const user = userCredential.user;
          if (user) {
          }
        })
        .catch(error => {
          // FR - 11: 11.2.2 Error message
          Alert.alert('Login error: ' + error.message);
        });
    } catch (error) {
      throw error;
    }
  };

  // FR -10: 10.1.1 Registration form redirect
  const handleSignup = async () => {
    // @ts-ignore
    navigation.navigate('Register');
  };

  return (
    <ScrollView testID="loginScreen">
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Closetify!</Text>
          {/*FR - 11: 11.1.1 Login form*/}
          <TextInput
            testID="loginEmail"
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            testID="loginPassword"
            style={styles.input}
            placeholder="Password"
            textContentType="oneTimeCode"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />
          {/*FR - 11: 11.1.2 Username & Password capture*/}
          <TouchableOpacity
            testID="loginButton"
            style={styles.button}
            onPress={handleSignin}>
            <Text style={styles.button}> Login </Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="signupButton1"
            style={styles.button}
            onPress={handleSignup}>
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
