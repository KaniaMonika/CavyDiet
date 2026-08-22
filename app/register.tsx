import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { router } from 'expo-router';
import { commonStyles, colors } from '../constants/styles';
import { useState } from 'react';
import { API_URL } from '../constants/api';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username.trim() || !email.trim() || !password) {
      alert('Username, email and password are required');
      return;
    }

    if (username.trim().length < 3) {
      alert('Username must be at least 3 characters long');
      return;
    }

    if (!emailRegex.test(email.trim())) {
      alert('Invalid email address');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      alert('Password must contain at least one letter and one number');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Registration failed');
        return;
      }

      alert('Account created successfully');
      router.push('/');
    } catch (error) {
      alert('Cannot connect to server');
    }
  };


  return (
     <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid
        extraScrollHeight={80}
        keyboardShouldPersistTaps="handled"
      >
          

      <View style={styles.section}>
        <Text style={styles.pageSubtitle}>Create your account</Text>

          <Text style={styles.title}>Registration</Text>

          <View style={styles.card}>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Username
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#8A948D"
              />

              <TextInput
                style={styles.input}
                placeholder="guineapiglover"
                placeholderTextColor="#A4ACA6"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Email
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#8A948D"
              />

              <TextInput
                style={styles.input}
                placeholder="guinapig@gmail.com"
                placeholderTextColor="#A4ACA6"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Password
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#8A948D"
              />

              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#A4ACA6"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>
            Confirm password
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#8A948D"
            />

            <TextInput
              style={styles.input}
              placeholder="Repeat your password"
              placeholderTextColor="#A4ACA6"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleRegister}
          >
            <Ionicons
              name="person-add-outline"
              size={20}
              color="#FFFFFF"
            />

            <Text style={styles.buttonText}>
              Create Account
            </Text>
          </Pressable>

          <View style={styles.authLinkContainer}>
            <Text style={styles.authLinkText}>Already have an account?</Text>

            <Pressable onPress={() => router.push('/')}>
              <Text style={styles.authLink}>Sign in</Text>
            </Pressable>
          </View>
        </View>
      </View>
     </KeyboardAwareScrollView>
  
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.textDark,
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
    marginBottom: 12,
  },

  authLinkContainer: {
    marginTop: 16,
    alignItems: 'center',
  },

  authLinkText: {
    color: colors.textDark,
    fontSize: 14,
  },

  authLink: {
    color: colors.orange,
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 4,
    textDecorationLine: 'underline',
  },

  pageSubtitle: {
    width: '100%',
    color: colors.textDark,
    fontSize: 18,
    fontWeight: '600',
    paddingLeft: 12,
    marginBottom: 20,
  },

  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  section: {
    width: '100%',
  },

  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,

    elevation: 3,
  },

  inputGroup: {
  marginBottom: 18,
},

inputLabel: {
  marginBottom: 8,
  fontSize: 13,
  fontWeight: '600',
  color: '#4E5B53',
},

inputContainer: {
  minHeight: 54,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F6F8F6',
  borderWidth: 1,
  borderColor: '#E4E9E5',
  borderRadius: 15,
  paddingHorizontal: 15,
},

input: {
  flex: 1,
  marginLeft: 11,
  fontSize: 15,
  color: '#29352D',
},

button: {
  marginTop: 25,
  minHeight: 56,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 9,
  borderRadius: 17,
  backgroundColor: colors.orange,
  shadowColor: colors.orange,
  shadowOffset: {
    width: 0,
    height: 5,
  },
  shadowOpacity: 0.2,
  shadowRadius: 10,
  elevation: 3,
},

buttonPressed: {
  opacity: 0.85,
  transform: [{ scale: 0.99 }],
},

buttonText: {
  fontSize: 16,
  fontWeight: '700',
  color: '#FFFFFF',
},
});