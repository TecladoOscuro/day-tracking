import Dexie, { type Table } from 'dexie';
import type { Profile, Meal, WeightEntry, Goals, Settings, FoodPreset } from '../types';

export class DayTrackingDB extends Dexie {
  meals!: Table<Meal, number>;
  weights!: Table<WeightEntry, number>;
  profile!: Table<Profile & { id: number }, number>;
  goals!: Table<Goals & { id: number }, number>;
  settings!: Table<Settings & { id: number }, number>;
  foodPresets!: Table<FoodPreset, number>;

  constructor() {
    super('daytracking');
    this.version(1).stores({
      meals: '++id, date, period',
      weights: '++id, date',
      profile: '++id',
      goals: '++id',
      settings: '++id',
      foodPresets: '++id, name',
    });
  }
}

export const db = new DayTrackingDB();
