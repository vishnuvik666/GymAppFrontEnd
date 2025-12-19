import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { GoogleAuth } from '../utils/SocialAuthentication';

export default function LoginScreen() {
  const login = useAuthStore(state => state.login);

  const onGoogleSignin = async () => {
    try {
      let result = await GoogleAuth();
      console.log('tok', result);
      login();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <Text style={styles.subtitle}>
        Welcome! Manage, Track and Grow your Gym with WellVantage.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => onGoogleSignin()}>
        <Image
          style={styles.image}
          source={require('../assets/googleLogin.png')}
        />
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 32,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 32,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  image: {
    width: 30,
    height: 30,
  },
  button: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 20,
  },
});
