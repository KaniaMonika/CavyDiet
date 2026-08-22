import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../constants/styles';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import { API_URL } from '../constants/api';
import { useHerdStore } from '../store/herdStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';

export default function HerdSetupScreen() {
  

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [herdSize, setHerdSize] = useState('');
  const setHerd = useHerdStore((state) => state.setHerd);

  const handleCreateHerd = async () => {
    if (!user || !token) {
      alert('User is not logged in');
      return;
    }

    if (!Number.isInteger(Number(herdSize))) {
      alert('Herd size must be a whole number');
      return;
    }

    if (!herdSize || Number(herdSize) < 2) {
      alert('Herd size must be at least 2');
      return;
    }

    if (Number(herdSize) > 15) {
      alert('You can create up to 15 piggies in one herd only');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/herds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          herdSize: Number(herdSize),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Failed to create herd');
        return;
      }
      setHerd(
        data.herdId,
        Number(herdSize)
      );
      router.push('/piggy-setup');
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
        <Text style={styles.title}>Your Piggy Herd</Text>

        <View style={styles.card}>
          <Text style={styles.label}>
            How many piggies do you have?
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="paw-outline"
              size={20}
              color="#8A948D"
            />

            <TextInput
              style={styles.input}
              placeholder="Example: 2"
              placeholderTextColor="#A4ACA6"
              keyboardType="numeric"
              value={herdSize}
              onChangeText={setHerdSize}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleCreateHerd}
          >
            <Ionicons
              name="arrow-forward-outline"
              size={20}
              color="#FFFFFF"
            />

            <Text style={styles.buttonText}>
              Continue
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  

  section: {
    width: '100%',
  },

  title: {
    color: colors.textDark,
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
    marginBottom: 12,
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

  label: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },

  scrollContainer: {
     flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
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