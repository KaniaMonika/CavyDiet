import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { colors } from '../constants/styles';
import { useAuthStore } from '../store/authStore';
import { router, useFocusEffect } from 'expo-router';
import { useHerdStore } from '../store/herdStore';
import { API_URL } from '../constants/api';
import EditMealAmountModal from '../components/EditMealAmountModal';
import DayNavigator from '../components/DayNavigator';
import { MealItem, MealSummary } from '../types/meal';
import NutritionSummary from '../components/NutritionSummary';
import FoodList from '../components/FoodList';
import {
  formatDateForApi,
  formatDateLabel,
  isToday,
} from '../utils/date';
import CalendarModal from '../components/CalendarModal';
import RecommendationsCard from '../components/RecommendationsCard';

type RecommendedFood = {
  id: number;
  name: string;
  amountG: number;
};

type Recommendation = {
  title: string;
  foods: RecommendedFood[];
  allGoalsInRange: boolean;
  score: number;
};

export default function FeedingScreen() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const currentHerdId = useHerdStore((state) => state.currentHerdId);
  const currentHerdNumber = useHerdStore(
    (state) => state.currentHerdNumber
  );
  const [mealItems, setMealItems] = useState<MealItem[]>([]);
  const [mealSummary, setMealSummary] = useState<MealSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedFoodName, setEditedFoodName] = useState('');
  const [editedAmount, setEditedAmount] = useState(0);
  const [editedMealItemId, setEditedMealItemId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [recommendations, setRecommendations] =
  useState<Recommendation[]>([]);

  const selectedDateForApi = formatDateForApi(selectedDate);

  const logout = useAuthStore((state) => state.logout);
  const resetHerd = useHerdStore((state) => state.resetHerd);

  const handleUnauthorized = () => {
    logout();
    resetHerd();
    router.replace('/');
  };

  const canGoToNextDay = () => {
    return !isToday(selectedDate);
  };

  const goToPreviousDay = () => {
    const previousDay = new Date(selectedDate);

    previousDay.setDate(previousDay.getDate() - 1);

    setSelectedDate(previousDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);

    nextDay.setDate(nextDay.getDate() + 1);

    const today = new Date();

    today.setHours(0, 0, 0, 0);
    nextDay.setHours(0, 0, 0, 0);

    if (nextDay > today) {
      return;
    }

    setSelectedDate(nextDay);
  };

  const handleCalendarSelect = (dateString: string) => {
    setSelectedDate(new Date(dateString));
    setIsCalendarVisible(false);
  };

  const fetchMealForSelectedDate = async () => {
    if (!token || !currentHerdId) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/meals/day?herdId=${currentHerdId}&date=${selectedDateForApi}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        setErrorMessage(data.message || 'Failed to fetch meal');
        return;
      }

      if (!data.items || !Array.isArray(data.items)) {
        setErrorMessage('Invalid meal response');
        return;
      }

      setMealItems(data.items);
      setMealSummary(data.summary);
    } catch (error) {
      setErrorMessage('Cannot connect to server');
    }
  };

  const fetchRecommendations = async () => {
  if (!token || !currentHerdId) {
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/meals/recommendations?herdId=${currentHerdId}&date=${selectedDateForApi}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    if (!response.ok) {
      setRecommendations([]);
      return;
    }

    if (!Array.isArray(data.recommendations)) {
      setRecommendations([]);
      return;
    }

    setRecommendations(data.recommendations);
  } catch (error) {
    console.log('Recommendations error:', error);
    setRecommendations([]);
  }
};

  const handleAddRecommendation = async (
  recommendation: Recommendation
) => {
  if (!token || !currentHerdId) {
    alert('Authentication or herd selection failed');
    return;
  }

  if (recommendation.foods.length === 0) {
    alert('This recommendation has no foods');
    return;
  }

  try {
    for (const food of recommendation.foods) {
      const response = await fetch(`${API_URL}/meals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          herdId: currentHerdId,
          foodId: food.id,
          amountG: food.amountG,
          date: selectedDateForApi,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to add ${food.name}`
        );
      }
    }

    await Promise.all([
      fetchMealForSelectedDate(),
      fetchRecommendations(),
    ]);

    Alert.alert(
      'Mix added',
      'The recommended foods were added to the meal.'
    );
  } catch (error) {
    Alert.alert(
      'Could not add mix',
      error instanceof Error
        ? error.message
        : 'Something went wrong'
    );
  }
};

  const openEditMealItemModal = (item: MealItem) => {
    setEditedMealItemId(item.id);
    setEditedFoodName(item.name);
    setEditedAmount(item.amount_g);
    setIsEditModalVisible(true);
  };

  const handleDeleteMealItem = (itemId: number, foodName: string) => {
  Alert.alert(
    'Remove food',
    `Remove ${foodName} from today's meal?`,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => deleteMealItem(itemId),
      },
    ]
  );
};

