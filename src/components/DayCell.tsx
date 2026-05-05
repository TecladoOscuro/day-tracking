interface Props {
  calories: number;
  target: number;
  orangePct: number;
  redPct: number;
}

export function getPct(calories: number, target: number): number {
  if (target <= 0) return 0;
  return Math.round((calories / target) * 100);
}

export function getCellBg(
  calories: number,
  target: number,
  orangePct: number,
  _redPct: number
): string {
  if (calories === 0) return 'bg-gray-100';
  const pct = getPct(calories, target);
  if (pct <= 100) return 'bg-emerald-100 border-emerald-300';
  if (pct <= orangePct) return 'bg-amber-100 border-amber-300';
  return 'bg-red-100 border-red-300';
}

export function getCellText(
  calories: number,
  target: number,
  orangePct: number,
  _redPct: number
): string {
  if (calories === 0) return 'text-gray-400';
  const pct = getPct(calories, target);
  if (pct <= 100) return 'text-emerald-700';
  if (pct <= orangePct) return 'text-amber-700';
  return 'text-red-700';
}

export default function DayCell({
  calories,
  target,
  orangePct,
  redPct,
}: Props) {
  return (
    <div
      className={`${getCellBg(calories, target, orangePct, redPct)} border rounded-lg p-1.5 text-center min-w-[3rem] transition-colors`}
    >
      <span
        className={`text-sm font-semibold ${getCellText(calories, target, orangePct, redPct)}`}
      >
        {calories > 0 ? calories : '-'}
      </span>
    </div>
  );
}
