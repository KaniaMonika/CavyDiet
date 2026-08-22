import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../constants/styles';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth - 36;
const horizontalMargin = 24;


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

interface RecommendationsCardProps {
  recommendations: Recommendation[];
  onAddMix: (recommendation: Recommendation) => void;
}

export default function RecommendationsCard({
  recommendations,
  onAddMix,
}: RecommendationsCardProps) {

  const [activeIndex, setActiveIndex] = useState(0);
  const handleScrollEnd = (
  event: NativeSyntheticEvent<NativeScrollEvent>
) => {
  const nextIndex = Math.round(
    event.nativeEvent.contentOffset.x / cardWidth
  );

  setActiveIndex(nextIndex);
};
  return (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>
      Recommended Foods
    </Text>

    {recommendations.length === 0 ? (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>
          No recommendations available.
        </Text>
      </View>
    ) : (
      <>
        <FlatList
          data={recommendations}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
          keyExtractor={(item, index) =>
            `${item.title}-${index}`
          }
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.recommendationTitle}>
                    {item.title}
                  </Text>

                  {item.allGoalsInRange && (
                    <View style={styles.balanceBadge}>
                      <Text style={styles.balanceBadgeText}>
                        Balanced
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.foodsList}>
                  {item.foods.map((food, index) => (
                    <View
                      key={food.id}
                      style={[
                        styles.foodRow,
                        index < item.foods.length - 1 && styles.foodRowDivider,
                      ]}
                    >
                      <Text
                        style={styles.foodName}
                        numberOfLines={1}
                      >
                        {food.name}
                      </Text>

                      <Text style={styles.foodAmount}>
                        {food.amountG} g
                      </Text>
                    </View>
                  ))}
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => onAddMix(item)}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    color="#FFFFFF"
                  />

                  <Text style={styles.buttonText}>
                    Add this mix
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        />

        <View style={styles.pagination}>
          {recommendations.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>
      </>
    )}
  </View>
);
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
    marginBottom: 24,
  },

  sectionTitle: {
    color: colors.textDark,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
    marginBottom: 12,
  },


  

  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
  },

  emptyText: {
    color: colors.textDark,
    fontSize: 15,
    fontStyle: 'italic',
    opacity: 0.7,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  recommendationTitle: {
    color: colors.textDark,
    fontSize: 17,
    fontWeight: 'bold',
  },

  balanceBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  balanceBadgeText: {
    color: '#2F7D32',
    fontSize: 12,
    fontWeight: 'bold',
  },

  foodsList: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ECEEEF',
    paddingVertical: 8,
  },

  foodRow: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  foodName: {
    flex: 1,
    color: colors.textDark,
    fontSize: 15,
    fontWeight: '600',
    marginRight: 12,
  },

  foodAmount: {
    color: colors.orange,
    fontSize: 15,
    fontWeight: 'bold',
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

  slide: {
    width: screenWidth,
    alignItems: 'center',
},

card: {
  width: cardWidth,
  backgroundColor: colors.white,
  borderRadius: 14,
  paddingHorizontal: 18,
  paddingTop: 18,
  paddingBottom: 16,

  borderWidth: 1,
  borderColor: '#E2E5E6',

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.04,
  shadowRadius: 3,
  elevation: 1,
},

pagination: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 12,
  gap: 7,
},

dot: {
  width: 7,
  height: 7,
  borderRadius: 4,
  backgroundColor: '#C9CED0',
},

activeDot: {
  backgroundColor: colors.orange,
},


foodRowDivider: {
  borderBottomWidth: 1,
  borderBottomColor: '#ECEEEF',
},
});