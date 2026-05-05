import { useState } from 'react';
import { useMeals } from '../hooks/useMeals';
import { useGoals } from '../hooks/useGoals';
import CalorieIndicator from '../components/CalorieIndicator';
import MealForm from '../components/MealForm';
import { getTodayStr, getPeriodLabel, getPeriodFromHour } from '../utils/dates';
import type { Period } from '../types';

export default function TodayPage() {
  const { addMeal, updateMeal, deleteMeal, getMealsByDate, getTotalByDate } =
    useMeals();
  const { goals } = useGoals();
  const [showForm, setShowForm] = useState(false);
  const [activePeriod, setActivePeriod] = useState<Period>('morning');
  const [editingMeal, setEditingMeal] = useState<{
    id: number;
    period: Period;
    description: string;
    calories: number;
  } | null>(null);

  const today = getTodayStr();
  const todayMeals = getMealsByDate(today);
  const total = getTotalByDate(today);

  const periods: Period[] = ['morning', 'midday', 'afternoon', 'night'];

  const handleSave = async (data: { period: Period; description: string; calories: number }) => {
    if (editingMeal) {
      await updateMeal(editingMeal.id, data);
      setEditingMeal(null);
    } else {
      await addMeal({ date: today, ...data });
    }
  };

  const handleEdit = (meal: { id: number; period: Period; description: string; calories: number }) => {
    setEditingMeal(meal);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!editingMeal) return;
    await deleteMeal(editingMeal.id);
    setEditingMeal(null);
    setShowForm(false);
  };

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Hoy</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
        <CalorieIndicator
          calories={total}
          target={goals.kcalTarget}
          orangePct={goals.orangePct}
          redPct={goals.redPct}
          size="md"
        />
      </div>

      {goals.kcalTarget > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-3 mb-4 shadow-sm text-sm text-gray-500 dark:text-gray-400">
          {total <= goals.kcalTarget ? (
            <span className="text-emerald-600 font-medium">
              ✅ Te quedan {goals.kcalTarget - total} kcal para el objetivo
            </span>
          ) : total <= Math.round(goals.kcalTarget * goals.orangePct / 100) ? (
            <span className="text-amber-600 font-medium">
              ⚠️ Has superado el objetivo por {total - goals.kcalTarget} kcal
            </span>
          ) : (
            <span className="text-red-600 font-medium">
              🔴 Exceso de {total - goals.kcalTarget} kcal sobre el objetivo
            </span>
          )}
        </div>
      )}

      <div className="space-y-3 mb-20">
        {periods.map((period) => {
          const periodMeals = todayMeals.filter((m) => m.period === period);
          const periodTotal = periodMeals.reduce((s, m) => s + m.calories, 0);

          return (
            <div key={period} className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                  {getPeriodLabel(period)}
                </h3>
                <span className="text-sm font-medium text-indigo-600">
                  {periodTotal} kcal
                </span>
              </div>
                {periodMeals.length === 0 ? (
                <p className="text-xs text-gray-300 dark:text-gray-700 py-2">Sin comidas registradas</p>
              ) : (
                periodMeals.map((meal) => (
                  <div
                    key={meal.id}
                    onClick={() =>
                      handleEdit({
                        id: meal.id!,
                        period: meal.period as Period,
                        description: meal.description,
                        calories: meal.calories,
                      })
                    }
                    className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 -mx-2 px-2 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 dark:text-gray-200 truncate">
                        {meal.description}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 ml-2 shrink-0">
                      {meal.calories} kcal
                    </span>
                  </div>
                ))
              )}
              <button
                onClick={() => {
                  setEditingMeal(null);
                  setActivePeriod(period);
                  setShowForm(true);
                }}
                className="mt-2 text-xs text-indigo-500 font-medium hover:text-indigo-700"
              >
                + Añadir
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => {
          setEditingMeal(null);
          setActivePeriod(getPeriodFromHour(new Date().getHours()) as Period);
          setShowForm(true);
        }}
        className="fixed right-4 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg text-2xl flex items-center justify-center hover:bg-indigo-700 active:scale-95 transition-transform z-30"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 76px)' }}
      >
        +
      </button>

      {showForm && (
        <MealForm
          initialPeriod={editingMeal?.period || activePeriod}
          initialDescription={editingMeal?.description || ''}
          initialCalories={editingMeal?.calories ?? 0}
          onSave={handleSave}
          onDelete={editingMeal ? handleDelete : undefined}
          onClose={() => {
            setShowForm(false);
            setEditingMeal(null);
          }}
        />
      )}
    </div>
  );
}
