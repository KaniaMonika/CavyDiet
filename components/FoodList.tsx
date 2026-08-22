import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/styles';
import { MealItem } from '../types/meal';
import { Ionicons } from '@expo/vector-icons';

interface FoodListProps {
  items: MealItem[];

  onEdit: (item: MealItem) => void;

  onDelete: (
    itemId: number,
    foodName: string
  ) => void;
}

export default function FoodList({
  items,
  onEdit,
  onDelete,
}: FoodListProps) {
  return (
    <View style={styles.foodList}>
      {items.map((item) => (
        <View key={item.id} style={styles.foodRow}>
          <Text style={styles.foodName}>
            {item.name}
          </Text>

          <View style={styles.foodActions}>
            <Text style={styles.foodAmount}>
              {item.amount_g} g
            </Text>

            <Pressable
              style={styles.editFoodButton}
              onPress={() => onEdit(item)}
            >
              <Ionicons
                name="pencil-outline"
                size={15}
                color="#FFFFFF"
              />
            </Pressable>

            <Pressable
              style={styles.deleteFoodButton}
              onPress={() =>
                onDelete(item.id, item.name)
              }
            >
              <Ionicons
                name="trash-outline"
                size={15}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}


const styles = StyleSheet.create({
  foodList: {
    width: '100%',
    marginTop: 8,
  },

  foodRow: {
    backgroundColor: '#F6F8F6',
    borderRadius: 15,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#E4E9E5',
  },

  foodName: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },

  foodAmount: {
    color: colors.textDark,
    fontSize: 15,
    fontWeight: 'bold',
  },

  foodActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  editFoodButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },


  deleteFoodButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#D9534F',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

});