import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/styles';
import { Ionicons } from '@expo/vector-icons';

interface DayNavigatorProps {
  label: string;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onOpenCalendar: () => void;
}

export default function DayNavigator({
  label,
  canGoNext,
  onPrevious,
  onNext,
  onOpenCalendar,
}: DayNavigatorProps) {
  return (
    <View style={styles.dayNavigator}>
      <Pressable
        style={styles.dayArrowButton}
        onPress={onPrevious}
      >
        <Text style={styles.dayArrowText}>‹</Text>
      </Pressable>

      <Pressable
        style={styles.dayLabelButton}
        onPress={onOpenCalendar}
      >
        <Text style={styles.dayLabel}>
          {label}
        </Text>

        <Ionicons
          name="calendar-outline"
          size={22}
          color={colors.orange}
        />
      </Pressable>

      <Pressable
        style={[
          styles.dayArrowButton,
          !canGoNext && styles.dayArrowButtonDisabled,
        ]}
        onPress={onNext}
        disabled={!canGoNext}
      >
        <Text
          style={[
            styles.dayArrowText,
            !canGoNext && styles.dayArrowTextDisabled,
          ]}
        >
          ›
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  dayNavigator: {
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  dayArrowButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dayArrowText: {
    color: colors.white,
    fontSize: 34,
    lineHeight: 36,
    fontWeight: 'bold',
  },

  dayLabel: {
    color: colors.textDark,
    fontSize: 20,
    fontWeight: 'bold',
  },

  dayArrowButtonDisabled: {
    opacity: 0.4,
  },

  dayArrowTextDisabled: {
    opacity: 0.5,
  },

  dayLabelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});