const deleteMealItem = async (itemId: number) => {
  if (!token) {
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/meals/item/${itemId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Failed to delete food');
      return;
    }

    fetchMealForSelectedDate();
  } catch (error) {
    alert('Cannot connect to server');
  }
};

const updateMealItemAmount = async () => {
  if (!token || !editedMealItemId) {
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/meals/item/${editedMealItemId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amountG: editedAmount,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Failed to update food amount');
      return;
    }

    setIsEditModalVisible(false);
    setEditedMealItemId(null);
    fetchMealForSelectedDate();
  } catch (error) {
    alert('Cannot connect to server');
  }
};


 useFocusEffect(
  useCallback(() => {
    fetchMealForSelectedDate();
    fetchRecommendations();
  }, [token, currentHerdId, selectedDateForApi])
);


  return (
     <ScrollView contentContainerStyle={styles.scrollContainer}>
      
      <DayNavigator
        label={formatDateLabel(selectedDate)}
        canGoNext={canGoToNextDay()}
        onPrevious={goToPreviousDay}
        onNext={goToNextDay}
        onOpenCalendar={() => setIsCalendarVisible(true)}
      />

      <View style={styles.cardHeader}>
  <View style={styles.headerText}>
    <Text style={styles.pageTitle}>Today's Feeding</Text>

    <Text style={styles.herdText}>
      Current herd: #{currentHerdNumber || '?'}
    </Text>
  </View>

  <Pressable
    style={styles.openFoodsButton}
    onPress={() =>
      router.push({
        pathname: '/foods',
        params: {
          date: selectedDateForApi,
        },
      })
    }
  >
    <Text style={styles.openFoodsButtonText}>Add Food</Text>
  </Pressable>
</View>
        
        {errorMessage ? (
          <Text style={styles.cardText}>{errorMessage}</Text>
        ) : mealItems.length === 0 ? (
          <Text style={styles.cardText}>No food added for today.</Text>
        ) : (
          <FoodList
            items={mealItems}
            onEdit={openEditMealItemModal}
            onDelete={handleDeleteMealItem}
          />
        )}

        {mealSummary?.allGoalsInRange ? (
          <View style={styles.balancedCard}>
            <Text style={styles.balancedTitle}>
              Great job! 🎉
            </Text>

            <Text style={styles.balancedText}>
              Today&apos;s meal is well balanced. Vitamin C, calcium and Ca:P
              are all within the target ranges.
            </Text>

            <Text style={styles.balancedHighlight}>
              Your piggies are in good hands.
            </Text>
          </View>
        ) : (
          <RecommendationsCard
            recommendations={recommendations}
            onAddMix={handleAddRecommendation}
          />
        )}

        {mealSummary && (
          <NutritionSummary summary={mealSummary} />
        )}

        <EditMealAmountModal
          visible={isEditModalVisible}
          foodName={editedFoodName}
          amount={editedAmount}
          onAmountChange={setEditedAmount}
          onClose={() => setIsEditModalVisible(false)}
          onSave={updateMealItemAmount}
        />
        <CalendarModal
          visible={isCalendarVisible}
          selectedDate={selectedDateForApi}
          maxDate={formatDateForApi(new Date())}
          onSelectDate={handleCalendarSelect}
          onClose={() => setIsCalendarVisible(false)}
        />
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingVertical: 10,
  },

  headerText: {
    flex: 1,
    marginRight: 12,
    marginLeft: 12,
  },

  cardText: {
    color: colors.white,
    marginTop: 12,
    fontSize: 15,
  },

  pageTitle: {
    color: colors.textDark,
    fontSize: 24,
    fontWeight: 'bold',
    flexShrink: 0,
    marginRight: 12,
  },

  herdText: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },

  cardHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginBottom: 20,
  },

  openFoodsButton: {
    width: 90,
    borderRadius: 16,
    backgroundColor: colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  openFoodsButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },

  balancedCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#CFE8D1',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  balancedTitle: {
    color: '#2F7D32',
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  balancedText: {
    color: colors.textDark,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.78,
  },

  balancedHighlight: {
    color: '#2F7D32',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 12,
  },

});