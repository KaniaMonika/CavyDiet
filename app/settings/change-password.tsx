import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../../constants/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import PasswordInput from '../../components/PasswordInput';
import { API_URL } from '../../constants/api';
import { useAuthStore } from '../../store/authStore';

export default function ChangePasswordScreen() {
  const token = useAuthStore((state) => state.token);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Missing information', 'Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        'Passwords do not match',
        'Make sure both new password fields are identical.'
      );
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${API_URL}/auth/change-password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to change password'
        );
      }

      Alert.alert(
        'Password updated',
        'Your password has been changed successfully.',
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

      Alert.alert('Unable to change password', message);
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
              <Text style={styles.title}>Change password</Text>

              <Text style={styles.subtitle}>
                Keep your CavyDiet account secure
              </Text>
            </View>
          </View>

          

          <Text style={styles.sectionTitle}>PASSWORD DETAILS</Text>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Current password
              </Text>

              

               <PasswordInput
                  icon="lock-closed-outline"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  placeholderTextColor="#A4ACA6"
                  autoComplete="current-password"
                />
              
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New password</Text>

             

                 <PasswordInput
                  icon="key-outline"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor="#A4ACA6"
                  autoComplete="new-password"
                />
              
            </View>

            <View style={styles.inputGroupLast}>
              <Text style={styles.inputLabel}>
                Confirm new password
              </Text>

             

                <PasswordInput
                  icon="checkmark-circle-outline"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Repeat new password"
                  placeholderTextColor="#A4ACA6"
                  autoComplete="new-password"
                />
              
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              isLoading && styles.buttonDisabled,
            ]}
            onPress={handleChangePassword}
            disabled={isLoading}
          >
            <Ionicons
              name="shield-checkmark"
              size={20}
              color="#FFFFFF"
            />

            <Text style={styles.buttonText}>
              {isLoading
                ? 'Updating password...'
                : 'Update password'}
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

  keyboardView: {
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

  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF3EF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 28,
  },

  securityIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  securityContent: {
    flex: 1,
  },

  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334038',
  },

  securityDescription: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: '#738078',
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

  inputGroup: {
    marginBottom: 18,
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