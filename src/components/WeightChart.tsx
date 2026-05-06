import { useMemo } from 'react';
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
  year?: number | 'all';
}

export default function WeightChart({ weights, target, year = 'all' }: Props) {
  const filtered = useMemo(() => {
    if (year === 'all') return weights;
    return weights.filter((w) => w.date.startsWith(String(year)));
  }, [weights, year]);

  if (filtered.length < 2) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        {year !== 'all'
          ? `No hay suficientes datos en ${year}`
          : 'Necesitas al menos 2 registros de peso para ver la gráfica'}
      </div>
    );
  }

  const data = filtered.map((w) => ({
    date: new Date(w.date + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
    weight: w.weight,
    fullDate: w.date,
  }));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
        Evolución del peso {year !== 'all' ? `— ${year}` : ''}
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={data.length > 20 ? Math.floor(data.length / 8) : 0}
          />
          <YAxis
            domain={[(d: number) => d - 2, (d: number) => d + 2]}
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
            formatter={(value: any) => [`${value} kg`, 'Peso']}
            labelFormatter={(label: any) => label}
          />
          {target && (
            <ReferenceLine
              y={target}
              stroke="#10b981"
              strokeDasharray="6 4"
              strokeWidth={2}
              label={{
                value: `Obj ${target}kg`,
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
            dot={data.length <= 30 ? { r: 3, fill: '#6366f1', strokeWidth: 0 } : false}
            activeDot={{ r: 5, fill: '#4f46e5' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
