import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';

import { colors } from '../constants/styles';
import { useAuthStore } from '../store/authStore';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { API_URL } from '../constants/api';
import { tips } from '../constants/tips';

type PiggySummary = {
  id: number;
  name: string;
  photo_url: string | null;
};

type HerdSummary = {
  id: number;
  piggies: PiggySummary[];
};

type QuickActionProps = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

function QuickAction({
  title,
  subtitle,
  icon,
  onPress,
}: QuickActionProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionCard,
        pressed && styles.actionCardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.actionIcon}>
        <Ionicons
          name={icon}
          size={24}
          color={colors.orange}
        />
      </View>

      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={22}
        color={colors.orange}
      />
    </Pressable>
  );
}

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const [herdsCount, setHerdsCount] = useState(0);
  const [piggiesCount, setPiggiesCount] = useState(0);

  const [isSummaryLoading, setIsSummaryLoading] =
  useState(true);

  const [previewPiggies, setPreviewPiggies] =
  useState<PiggySummary[]>([]);

  const [randomTipIndex] = useState(() =>
    Math.floor(Math.random() * tips.length)
  );
  const currentTip = tips[randomTipIndex];

  const fetchHomeSummary = async () => {
  if (!token) {
    setIsSummaryLoading(false);
    return;
  }

  setIsSummaryLoading(true);

  try {
    const response = await fetch(
      `${API_URL}/herds/my`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return;
    }

    if (!Array.isArray(data)) {
      return;
    }

    const totalPiggies = data.reduce(
      (total: number, herd: HerdSummary) =>
        total + herd.piggies.length,
      0
    );

    const allPiggies = data.flatMap(
      (herd: HerdSummary) => herd.piggies
    );

    setHerdsCount(data.length);
    setPiggiesCount(totalPiggies);
    setPreviewPiggies(allPiggies.slice(0, 3));
  } catch (error) {
    console.log('Home summary error:', error);
  } finally {
    setIsSummaryLoading(false);
  }
};

  useFocusEffect(
    useCallback(() => {
      fetchHomeSummary();
    }, [token])
  );


  

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hi {user?.username || 'User'} 👋
        </Text>

        <Text style={styles.welcomeText}>
          Welcome back to CavyDiet
        </Text>
      </View>

      <View style={styles.summaryCard}>
  {isSummaryLoading ? (
    <View style={styles.summaryLoading}>
      <ActivityIndicator
        size="large"
        color={colors.orange}
      />

      <Text style={styles.summaryLoadingText}>
        Loading your cavy family...
      </Text>
    </View>
  ) : (
    <>
      <View style={styles.avatarGroup}>
        {previewPiggies.length === 0 ? (
          <View style={styles.avatarWrapper}>
            <View style={styles.emptyAvatar}>
              <Text style={styles.avatarEmoji}>
                🐹
              </Text>
            </View>
          </View>
        ) : (
          previewPiggies.map((piggy, index) => (
            <View
              key={piggy.id}
              style={[
                styles.avatarWrapper,
                index > 0 &&
                  styles.avatarOverlap,
              ]}
            >
              {piggy.photo_url ? (
                <Image
                  source={{
                    uri: `${API_URL}${piggy.photo_url}`,
                  }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.emptyAvatar}>
                  <Text style={styles.avatarEmoji}>
                    🐹
                  </Text>
                </View>
              )}
            </View>
          ))
        )}
      </View>

      <View style={styles.summaryContent}>
        <Text style={styles.summaryTitle}>
          Your Cavy Family
        </Text>

        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {piggiesCount}
            </Text>

            <Text style={styles.statLabel}>
              Piggies
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {herdsCount}
            </Text>

            <Text style={styles.statLabel}>
              Herds
            </Text>
          </View>
        </View>
      </View>
    </>
  )}
</View>

      <Text style={styles.sectionTitle}>Quick actions</Text>

      <View style={styles.actionsContainer}>
        <QuickAction
          title="Today's Feeding"
          subtitle="Add food and check today's nutrition"
          icon="nutrition-outline"
          onPress={() => router.push('/feeding')}
        />

        <QuickAction
          title="Your Piggies"
          subtitle="Open profiles and health history"
          icon="paw-outline"
          onPress={() => router.push('/piggies')}
        />

        <QuickAction
          title="Your Herds"
          subtitle="Manage your herds and piggies"
          icon="home-outline"
          onPress={() => router.push('/herds')}
        />

        <QuickAction
          title="Statistics"
          subtitle="Review the last 7 days"
          icon="stats-chart-outline"
          onPress={() => router.push('/statistics')}
        />

        <QuickAction
          title="Settings"
          subtitle="Manage your account"
          icon="settings-outline"
          onPress={() => router.push('/settings')}
        />
      </View>

      <View style={styles.tipCard}>
        <View style={styles.tipIcon}>
          <Ionicons
            name="bulb-outline"
            size={24}
            color={colors.orange}
          />
        </View>

        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>
            Today's Tip #{randomTipIndex + 1}
          </Text>

          <Text style={styles.tipText}>
            {currentTip}
        </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 24,
  },

  greeting: {
    color: colors.textDark,
    fontSize: 29,
    fontWeight: '800',
  },

  welcomeText: {
    color: colors.textDark,
    fontSize: 15,
    marginTop: 6,
    opacity: 0.68,
  },

 summaryCard: {
  backgroundColor: colors.white,
  borderRadius: 24,
  padding: 20,
  alignItems: 'center',
  marginBottom: 28,
  minHeight: 170,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 3,
},

summaryLoading: {
  minHeight: 130,
  justifyContent: 'center',
  alignItems: 'center',
},

summaryLoadingText: {
  color: '#7A857D',
  fontSize: 14,
  fontWeight: '600',
  marginTop: 12,
},

  summaryIcon: {
    width: 66,
    height: 66,
    borderRadius: 22,
    backgroundColor: colors.input,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  summaryEmoji: {
    fontSize: 34,
  },

  summaryContent: {
    width: '100%',
    alignItems: 'center',
  },

  summaryTitle: {
    color: colors.textDark,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  summaryText: {
    color: colors.textDark,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
    opacity: 0.65,
  },

  sectionTitle: {
    color: colors.textDark,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 4,
    marginBottom: 12,
  },

  actionsContainer: {
    gap: 12,
    marginBottom: 28,
  },

  actionCard: {
    minHeight: 82,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  actionCardPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },

  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionContent: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },

  actionTitle: {
    color: colors.textDark,
    fontSize: 17,
    fontWeight: 'bold',
  },

  actionSubtitle: {
    color: colors.textDark,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
    opacity: 0.62,
  },

  tipCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  tipIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: colors.input,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  tipContent: {
    flex: 1,
  },

  tipTitle: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: 'bold',
  },

  tipText: {
    color: colors.textDark,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
    opacity: 0.7,
  },

  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  statItem: {
    alignItems: 'center',
    minWidth: 58,
  },

  statValue: {
    color: colors.orange,
    fontSize: 22,
    fontWeight: '800',
  },

  statLabel: {
    color: colors.textDark,
    fontSize: 12,
    marginTop: 2,
    opacity: 0.65,
  },

  statDivider: {
    width: 1,
    height: 34,
    backgroundColor: colors.input,
    marginHorizontal: 14,
  },

  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: colors.white,
    overflow: 'hidden',
    backgroundColor: colors.input,
  },

  avatarOverlap: {
    marginLeft: -16,
  },

  avatarImage: {
    width: '100%',
    height: '100%',
  },

  emptyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    backgroundColor: colors.input,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarEmoji: {
    fontSize: 28,
  },
});