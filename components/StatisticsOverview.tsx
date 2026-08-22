import { StyleSheet, Text, View } from 'react-native';
import { Statistics } from '../types/statistics';
import { colors } from '../constants/styles';

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

    
});