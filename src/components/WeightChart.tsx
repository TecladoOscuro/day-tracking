import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { WeightEntry } from '../types';

interface Props {
  weights: WeightEntry[];
  target?: number;
}

export default function WeightChart({ weights, target }: Props) {
  if (weights.length < 2) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Necesitas al menos 2 registros de peso para ver la gráfica
      </div>
    );
  }

  const data = weights.map((w) => ({
    date: new Date(w.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
    weight: w.weight,
  }));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Evolución del peso</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={['dataMin - 2', 'dataMax + 2']}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            unit=" kg"
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: 12,
            }}
          />
          {target && (
            <ReferenceLine
              y={target}
              stroke="#10b981"
              strokeDasharray="6 4"
              strokeWidth={2}
              label={{
                value: `Objetivo ${target}kg`,
                position: 'insideBottomRight',
                fontSize: 10,
                fill: '#10b981',
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#4f46e5' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
