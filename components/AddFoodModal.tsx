import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/styles';
import AnimatedModal from './AnimatedModal';

interface AddFoodModalProps {
  visible: boolean;
  foodName: string;
  amount: number;
  onAmountChange: (amount: number) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function AddFoodModal({
  visible,
  foodName,
  amount,
  onAmountChange,
  onClose,
  onSave,
}: AddFoodModalProps) {
  return (
    <AnimatedModal visible={visible}>
      <Text style={styles.title}>Add food</Text>

      <Text style={styles.foodName}>{foodName}</Text>

      <Text style={styles.amount}>{amount} g</Text>

      <Pressable
        style={styles.resetButton}
        onPress={() => onAmountChange(0)}
      >
        <Text style={styles.resetButtonText}>Reset</Text>
      </Pressable>

      <View style={styles.stepperGrid}>
        {[
          [-1, 1],
          [-10, 10],
          [-50, 50],
        ].map(([minus, plus]) => (
          <View key={minus} style={styles.stepperPair}>
            <Pressable
              style={styles.stepperButton}
              onPress={() =>
                onAmountChange(Math.max(0, amount + minus))
              }
            >
              <Text style={styles.stepperButtonText}>{minus}</Text>
            </Pressable>

            <Pressable
              style={styles.stepperButton}
              onPress={() => onAmountChange(amount + plus)}
            >
              <Text style={styles.stepperButtonText}>+{plus}</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.modalActions}>
        <Pressable style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>

        <Pressable style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>
    </AnimatedModal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
  },

  foodName: {
    marginTop: 18,
    fontSize: 18,
    color: colors.textDark,
    fontWeight: 'bold',
  },

  amount: {
    marginTop: 20,
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.textDark,
    textAlign: 'center',
  },

  resetButton: {
    marginTop: 12,
    backgroundColor: colors.input,
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },

  resetButtonText: {
    color: colors.textDark,
    fontWeight: 'bold',
    fontSize: 14,
  },

  stepperGrid: {
    marginTop: 18,
  },

  stepperPair: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  stepperButton: {
    width: '47%',
    backgroundColor: colors.input,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },

  stepperButtonText: {
    color: colors.textDark,
    fontWeight: 'bold',
    fontSize: 16,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: colors.input,
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },

  saveButton: {
    flex: 1,
    backgroundColor: colors.orange,
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },

  cancelButtonText: {
    color: colors.textDark,
    fontWeight: 'bold',
    fontSize: 16,
  },

  saveButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});