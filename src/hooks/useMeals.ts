import { useEffect, useState, useCallback } from 'react';
import { db } from '../db/database';
import type { Meal } from '../types';

export function useMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const all = await db.meals.toArray();
    setMeals(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addMeal = async (m: Omit<Meal, 'id'>) => {
    await db.meals.add(m);
    await load();
  };

  const updateMeal = async (id: number, m: Partial<Meal>) => {
    await db.meals.update(id, m);
    await load();
  };

  const deleteMeal = async (id: number) => {
    await db.meals.delete(id);
    await load();
  };

  const getMealsByDate = useCallback(
    (date: string): Meal[] => meals.filter((m) => m.date === date),
    [meals]
  );

  const getMealsByDatePeriod = useCallback(
    (date: string, period: string): Meal[] =>
      meals.filter((m) => m.date === date && m.period === period),
    [meals]
  );

  const getTotalByDate = useCallback(
    (date: string): number =>
      meals
        .filter((m) => m.date === date)
        .reduce((sum, m) => sum + m.calories, 0),
    [meals]
  );

  const getTotalByDatePeriod = useCallback(
    (date: string, period: string): number =>
      meals
        .filter((m) => m.date === date && m.period === period)
        .reduce((sum, m) => sum + m.calories, 0),
    [meals]
  );

  return {
    meals,
    loading,
    addMeal,
    updateMeal,
    deleteMeal,
    getMealsByDate,
    getMealsByDatePeriod,
    getTotalByDate,
    getTotalByDatePeriod,
    refresh: load,
  };
}
