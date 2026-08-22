import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { API_URL } from '../constants/api';
import AddFoodModal from '../components/AddFoodModal';
import { useAuthStore } from '../store/authStore';
import { useHerdStore } from '../store/herdStore';
import { formatDateForApi } from '../utils/date';
import { colors, commonStyles } from '../constants/styles';
import { Ionicons } from '@expo/vector-icons';

interface Food {
  id: number;
  name: string;
  vitc: string;
  calcium: string;
  phosphorus: string;
  sugar: string | null;
  high_oxalates: number;
}

export default function FoodsScreen() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);
  const [selectedFoodName, setSelectedFoodName] = useState('');
  const [amountG, setAmountG] = useState(0);
  const token = useAuthStore((state) => state.token);
  const currentHerdId = useHerdStore((state) => state.currentHerdId);
  const { date } = useLocalSearchParams<{ date?: string }>();

  const selectedDate =
    typeof date === 'string'
      ? date
      : formatDateForApi(new Date());

  const handleSaveFood = async () => {
  if (!token) {
    alert('Authentication failed');
    return;
  }

  if (!currentHerdId) {
    alert('Please select a herd first');
    return;
  }

  if (!selectedFoodId) {
    alert('Food was not found');
    return;
  }

  if (!Number.isInteger(amountG) || amountG < 1) {
    alert('Amount must be a whole number greater than 0');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/meals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        herdId: currentHerdId,
        foodId: selectedFoodId,
        amountG,
        date: selectedDate,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Failed to add food');
      return;
    }

    setIsAddModalVisible(false);
    setSelectedFoodId(null);
    setSelectedFoodName('');
    setAmountG(0);

    router.back();
  } catch (error) {
    alert('Cannot connect to server');
  }
};

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(`${API_URL}/foods`);
        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(data.message || 'Failed to fetch foods');
          return;
        }

        if (!Array.isArray(data)) {
          setErrorMessage('Invalid foods response');
          return;
        }

        setFoods(data);
      } catch (error) {
        setErrorMessage('Cannot connect to server');
      }
    };

    fetchFoods();
  }, []);

  const filteredFoods = foods.filter((food) =>
      food.name.toLowerCase().includes(searchText.trim().toLowerCase())
    );
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.pageTitle}>Choose food</Text>
      <Text style={styles.pageSubtitle}>
        Nutrition values per 100 g
      </Text>
      <View style={[styles.inputContainer, styles.searchInputContainer]}>
      <Ionicons
        name="search-outline"
        size={20}
        color="#8A948D"
      />

      <TextInput
        style={styles.input}
        placeholder="Search food..."
        placeholderTextColor="#A4ACA6"
        value={searchText}
        onChangeText={setSearchText}
        autoCapitalize="none"
      />
    </View>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : (
        filteredFoods.map((food) => (
          <Pressable
            key={food.id}
            style={styles.foodCard}
            onPress={() => {
              setSelectedFoodId(food.id);
              setSelectedFoodName(food.name);
              setAmountG(0);
              setIsAddModalVisible(true);
            }}
          >
            <Text style={styles.foodName}>{food.name}</Text>

            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionText}>
                Vit C: {food.vitc} mg
              </Text>

              <Text style={styles.nutritionText}>
                Calcium: {food.calcium} mg
              </Text>
            </View>

            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionText}>
                Phosphorus: {food.phosphorus} mg
              </Text>

              <Text style={styles.nutritionText}>
                Sugar: {food.sugar ?? '-'} g
              </Text>
            </View>

            {food.high_oxalates === 1 && (
              <Text style={styles.warningText}>
                ⚠ High oxalates
              </Text>
            )}
          </Pressable>
        ))
      )}
      <AddFoodModal
        visible={isAddModalVisible}
        foodName={selectedFoodName}
        amount={amountG}
        onAmountChange={setAmountG}
        onClose={() => setIsAddModalVisible(false)}
        onSave={handleSaveFood}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 20,
  },

  pageTitle: {
    width: '100%',
    color: colors.textDark,
    fontSize: 24,
    fontWeight: 'bold',
    paddingLeft: 12,
    marginBottom: 6,
  },

  pageSubtitle: {
    width: '100%',
    color: colors.textDark,
    fontSize: 16,
    paddingLeft: 12,
    marginBottom: 14,
  },


  foodCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,

    elevation: 3,
  },

  foodName: {
    color: colors.textDark,
    fontSize: 18,
    fontWeight: 'bold',
  },

  warningText: {
    color: colors.white,
    fontSize: 13,
    marginTop: 6,
    fontWeight: 'bold',
  },

  errorText: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: 'bold',
  },

  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  nutritionText: {
    color: colors.textDark,
    fontSize: 13,
  },

  inputContainer: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F8F6',
    borderWidth: 1,
    borderColor: '#E4E9E5',
    borderRadius: 15,
    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
    marginLeft: 11,
    fontSize: 15,
    color: '#29352D',
  },

  searchInputContainer: {
    width: '100%',
    marginBottom: 18,
  },
});