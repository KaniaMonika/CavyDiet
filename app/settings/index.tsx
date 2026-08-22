import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../constants/styles';
import { useAuthStore } from '../../store/authStore';
import { useEffect, useState } from 'react';
import { API_URL } from '../../constants/api';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [passwordChangedAt, setPasswordChangedAt] =
  useState<string | null>(null);

  const fetchAccountDetails = async () => {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        const data = await response.json();

        if (!response.ok) {
        throw new Error(
            data.message || 'Failed to load account details'
        );
        }

        setPasswordChangedAt(data.password_changed_at);
    } catch (error) {
        console.log('Account details error:', error);
    }
    };


    useEffect(() => {
    if (token) {
        fetchAccountDetails();
    }
    }, [token]);

    const formattedPasswordDate = passwordChangedAt
    ? new Date(passwordChangedAt).toLocaleDateString('en-GB')
    : 'Never';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Settings</Text>
        <Text style={styles.pageSubtitle}>
          Manage your account and app preferences
        </Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.username?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.username}>
            {user?.username || 'User'}
          </Text>

          <Text style={styles.email}>
            {user?.email || ''}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Account</Text>

      <Pressable
        style={({ pressed }) => [
          styles.settingCard,
          pressed && styles.settingCardPressed,
        ]}
        onPress={() =>
          router.push('/settings/change-password')
        }
      >
        <View style={styles.settingIcon}>
          <Text style={styles.settingIconText}>🔒</Text>
        </View>

        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>
            Change password
          </Text>

          <Text style={styles.settingDescription}>
            Last changed: {formattedPasswordDate}
            </Text>
        </View>
      </Pressable>

      <Text style={styles.sectionTitle}>App</Text>

        <Pressable
        style={({ pressed }) => [
            styles.settingCard,
            pressed && styles.settingCardPressed,
        ]}
        onPress={() => router.push('/about')}
        >
       <View style={styles.settingIcon}>
          <Image
            source={require("../../assets/images/cavydiet-icon.png")}
            style={styles.settingLogo}
            resizeMode="cover"
          />
        </View>

        <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>
            About CavyDiet
            </Text>

            <Text style={styles.settingDescription}>
            Version 1.0.0
            </Text>
        </View>

        <Ionicons
            name="chevron-forward"
            size={20}
            color="#A0A8A2"
        />
        </Pressable>
                
      </View>
    
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  header: {
    marginBottom: 24,
  },

  pageTitle: {
    color: colors.textDark,
    fontSize: 30,
    fontWeight: '800',
  },

  pageSubtitle: {
    color: colors.textDark,
    fontSize: 15,
    marginTop: 6,
    opacity: 0.7,
  },

  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
  },

  profileInfo: {
    marginLeft: 14,
    flex: 1,
  },

  username: {
    color: colors.textDark,
    fontSize: 19,
    fontWeight: '700',
  },

  email: {
    color: colors.textDark,
    fontSize: 14,
    marginTop: 4,
    opacity: 0.65,
  },

  sectionTitle: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    marginLeft: 4,
  },

  settingCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  settingCardPressed: {
    opacity: 0.75,
  },

  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  settingIconText: {
    fontSize: 22,
  },

  settingContent: {
    flex: 1,
    marginLeft: 14,
  },

  settingTitle: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '700',
  },

  settingDescription: {
    color: colors.textDark,
    fontSize: 13,
    marginTop: 3,
    opacity: 0.6,
  },

  settingLogo: {
    width: "60%",
    height: "60%",
  },
});