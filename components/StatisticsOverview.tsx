import { Statistics } from '../types/statistics';
import { colors } from '../constants/styles';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface StatisticsOverviewProps {
  statistics: Statistics;
  currentHerdNumber: number | null;
}

interface StatisticCardProps {
  label: string;
  value: string;
}

function StatisticCard({
  label,
  value,
}: StatisticCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
}

export default function StatisticsOverview({
  statistics,
  currentHerdNumber,
}: StatisticsOverviewProps) {
  return (
    <View>
      <Text style={styles.title}>Statistics</Text>

      <Text style={styles.subtitle}>
        Current herd: #{currentHerdNumber || '?'}
      </Text>

      <Text style={styles.period}>
        Last {statistics.periodDays} days
      </Text>

      {statistics.mealsRecorded === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="stats-chart-outline"
            size={42}
            color={colors.orange}
          />

          <Text style={styles.emptyTitle}>
            Nothing to display
          </Text>

          <Text style={styles.emptyText}>
            Record your first meal to start seeing nutrition statistics.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push('/feeding')}
          >
            <Ionicons
              name="nutrition-outline"
              size={21}
              color="#FFFFFF"
            />

            <Text style={styles.buttonText}>
              Go to today&apos;s feeding
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>

            <View style={styles.cardsContainer}>
              <StatisticCard
                label="Meals recorded"
                value={`${statistics.mealsRecorded} / ${statistics.periodDays}`}
              />

              <StatisticCard
                label="High oxalate days"
                value={String(statistics.highOxalateDays)}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Average Nutrition</Text>

            <View style={styles.cardsContainer}>
              <StatisticCard
                label="Vitamin C"
                value={`${statistics.averages.vitaminC} mg`}
              />

              <StatisticCard
                label="Calcium"
                value={`${statistics.averages.calcium} mg`}
              />

              <StatisticCard
                label="Ca:P"
                value={`${statistics.averages.calciumPhosphorusRatio} : 1`}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.textDark,
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitle: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },

  period: {
    color: '#7A857D',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 24,
  },

  cardsContainer: {
    gap: 12,
    },

    card: {
  backgroundColor: '#F6F8F6',
  borderRadius: 15,
  paddingVertical: 16,
  paddingHorizontal: 16,

  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',

  borderWidth: 1,
  borderColor: '#E4E9E5',
},

cardLabel: {
  color: '#4E5B53',
  fontSize: 15,
  fontWeight: '600',
  flex: 1,
  marginRight: 12,
},

cardValue: {
  color: '#29352D',
  fontSize: 18,
  fontWeight: '700',
},

sectionTitle: {
  color: '#4E5B53',
  fontSize: 18,
  fontWeight: '700',
  marginBottom: 12,
},

    section: {
    marginBottom: 24,
    },

  emptyState: {
  backgroundColor: colors.white,
  borderRadius: 20,
  padding: 24,
  alignItems: 'center',
},

emptyTitle: {
  color: colors.textDark,
  fontSize: 21,
  fontWeight: '700',
  marginTop: 14,
},

emptyText: {
  color: '#7A857D',
  fontSize: 15,
  lineHeight: 22,
  textAlign: 'center',
  marginTop: 8,
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