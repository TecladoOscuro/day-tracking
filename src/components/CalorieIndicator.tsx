import { getProgressPct, getSemaphoreBg } from '../utils/colors';

interface Props {
  calories: number;
  target: number;
  orangePct: number;
  redPct: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export default function CalorieIndicator({
  calories,
  target,
  orangePct,
  redPct,
  size = 'md',
  label,
}: Props) {
  const pct = target > 0 ? getProgressPct(calories, target) : 0;
  const bg = getSemaphoreBg(calories, target, orangePct, redPct);

  const dimensions = { sm: 80, md: 110, lg: 140 }[size];
  const fontSize = { sm: 'text-xl', md: 'text-2xl', lg: 'text-3xl' }[size];
  const subSize = { sm: 'text-[10px]', md: 'text-xs', lg: 'text-sm' }[size];

  return (
    <div className="flex flex-col items-center gap-1">
      {label && <span className="text-xs text-gray-400">{label}</span>}
      <div
        className={`${bg} rounded-full flex flex-col items-center justify-center text-white font-bold shadow-lg transition-colors duration-500`}
        style={{ width: dimensions, height: dimensions }}
      >
        <span className={fontSize}>{calories}</span>
        <span className={subSize}>kcal</span>
        <span className={subSize}>{pct}%</span>
      </div>
    </div>
  );
}
