import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';

const validateEmail = (email) => {
  const regex = /^[0-9]{7}@ub\.edu\.ph$/;
  return regex.test(email);
};

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null);

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid email', 'Please enter a valid UB email address with 7 digits and ending with @ub.edu.ph');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://192.168.0.181:3000/register', { email, password });

      if (response.data.success) {
        setGeneratedOtp(response.data.otp); // Store the OTP sent by the server
        Alert.alert('OTP Sent', response.data.message);
      } else {
        Alert.alert('Registration Failed', response.data.message);
      }
    } catch (error) {
      console.log('Error:', error.response ? error.response.data : error);
      Alert.alert('Registration Error', 'An error occurred during registration. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    if (otp !== String(generatedOtp)) {
      Alert.alert('Invalid OTP', 'The OTP entered is incorrect. Please try again.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.0.181:3000/verify-otp', { email, otp });

      if (response.data.success) {
        Alert.alert('Registration Complete', 'Your registration is now complete.');
        navigation.navigate('Login'); // Navigate to login after successful registration
      } else {
        Alert.alert('Verification Failed', response.data.message);
      }
    } catch (error) {
      Alert.alert('Verification Error', 'An error occurred during verification. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/bmc.png')} style={styles.logo} />
        <Text style={styles.logoText}>University of Batangas</Text>
      </View>

      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your UB Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#aaa"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#aaa"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor="#aaa"
      />

      <View style={styles.otpContainer}>
        <TextInput
          style={styles.inputOtp}
          placeholder="Enter OTP"
          value={otp}
          onChangeText={setOtp}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.sendCodeButton} onPress={handleRegister} disabled={generatedOtp !== null}>
          <Text style={styles.buttonText}>SEND CODE</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>VERIFY OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.footer}>
          Already have an account? <Text style={styles.link}>Log in</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#757272' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  logo: { width: 40, height: 40, marginRight: 10 },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  title: { fontSize: 18, color: '#fff', marginBottom: 20 },
  input: { width: '80%', backgroundColor: '#4D1616', padding: 15, borderRadius: 10, color: '#fff', marginBottom: 10 },
  otpContainer: { flexDirection: 'row', alignItems: 'center', width: '80%', marginBottom: 20 },
  inputOtp: { backgroundColor: '#4D1616', padding: 15, borderRadius: 10, color: '#fff', flex: 1, marginRight: 10 },
  sendCodeButton: { backgroundColor: '#e63946', padding: 15, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  submitButton: { backgroundColor: '#e63946', padding: 15, borderRadius: 10, width: '80%', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  footer: { marginTop: 20, color: '#ccc' },
  link: { color: '#87ceeb', textDecorationLine: 'underline' },
});

export default RegisterScreen;
