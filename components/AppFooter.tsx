import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/styles';

type FooterLinkProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

function FooterLink({
  label,
  icon,
  onPress,
}: FooterLinkProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.linkButton,
        pressed && styles.linkButtonPressed,
      ]}
    >
      <Ionicons
        name={icon}
        size={16}
        color={colors.orange}
      />

      <Text style={styles.linkText}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function AppFooter() {
  const insets = useSafeAreaInsets();

    return (
    <View
      style={[
        styles.footer,
        {
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      <View style={styles.divider} />

      <View style={styles.mainRow}>
        <View style={styles.brandIcon}>
          <Image
            source={require('../assets/images/cavydiet-logo.png')}
            style={styles.brandImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.links}>
          <FooterLink
            label="Terms"
            icon="document-text-outline"
            onPress={() => router.push('/info/terms')}
          />

          <FooterLink
            label="Privacy"
            icon="shield-checkmark-outline"
            onPress={() => router.push('/info/privacy')}
          />

          <FooterLink
            label="Contact"
            icon="mail-outline"
            onPress={() => router.push('/info/contact')}
          />

          <FooterLink
            label="Help"
            icon="help-circle-outline"
            onPress={() => router.push('/info/help')}
          />
        </View>
      </View>

      <Text style={styles.copy}>
        © 2026 CavyDiet · All rights reserved
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    backgroundColor: colors.background,
    paddingTop: 4,
    paddingHorizontal: 14,
    alignItems: 'center',
  },

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(51, 51, 51, 0.08)',
    marginBottom: 8,
  },

  mainRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  brandIcon: {
  width: 28,
  height: 28,
  alignItems: 'center',
  justifyContent: 'center',
},

  links: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(244, 124, 60, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },

  linkButtonPressed: {
    opacity: 0.55,
    transform: [{ scale: 0.97 }],
  },

  linkText: {
    color: colors.textDark,
    fontSize: 10,
    fontWeight: '600',
  },

  copy: {
    marginTop: 6,
    color: '#8A9194',
    fontSize: 9,
    textAlign: 'center',
  },

  brandImage: {
  width: 30,
  height: 30,
},
});