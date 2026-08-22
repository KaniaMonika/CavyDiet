export interface MealItem {
  id: number;
  food_id: number;
  name: string;
  amount_g: number;
}

export interface MealSummary {
  vitaminC: number;
  calcium: number;
  phosphorus: number;
  calciumPhosphorusRatio: number;
  sugar: number;
  hasHighOxalates: boolean;
  allGoalsInRange: boolean;

  totalWeightG: number;
  totalWeightKg: number;
  vitaminCGoalMin: number;
  vitaminCGoalMax: number;
  calciumGoalMin: number;
  calciumGoalMax: number;
}