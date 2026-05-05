import { useState } from 'react';
import { useMeals } from '../hooks/useMeals';
import { useGoals } from '../hooks/useGoals';
import { useSettings } from '../hooks/useSettings';
import WeekGrid from '../components/WeekGrid';
import MealForm from '../components/MealForm';
import {
  getWeekDays,
  getWeekLabel,
  addWeeks,
} from '../utils/dates';
import type { Period, Meal } from '../types';

export default function WeekPage() {
  const { addMeal, getMealsByDate } = useMeals();
  const { goals } = useGoals();
  const { settings } = useSettings();
  const [weekOffset, setWeekOffset] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('morning');
  const [selectedMeals, setSelectedMeals] = useState<Meal[]>([]);

  const today = new Date();
  const baseDate = addWeeks(today, weekOffset);
  const days = getWeekDays(baseDate, settings.weekStartsOn);
  const weekLabel = getWeekLabel(days);
  const isCurrentWeek = weekOffset === 0;
  const monthYear = days[3].toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  const handleCellTap = (dateStr: string, period: Period) => {
    const meals = getMealsByDate(dateStr).filter((m) => m.period === period);
    setSelectedDate(dateStr);
    setSelectedPeriod(period);
    if (meals.length > 0) {
      setSelectedMeals(meals);
      setShowDetail(true);
    } else {
      setShowForm(true);
    }
  };

  const handleSave = async (data: { period: Period; description: string; calories: number }) => {
    await addMeal({ date: selectedDate, ...data });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 pt-6 pb-2 shrink-0 bg-gray-50 dark:bg-gray-950">
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="w-9 h-9 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-lg font-medium active:scale-90 transition-transform"
          >
            ‹
          </button>

          <div className="text-center">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              {monthYear}
            </p>
            <p className="text-sm font-bold text-gray-800 dark:text-white">
              {weekLabel}
            </p>
            {isCurrentWeek && (
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-full font-medium">
                Esta semana
              </span>
            )}
          </div>

          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="w-9 h-9 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-lg font-medium active:scale-90 transition-transform"
          >
            ›
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24 overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="pt-3">
          <WeekGrid
            days={days}
            getMealsByDate={getMealsByDate}
            goals={goals}
            onCellTap={handleCellTap}
          />
        </div>
      </div>

      {showForm && (
        <MealForm
          initialPeriod={selectedPeriod}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}

      {showDetail && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[70vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white dark:bg-gray-900 rounded-t-2xl px-5 pt-4 pb-2 border-b dark:border-gray-800 flex items-center justify-between">
              <h3 className="font-bold text-lg dark:text-white">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })} · {selectedPeriod}
              </h3>
              <button onClick={() => setShowDetail(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none">×</button>
            </div>
            <div className="p-5 space-y-2">
              {selectedMeals.map((meal) => (
                <div key={meal.id} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <span className="text-sm text-gray-700 dark:text-gray-200">{meal.description}</span>
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{meal.calories} kcal</span>
                </div>
              ))}
              <button
                onClick={() => { setShowDetail(false); setShowForm(true); }}
                className="w-full py-2 mt-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 active:scale-[0.98] transition-all"
              >
                + Añadir a este período
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
