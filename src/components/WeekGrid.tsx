import type { Meal, Period } from '../types';
import { formatDate, formatDateShort, getPeriodLabel, isToday } from '../utils/dates';
import { getPct } from './DayCell';

interface Props {
  days: Date[];
  getMealsByDate: (date: string) => Meal[];
  goals: { kcalTarget: number; orangePct: number; redPct: number };
  onCellTap: (date: string, period: Period) => void;
}

const PERIODS: Period[] = ['morning', 'midday', 'afternoon', 'night'];

function cellTextColor(calories: number, target: number, orangePct: number): string {
  if (calories === 0) return 'text-gray-400 dark:text-gray-600';
  const pct = getPct(calories, target);
  if (pct <= 100) return 'text-emerald-700 dark:text-emerald-300';
  if (pct <= orangePct) return 'text-amber-700 dark:text-amber-300';
  return 'text-red-700 dark:text-red-300';
}

export default function WeekGrid({ days, getMealsByDate, goals, onCellTap }: Props) {
  const getCellTotal = (date: string, period: string) =>
    getMealsByDate(date)
      .filter((m) => m.period === period)
      .reduce((sum, m) => sum + m.calories, 0);

  const getDayTotal = (date: string) =>
    getMealsByDate(date).reduce((sum, m) => sum + m.calories, 0);

  return (
    <div className="space-y-3">
      {days.map((day) => {
        const isoDate = formatDate(day);
        const dayTotal = getDayTotal(isoDate);
        const today = isToday(day);

        return (
          <div
            key={isoDate}
            className={`rounded-2xl border transition-colors ${
              today
                ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-950/30'
                : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900'
            }`}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-inherit">
              <div>
                <span
                  className={`text-sm font-semibold ${
                    today
                      ? 'text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-700 dark:text-gray-200'
                  }`}
                >
                  {formatDateShort(day)}
                </span>
                {today && (
                  <span className="ml-2 text-[10px] bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 px-1.5 py-0.5 rounded-full font-medium">
                    Hoy
                  </span>
                )}
              </div>
              <div
                className={`text-sm font-bold px-2.5 py-1 rounded-full ${
                  dayTotal === 0
                    ? 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800'
                    : getPct(dayTotal, goals.kcalTarget) <= 100
                    ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50'
                    : getPct(dayTotal, goals.kcalTarget) <= goals.orangePct
                    ? 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50'
                    : 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50'
                }`}
              >
                {dayTotal > 0 ? `${dayTotal}` : '-'}
              </div>
            </div>

            <div className="grid grid-cols-4 divide-x divide-inherit">
              {PERIODS.map((period) => {
                const total = getCellTotal(isoDate, period);
                const pt = goals.kcalTarget / 4;
                return (
                  <button
                    key={period}
                    onClick={() => onCellTap(isoDate, period)}
                    className="py-2.5 text-center active:opacity-70 transition-opacity"
                  >
                    <div className="text-[10px] font-medium text-gray-400 dark:text-gray-500 mb-0.5">
                      {getPeriodLabel(period).slice(0, 3)}
                    </div>
                    <div
                      className={`text-sm font-semibold ${cellTextColor(total, pt, goals.orangePct)}`}
                    >
                      {total > 0 ? total : '-'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
