import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/styles';
import { MealSummary as MealSummaryType } from '../types/meal';

interface NutritionSummaryProps {
  summary: MealSummaryType;
}

const lightGreen = '#A8D97A';
const green = '#7AC943';
const yellow = '#F5C542';
const red = '#D9534F';

const getRangeColor = (value: number, min: number, max: number) => {
  if (value < min) return red;
  if (value <= max) return green;
  if (value <= max * 1.2) return yellow;
  return red;
};

const getRatioColor = (ratio: number) => {
  if (ratio >= 1.3 && ratio <= 1.6) return green;
  return yellow;
};

export default function NutritionSummary({
  summary,
}: NutritionSummaryProps) {
  return (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>
      Nutrition Summary
    </Text>  
  <View style={styles.nutritionCard}>

    <View style={styles.nutritionRow}>
      <View style={styles.nutritionItem}>
        <Text style={styles.nutritionLabel}>Vit C</Text>

        <View
          style={[
            styles.circle,
            {
              borderColor: getRangeColor(
                summary.vitaminC,
                summary.vitaminCGoalMin,
                summary.vitaminCGoalMax
              ),
            },
          ]}
        >
          <Text style={styles.circleText}>
            {summary.vitaminC}
          </Text>

          <Text style={styles.circleUnit}>
            mg
          </Text>
        </View>

        
        <Text style={styles.nutritionTarget}>
          Target: {summary.vitaminCGoalMin}-{summary.vitaminCGoalMax} mg
        </Text>
      </View>

      <View style={styles.nutritionItem}>
        <Text style={styles.nutritionLabel}>Calcium</Text>

        <View
          style={[
            styles.circle,
            {
              borderColor: getRangeColor(
                summary.calcium,
                summary.calciumGoalMin,
                summary.calciumGoalMax
              ),
            },
          ]}
        >
          <Text style={styles.circleText}>
            {summary.calcium}
          </Text>

          <Text style={styles.circleUnit}>
            mg
          </Text>
        </View>

        <Text style={styles.nutritionTarget}>
          Target: {summary.calciumGoalMin}-{summary.calciumGoalMax} mg
        </Text>
      </View>

      <View style={styles.nutritionItem}>
        <Text style={styles.nutritionLabel}>Ca:P</Text>

        <View
          style={[
            styles.circle,
            {
              borderColor: getRatioColor(
                summary.calciumPhosphorusRatio
              ),
            },
          ]}
        >
          <Text style={styles.circleText}>
            {summary.calciumPhosphorusRatio} : 1
          </Text>

          <Text style={styles.circleUnit}>
            Ratio
          </Text>
        </View>

        <Text style={styles.nutritionTarget}>
          Target: 1.3-1.6
        </Text>
      </View>
    </View>

    <View style={styles.extraSummaryBox}>
      <View style={styles.extraSummaryRow}>
        <Text style={styles.extraSummaryLabel}>Sugar</Text>
        <Text style={styles.extraSummaryValue}>
          {summary.sugar} g
        </Text>
      </View>

      <View style={styles.extraSummaryRow}>
        <Text style={styles.extraSummaryLabel}>High Oxalates</Text>
        <Text
          style={[
            styles.extraSummaryValue,
            summary.hasHighOxalates && styles.warningValue,
          ]}
        >
          {summary.hasHighOxalates ? 'Yes' : 'No'}
        </Text>
      </View>
    </View>
  </View>
  </View>
)}
    


const styles = StyleSheet.create({
  sectionTitle: {
    color: colors.textDark,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
    marginBottom: 12,
  },

  nutritionCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 18,
  },

  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  nutritionItem: {
    flex: 1,
    alignItems: 'center',
  },

  nutritionLabel: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  circle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },

  circleText: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  circleUnit: {
    color: colors.textDark,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  nutritionTarget: {
    color: colors.textDark,
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },


  extraSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

 extraSummaryBox: {
  backgroundColor: '#F6F8F6',
  borderWidth: 1,
  borderColor: '#E4E9E5',
  borderRadius: 15,
  padding: 14,
  marginTop: 20,
},

extraSummaryLabel: {
  color: '#4E5B53',
  fontSize: 16,
  fontWeight: '600',
},

extraSummaryValue: {
  color: '#2F7D32',
  fontSize: 16,
  fontWeight: '700',
},

warningValue: {
  color: '#D9534F',
},

  section: {
    width: '100%',
    marginBottom: 24,
  },
});





