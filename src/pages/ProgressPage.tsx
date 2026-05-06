import { useState, useMemo } from 'react';
import { useMeals } from '../hooks/useMeals';
import { useWeights } from '../hooks/useWeights';
import { useGoals } from '../hooks/useGoals';
import CalorieChart from '../components/CalorieChart';
import WeightChart from '../components/WeightChart';
import StreakBadge from '../components/StreakBadge';
import { getLastNDays, formatDate, formatMonthYear } from '../utils/dates';
import { exportAllData, downloadJSON } from '../utils/exportImport';

type Range = 30 | 90 | 365;

export default function ProgressPage() {
  const { meals, getTotalByDate } = useMeals();
  const { weights } = useWeights();
  const { goals } = useGoals();
  const [range, setRange] = useState<Range>(30);
  const [tab, setTab] = useState<'kcal' | 'weight'>('kcal');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

  const dataYears = useMemo(() => {
    const years = new Set<number>();
    meals.forEach((m) => {
      const y = parseInt(m.date.substring(0, 4));
      if (!isNaN(y)) years.add(y);
    });
    weights.forEach((w) => {
      const y = parseInt(w.date.substring(0, 4));
      if (!isNaN(y)) years.add(y);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [meals, weights]);

  const yearMonthlyData = useMemo(() => {
    if (selectedYear === 'all') return null;
    const months: { month: string; total: number; days: number; inGoal: number }[] = [];
    for (let m = 0; m < 12; m++) {
      const prefix = `${selectedYear}-${String(m + 1).padStart(2, '0')}`;
      let total = 0;
      const daysSet = new Set<string>();
      let inGoal = 0;
      meals.forEach((meal) => {
        if (meal.date.startsWith(prefix)) {
          total += meal.calories;
          daysSet.add(meal.date);
        }
      });
      daysSet.forEach((date) => {
        const t = getTotalByDate(date);
        if (t > 0 && t <= goals.kcalTarget) inGoal++;
      });
      if (daysSet.size > 0) {
        months.push({
          month: prefix,
          total,
          days: daysSet.size,
          inGoal,
        });
      }
    }
    return months;
  }, [selectedYear, meals, goals.kcalTarget, getTotalByDate]);

  const calData = useMemo(() => {
    if (selectedYear === 'all') {
      const days = getLastNDays(range);
      return days.map((d) => ({
        date: formatDate(d),
        calories: getTotalByDate(formatDate(d)),
      }));
    }
    return yearMonthlyData?.filter((m) => m.days > 0).map((m) => ({
      date: m.month,
      calories: m.total,
    })) || [];
  }, [range, selectedYear, meals, getTotalByDate, yearMonthlyData]);

  const streak = useMemo(() => {
    let count = 0;
    const today = new Date();
    for (let i = 1; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const total = getTotalByDate(formatDate(d));
      if (total > 0 && total <= goals.kcalTarget) count++;
      else break;
    }
    return count;
  }, [meals, goals.kcalTarget, getTotalByDate]);

  const monthlySummary = useMemo(() => {
    const map = new Map<string, { total: number; days: number; inGoal: number }>();
    meals.forEach((m) => {
      const month = m.date.substring(0, 7);
      if (selectedYear !== 'all' && !month.startsWith(String(selectedYear))) return;
      if (!map.has(month)) map.set(month, { total: 0, days: 0, inGoal: 0 });
      map.get(month)!.total += m.calories;
    });
    const daySet = new Map<string, Set<string>>();
    meals.forEach((m) => {
      const month = m.date.substring(0, 7);
      if (selectedYear !== 'all' && !month.startsWith(String(selectedYear))) return;
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
  }, [meals, goals.kcalTarget, selectedYear, getTotalByDate]);

  const handleExport = async () => {
    const data = await exportAllData();
    downloadJSON(data, `daytracking-${new Date().toISOString().split('T')[0]}.json`);
  };

  const btnClass = (active: boolean) =>
    `px-3 py-1 rounded-lg text-xs font-medium transition ${
      active
        ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`;

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Progreso</h1>

      {streak > 0 && (
        <div className="mb-3">
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
          <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 -mx-1 px-1">
            <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">Rango:</span>
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 shrink-0">
              {([30, 90, 365] as Range[]).map((r) => (
                <button
                  key={r}
                  onClick={() => { setRange(r); setSelectedYear('all'); }}
                  className={btnClass(range === r && selectedYear === 'all')}
                >
                  {r} días
                </button>
              ))}
            </div>
            <span className="w-px h-5 bg-gray-300 dark:bg-gray-600 shrink-0" />
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 shrink-0">
              {dataYears.map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={btnClass(selectedYear === y)}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
          <CalorieChart
            data={calData}
            target={goals.kcalTarget}
            orangePct={goals.orangePct}
          />

          {yearMonthlyData && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                {selectedYear} — mensual
              </h3>
              {yearMonthlyData.map((m) => (
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
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        {m.inGoal}/{m.days} en objetivo
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'weight' && (
        <WeightChart weights={weights} target={goals.weightTarget} year={selectedYear !== 'all' ? selectedYear : undefined} />
      )}

      {(!yearMonthlyData || selectedYear === 'all') && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              Resumen mensual
            </h3>
            <div className="flex items-center gap-1">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="text-xs border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg px-2 py-1"
              >
                <option value="all">Todo</option>
                {dataYears.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <button
                onClick={handleExport}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline ml-2"
              >
                📤 Exportar
              </button>
            </div>
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
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        {m.inGoal}/{m.days} en objetivo
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
