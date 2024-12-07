import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

// Function to handle OTP verification
const VerifyOtp = ({ email, generatedOtp, onSuccess }) => {
  const [otp, setOtp] = useState('');
  
  const handleVerifyOtp = async () => {
    // Check if OTP is entered
    if (otp !== String(generatedOtp)) {
      Alert.alert('Invalid OTP', 'The OTP entered is incorrect. Please try again.');
      return;
    }

    try {
      // Call the backend to verify the OTP
      const response = await axios.post('http://192.168.0.181:3000/verify-otp', {
        email,
        otp,
      });

      if (response.data.success) {
        Alert.alert('Registration Complete', 'Your registration is now complete.');
        // Navigate to Login or call onSuccess callback
        onSuccess();
      } else {
        Alert.alert('Verification Failed', response.data.message);
      }
    } catch (error) {
      Alert.alert('Verification Error', 'An error occurred during verification. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>VERIFY OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#757272',
    padding: 20,
  },
  input: {
    width: '80%',
    backgroundColor: '#4D1616',
    padding: 15,
    borderRadius: 10,
    color: '#fff',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#e63946',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default VerifyOtp;
