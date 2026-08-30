import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { router } from 'expo-router';
import { commonStyles, colors } from '../constants/styles';
import { useState } from 'react';
import { API_URL } from '../constants/api';
import { useAuthStore } from '../store/authStore';
import { useHerdStore } from '../store/herdStore';
import { Ionicons } from '@expo/vector-icons';
import PasswordInput from '../components/PasswordInput';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const setHerd = useHerdStore((state) => state.setHerd);



  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Login failed');
        return;
      }

      setAuth(data.user, data.token);

      const herdsResponse = await fetch(`${API_URL}/herds/my`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      const herds = await herdsResponse.json();

      if (!herdsResponse.ok) {
        alert(herds.message || 'Failed to fetch herds');
        return;
      }

      alert('Login successful');

      if (herds.length > 0) {
        setHerd(
          herds[0].id,
          herds[0].herd_size,
          1
        );

        router.push('/home');
        return;
      }

      router.push('/herd-setup');
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
        <Text style={styles.pageSubtitle}>Sign in to continue</Text>

          <Text style={styles.title}>Log in</Text>

          <View style={styles.card}>

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

          <Text style={styles.inputLabel}>
            Password
          </Text>

         <PasswordInput
  placeholder="Enter your password"
  placeholderTextColor="#A4ACA6"
  value={password}
  onChangeText={setPassword}
  autoComplete="current-password"
/>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleLogin}
          >
            <Ionicons
              name="log-in-outline"
              size={20}
              color="#FFFFFF"
            />

            <Text style={styles.buttonText}>
              Login
            </Text>
          </Pressable>
            <View style={styles.authLinkContainer}>
            <Text style={styles.authLinkText}>Don't have an account?</Text>

            <Pressable onPress={() => router.push('/register')}>
              <Text style={styles.authLink}>Sign up</Text>
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

  inputGroup: {
    marginBottom: 18,
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

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
    
});