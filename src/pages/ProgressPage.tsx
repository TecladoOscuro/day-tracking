import { useState, useMemo } from 'react';
import { useMeals } from '../hooks/useMeals';
import { useWeights } from '../hooks/useWeights';
import { useGoals } from '../hooks/useGoals';
import CalorieChart from '../components/CalorieChart';
import WeightChart from '../components/WeightChart';
import StreakBadge from '../components/StreakBadge';
import { getLastNDays, formatDate, formatMonthYear } from '../utils/dates';
import { exportAllData, downloadJSON } from '../utils/exportImport';

export default function ProgressPage() {
  const { meals, getTotalByDate } = useMeals();
  const { weights } = useWeights();
  const { goals } = useGoals();
  const [range, setRange] = useState<30 | 90 | 365>(30);
  const [tab, setTab] = useState<'kcal' | 'weight'>('kcal');

  const calData = useMemo(() => {
    const days = getLastNDays(range);
    return days.map((d) => ({
      date: formatDate(d),
      calories: getTotalByDate(formatDate(d)),
    }));
  }, [range, meals, getTotalByDate]);

  const streak = useMemo(() => {
    let count = 0;
    const today = new Date();
    for (let i = 1; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const total = getTotalByDate(formatDate(d));
      if (total > 0 && total <= goals.kcalTarget) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [meals, goals.kcalTarget, getTotalByDate]);

  const monthlySummary = useMemo(() => {
    const map = new Map<string, { total: number; days: number; inGoal: number }>();
    meals.forEach((m) => {
      const month = m.date.substring(0, 7);
      if (!map.has(month)) {
        map.set(month, { total: 0, days: 0, inGoal: 0 });
      }
      const entry = map.get(month)!;
      entry.total += m.calories;
    });
    const daySet = new Map<string, Set<string>>();
    meals.forEach((m) => {
      const month = m.date.substring(0, 7);
      if (!daySet.has(month)) daySet.set(month, new Set());
      daySet.get(month)!.add(m.date);
    });
    daySet.forEach((days, month) => {
      const entry = map.get(month)!;
      entry.days = days.size;
      days.forEach((date) => {
        const total = getTotalByDate(date);
        if (total > 0 && total <= goals.kcalTarget) entry.inGoal++;
      });
    });
    return Array.from(map.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([month, data]) => ({ month, ...data }));
  }, [meals, goals.kcalTarget]);

  const handleExport = async () => {
    const data = await exportAllData();
    downloadJSON(data, `daytracking-${new Date().toISOString().split('T')[0]}.json`);
  };

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Progreso</h1>

      {streak > 0 && (
        <div className="mb-4">
          <StreakBadge streak={streak} />
        </div>
      )}

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-3">
        {(['kcal', 'weight'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
              tab === t ? 'bg-white dark:bg-gray-700 shadow text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {t === 'kcal' ? '🍽️ Calorías' : '⚖️ Peso'}
          </button>
        ))}
      </div>

      {tab === 'kcal' && (
        <>
          <div className="flex gap-1 mb-3">
            {([30, 90, 365] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  range === r
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {r} días
              </button>
            ))}
          </div>
          <CalorieChart
            data={calData}
            target={goals.kcalTarget}
            orangePct={goals.orangePct}
          />
        </>
      )}

      {tab === 'weight' && (
        <WeightChart weights={weights} target={goals.weightTarget} />
      )}

      <div className="mt-4 mb-20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Resumen mensual</h3>
          <button
            onClick={handleExport}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            📤 Exportar
          </button>
        </div>
        <div className="space-y-2">
          {monthlySummary.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-gray-500">Sin datos aún</p>
          ) : (
            monthlySummary.map((m) => (
              <div
                key={m.month}
                className="bg-white dark:bg-gray-900 rounded-xl p-3 shadow-sm flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {formatMonthYear(new Date(m.month + '-01'))}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {m.days} días · Media {m.days > 0 ? Math.round(m.total / m.days) : 0} kcal/día
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-800 dark:text-white">
                    {m.total} kcal
                  </span>
                  {m.days > 0 && (
                    <p className="text-xs text-emerald-600">
                      {m.inGoal}/{m.days} días en objetivo
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
