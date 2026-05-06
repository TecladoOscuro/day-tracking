import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

interface Props {
  data: { date: string; calories: number }[];
  target: number;
  orangePct: number;
}

export default function CalorieChart({ data, target, orangePct }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Sin datos para mostrar
      </div>
    );
  }

  const chartData = data.map((d) => {
    const isMonthly = /^\d{4}-\d{2}$/.test(d.date);
    if (isMonthly) {
      const [y, m] = d.date.split('-');
      return {
        ...d,
        date: new Date(Number(y), Number(m) - 1).toLocaleDateString('es-ES', { month: 'short' }),
      };
    }
    return {
      ...d,
      date: new Date(d.date + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
    };
  });

  const getColor = (calories: number) => {
    if (target <= 0) return '#6366f1';
    const pct = (calories / target) * 100;
    if (pct <= 100) return '#10b981';
    if (pct <= orangePct) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Calorías diarias</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            unit=" kcal"
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: 12,
            }}
          />
          {target > 0 && (
            <ReferenceLine
              y={target}
              stroke="#6366f1"
              strokeDasharray="6 4"
              strokeWidth={1.5}
              label={{
                value: `Obj ${target}`,
                position: 'insideTopRight',
                fontSize: 10,
                fill: '#6366f1',
              }}
            />
          )}
          <Bar dataKey="calories" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={getColor(entry.calories)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
