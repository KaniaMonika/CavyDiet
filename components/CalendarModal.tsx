import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { colors } from '../constants/styles';
import AnimatedModal from './AnimatedModal';

interface CalendarModalProps {
  visible: boolean;
  selectedDate: string;
  maxDate: string;
  onSelectDate: (date: string) => void;
  onClose: () => void;
}

export default function CalendarModal({
  visible,
  selectedDate,
  maxDate,
  onSelectDate,
  onClose,
}: CalendarModalProps) {
  const handleDayPress = (day: DateData) => {
    onSelectDate(day.dateString);
  };

  return (
    <AnimatedModal visible={visible}>
      <Text style={styles.title}>Select date</Text>

      <View style={styles.calendarWrapper}>
        <Calendar
          current={selectedDate}
          maxDate={maxDate}
          onDayPress={handleDayPress}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: colors.orange,
            },
          }}
          theme={{
            backgroundColor: colors.white,
            calendarBackground: colors.white,
            textSectionTitleColor: colors.textDark,
            selectedDayBackgroundColor: colors.orange,
            selectedDayTextColor: colors.white,
            todayTextColor: colors.orange,
            dayTextColor: colors.textDark,
            textDisabledColor: '#B8B8B8',
            monthTextColor: colors.textDark,
            arrowColor: colors.orange,
          }}
        />
      </View>

      <Pressable style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </Pressable>
    </AnimatedModal>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.textDark,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  calendarWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
  },

  closeButton: {
    marginTop: 18,
    backgroundColor: colors.input,
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },

  closeButtonText: {
    color: colors.textDark,
    fontWeight: 'bold',
    fontSize: 16,
  },
});