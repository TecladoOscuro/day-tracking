interface Props {
  streak: number;
}

export default function StreakBadge({ streak }: Props) {
  if (streak <= 0) return null;
  return (
    <div className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
      <span>🔥</span>
      <span>{streak} día{streak !== 1 ? 's' : ''}</span>
    </div>
  );
}
