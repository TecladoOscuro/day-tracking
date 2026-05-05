import type { Meal, Period } from '../types';
import { formatDateShort, formatDate, getPeriodLabel, isToday } from '../utils/dates';
import DayCell from './DayCell';

interface Props {
  days: Date[];
  getMealsByDate: (date: string) => Meal[];
  goals: { kcalTarget: number; orangePct: number; redPct: number };
  onCellTap: (date: string, period: Period) => void;
}

const PERIODS: Period[] = ['morning', 'midday', 'afternoon', 'night'];

export default function WeekGrid({ days, getMealsByDate, goals, onCellTap }: Props) {
  const getCellTotal = (date: string, period: string) =>
    getMealsByDate(date)
      .filter((m) => m.period === period)
      .reduce((sum, m) => sum + m.calories, 0);

  const getDayTotal = (date: string) =>
    getMealsByDate(date).reduce((sum, m) => sum + m.calories, 0);

  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <table className="w-full min-w-[600px] border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="text-left text-xs font-medium text-gray-400 py-1 pl-1">
              Momento
            </th>
            {days.map((day, i) => (
              <th
                key={i}
                className={`text-center text-xs font-medium py-1 ${isToday(day) ? 'bg-indigo-100 text-indigo-700 rounded-lg' : 'text-gray-400'}`}
              >
                {formatDateShort(day)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERIODS.map((period) => (
            <tr key={period}>
              <td className="text-xs text-gray-500 font-medium py-1 pr-2">
                {getPeriodLabel(period)}
              </td>
              {days.map((day, i) => {
                const isoDate = formatDate(day);
                const total = getCellTotal(isoDate, period);
                return (
                  <td
                    key={i}
                    onClick={() => onCellTap(isoDate, period)}
                    className="cursor-pointer"
                  >
                    <DayCell
                      calories={total}
                      target={goals.kcalTarget / 4}
                      orangePct={goals.orangePct}
                      redPct={goals.redPct}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
          <tr>
            <td className="text-xs text-gray-800 font-bold py-1 pr-2">
              Total día
            </td>
            {days.map((day, i) => {
              const isoDate = formatDate(day);
              return (
                <td key={i}>
                  <DayCell
                    calories={getDayTotal(isoDate)}
                    target={goals.kcalTarget}
                    orangePct={goals.orangePct}
                    redPct={goals.redPct}
                  />
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
