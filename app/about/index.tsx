import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors } from '../../constants/styles';

type InfoItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

function InfoItem({
  icon,
  title,
  description,
}: InfoItemProps) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.iconBox}>
        <Ionicons
          name={icon}
          size={20}
          color={colors.orange}
        />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>
          {title}
        </Text>

        <Text style={styles.infoDescription}>
          {description}
        </Text>
      </View>
    </View>
  );
}

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
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
              size={22}
              color={colors.textDark}
            />
          </Pressable>

          <View>
            <Text style={styles.title}>
              About
            </Text>

            <Text style={styles.subtitle}>
              Learn more about CavyDiet
            </Text>
          </View>
        </View>

        <View style={styles.appCard}>
          <View style={styles.appTopRow}>
            <Image
              source={require('../../assets/images/cavydiet-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.appInfo}>
              <Text style={styles.appName}>
                CavyDiet
              </Text>

              <Text style={styles.appLabel}>
                GUINEA PIG CARE
              </Text>

              <View style={styles.versionBadge}>
                <View style={styles.versionDot} />

                <Text style={styles.versionBadgeText}>
                  Version 1.0.0
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.appDivider} />

          <Text style={styles.appDescription}>
            A simple companion for managing your guinea pigs&apos;
            diet, health and everyday care.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            ABOUT THE APP
          </Text>

          <Ionicons
            name="sparkles-outline"
            size={15}
            color={colors.orange}
          />
        </View>

        <View style={styles.sectionCard}>
          <InfoItem
            icon="heart-outline"
            title="Made for better care"
            description="Keep important information about your guinea pigs organised in one place."
          />

          <View style={styles.divider} />

          <InfoItem
            icon="paw-outline"
            title="Track every piggy"
            description="Manage profiles, photos, health checks and weight history individually."
          />

          <View style={styles.divider} />

          <InfoItem
            icon="leaf-outline"
            title="Healthy habits"
            description="Support healthier routines and make everyday care easier to follow."
          />
        </View>

        <Text style={styles.sectionTitle}>
          IMPORTANT INFORMATION
        </Text>

        <View style={styles.noticeCard}>
          <View style={styles.noticeIconBox}>
            <Ionicons
              name="information-circle-outline"
              size={21}
              color="#9A7444"
            />
          </View>

          <View style={styles.noticeContent}>
            <Text style={styles.noticeTitle}>
              A helpful companion, not a veterinarian
            </Text>

            <Text style={styles.noticeText}>
              CavyDiet is intended to support everyday care and
              organisation. It does not replace professional
              veterinary advice.
            </Text>
          </View>
        </View>

        <View style={styles.footerMark}>
          <View style={styles.footerLine} />

          <Ionicons
            name="heart-outline"
            size={14}
            color={colors.orange}
          />

          <View style={styles.footerLine} />
        </View>

        <Text style={styles.footer}>
          Made with care for guinea pigs
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    opacity: 0.6,
    transform: [{ scale: 0.96 }],
  },

  title: {
    fontSize: 27,
    fontWeight: '800',
    color: colors.textDark,
    letterSpacing: -0.4,
  },

  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: '#7A857D',
  },

  appCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 26,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  appTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 92,
    height: 92,
    borderRadius: 22,
    marginRight: 16,
  },

  appInfo: {
    flex: 1,
  },

  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textDark,
    letterSpacing: -0.3,
  },

  appLabel: {
    marginTop: 3,
    color: colors.orange,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  versionBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(244, 124, 60, 0.08)',
  },

  versionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.orange,
  },

  versionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textDark,
  },

  appDivider: {
    height: 1,
    backgroundColor: 'rgba(51, 51, 51, 0.06)',
    marginVertical: 15,
  },

  appDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: '#6F7B72',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginLeft: 4,
    marginBottom: 10,
  },

  sectionTitle: {
    marginLeft: 4,
    marginBottom: 10,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: '#89928B',
  },

  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 17,
    marginBottom: 26,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: 'rgba(244, 124, 60, 0.09)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
  },

  infoDescription: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 18,
    color: '#7A857D',
  },

  divider: {
    height: 1,
    marginLeft: 52,
    backgroundColor: 'rgba(51, 51, 51, 0.06)',
  },

  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 18,
    padding: 16,
    backgroundColor: '#FBF5EA',
  },

  noticeIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(154, 116, 68, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  noticeContent: {
    flex: 1,
  },

  noticeTitle: {
    color: '#765C3D',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },

  noticeText: {
    fontSize: 12,
    lineHeight: 19,
    color: '#7F694C',
  },

  footerMark: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 26,
    opacity: 0.55,
  },

  footerLine: {
    width: 32,
    height: 1,
    backgroundColor: 'rgba(244, 124, 60, 0.35)',
  },

  footer: {
    marginTop: 7,
    textAlign: 'center',
    fontSize: 11,
    color: '#A0A8A2',
  },
});