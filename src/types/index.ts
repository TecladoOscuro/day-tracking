export type Period = 'morning' | 'midday' | 'afternoon' | 'night';

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active';

export type Sex = 'male' | 'female';

export type WeekStart = 'monday' | 'sunday';

export interface Profile {
  height: number;
  currentWeight: number;
  age: number;
  sex: Sex;
  activityLevel: ActivityLevel;
}

export interface Meal {
  id?: number;
  date: string;
  period: Period;
  description: string;
  calories: number;
}

export interface WeightEntry {
  id?: number;
  date: string;
  weight: number;
  photo?: string;
  note?: string;
}

export interface Goals {
  kcalTarget: number;
  weightTarget: number;
  orangePct: number;
  redPct: number;
}

export interface Settings {
  weekStartsOn: WeekStart;
}

export interface FoodPreset {
  id?: number;
  name: string;
  calories: number;
}

export interface ExportData {
  version: number;
  exportDate: string;
  data: {
    profile: Profile;
    goals: Goals;
    settings: Settings;
    meals: Meal[];
    weights: WeightEntry[];
    foodPresets: FoodPreset[];
  };
}

export interface EndocrineResults {
  bmr: number;
  tdee: number;
  imc: number;
  imcLabel: string;
  idealMinWeight: number;
  idealMaxWeight: number;
  hamwiIdeal: number;
  deficitModerate: number;
  deficitAggressive: number;
  minSafe: number;
  estimatedLoss: number;
}
