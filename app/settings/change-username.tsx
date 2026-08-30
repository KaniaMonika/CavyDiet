import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { API_URL } from '../../constants/api';
import { colors } from '../../constants/styles';
import { useAuthStore } from '../../store/authStore';

export default function ChangeUsernameScreen() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const updateUsername = useAuthStore(
    (state) => state.updateUsername
  );

  const [newUsername, setNewUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeUsername = async () => {
    const trimmedUsername = newUsername.trim();

    if (!trimmedUsername) {
      Alert.alert(
        'Missing information',
        'Please enter a new username.'
      );
      return;
    }

    if (trimmedUsername.length < 3) {
      Alert.alert(
        'Username too short',
        'Username must be at least 3 characters long.'
      );
      return;
    }

    if (trimmedUsername.length > 50) {
      Alert.alert(
        'Username too long',
        'Username cannot exceed 50 characters.'
      );
      return;
    }

    if (
      trimmedUsername.toLowerCase() ===
      user?.username.trim().toLowerCase()
    ) {
      Alert.alert(
        'Username unchanged',
        'Please enter a different username.'
      );
      return;
    }

    if (!token) {
      Alert.alert(
        'Session expired',
        'Please log in again.'
      );
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${API_URL}/auth/change-username`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: trimmedUsername,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to change username'
        );
      }

      updateUsername(data.username);

      Alert.alert(
        'Username updated',
        'Your username has been changed successfully.',
        [
          {
            text: 'Done',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong';

      Alert.alert(
        'Unable to change username',
        message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
            onPress={() => router.back()}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color="#29352D"
            />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>
              Change username
            </Text>

            <Text style={styles.subtitle}>
              Update how your name appears in CavyDiet
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          USERNAME DETAILS
        </Text>

        <View style={styles.formCard}>
          <View style={styles.inputGroupLast}>
            <Text style={styles.inputLabel}>
              New username
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#8A948D"
              />

              <TextInput
                style={styles.input}
                value={newUsername}
                onChangeText={setNewUsername}
                placeholder={
                  user?.username
                    ? `Current: ${user.username}`
                    : 'Enter new username'
                }
                placeholderTextColor="#A4ACA6"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={50}
                returnKeyType="done"
                onSubmitEditing={handleChangeUsername}
                editable={!isLoading}
              />
            </View>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            isLoading && styles.buttonDisabled,
          ]}
          onPress={handleChangeUsername}
          disabled={isLoading}
        >
          <Ionicons
            name="person-circle-outline"
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.buttonText}>
            {isLoading
              ? 'Updating username...'
              : 'Update username'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 60,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  backButtonPressed: {
    opacity: 0.7,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#29352D',
  },

  subtitle: {
    marginTop: 3,
    fontSize: 14,
    color: '#7A857D',
  },

  sectionTitle: {
    marginLeft: 4,
    marginBottom: 10,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#89928B',
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  inputGroupLast: {
    marginBottom: 0,
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

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});