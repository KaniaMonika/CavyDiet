import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors } from '../constants/styles';

type FeatureProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

function Feature({
  icon,
  title,
  description,
}: FeatureProps) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={colors.orange}
        />
      </View>

      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>
          {title}
        </Text>

        <Text style={styles.featureDescription}>
          {description}
        </Text>
      </View>
    </View>
  );
}

export default function LandingScreen() {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Image
          source={require('../assets/images/cavydiet-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.heroTitle}>
          Better daily care for your piggies.
        </Text>

        <Text style={styles.tagline}>
          Feeding, nutrition and health tracking made simple.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardEyebrow}>
              ALL IN ONE PLACE
            </Text>

            <Text style={styles.cardTitle}>
              Everything they need
            </Text>
          </View>

          <View style={styles.cardHeaderIcon}>
            <Ionicons
              name="heart"
              size={18}
              color={colors.orange}
            />
          </View>
        </View>

        <Text style={styles.cardText}>
          Keep everyday care organised without jumping between notes,
          spreadsheets and feeding charts.
        </Text>

        <View style={styles.features}>
          <Feature
            icon="leaf-outline"
            title="Daily nutrition"
            description="Track meals and nutritional balance."
          />

          <View style={styles.featureDivider} />

          <Feature
            icon="paw-outline"
            title="Your whole herd"
            description="Keep every piggy organised in one place."
          />

          <View style={styles.featureDivider} />

          <Feature
            icon="heart-outline"
            title="Health tracking"
            description="Follow weight and health history over time."
          />
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => router.push('/login')}
      >
        <Ionicons
          name="log-in-outline"
          size={20}
          color="#FFFFFF"
        />

        <Text style={styles.buttonText}>
          Log in
        </Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.secondaryButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => router.push('/register')}
      >
        <Ionicons
          name="person-add-outline"
          size={20}
          color="#4E5B53"
        />

        <Text style={styles.secondaryButtonText}>
          Create account
        </Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.aboutButton,
          pressed && styles.aboutButtonPressed,
        ]}
        onPress={() => router.push('/about')}
      >
        <Text style={styles.aboutButtonText}>
          Learn more about CavyDiet
        </Text>

        <Ionicons
          name="chevron-forward"
          size={14}
          color={colors.orange}
        />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },

  hero: {
    alignItems: 'center',
    marginBottom: 20,
  },

  logo: {
    width: 130,
    height: 130,
    marginBottom: 6,
  },

  heroTitle: {
    color: colors.textDark,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.4,
    maxWidth: 320,
  },

  tagline: {
    color: colors.textDark,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 7,
    opacity: 0.6,
    maxWidth: 300,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardEyebrow: {
    color: colors.orange,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginBottom: 3,
  },

  cardTitle: {
    color: colors.textDark,
    fontSize: 19,
    fontWeight: '800',
  },

  cardHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(244, 124, 60, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardText: {
    color: colors.textDark,
    fontSize: 13,
    lineHeight: 19,
    opacity: 0.62,
    marginTop: 10,
  },

  features: {
    marginTop: 14,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },

  featureIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: 'rgba(244, 124, 60, 0.09)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  featureContent: {
    flex: 1,
  },

  featureTitle: {
    color: colors.textDark,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },

  featureDescription: {
    color: colors.textDark,
    fontSize: 12,
    lineHeight: 17,
    opacity: 0.57,
  },

  featureDivider: {
    height: 1,
    marginLeft: 51,
    backgroundColor: 'rgba(51, 51, 51, 0.06)',
  },

  // Log in button — unchanged
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
    marginBottom: 12,
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

  // Create account button — unchanged
  secondaryButton: {
    marginTop: 5,
    minHeight: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,

    backgroundColor: '#F6F8F6',
    borderWidth: 1,
    borderColor: '#E4E9E5',
    borderRadius: 15,
  },

  secondaryButtonText: {
    color: '#4E5B53',
    fontSize: 16,
    fontWeight: '700',
  },

  aboutButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },

  aboutButtonPressed: {
    opacity: 0.5,
  },

  aboutButtonText: {
    color: colors.orange,
    fontSize: 13,
    fontWeight: '600',
  },
});