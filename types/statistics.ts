export interface Statistics {
  periodDays: number;
  mealsRecorded: number;

  averages: {
    vitaminC: number;
    calcium: number;
    calciumPhosphorusRatio: number;
  };

  highOxalateDays: number;

  recommendations: string[];
}