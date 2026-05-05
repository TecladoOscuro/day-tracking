export function getSemaphoreColor(
  calories: number,
  target: number,
  orangePct: number,
  _redPct: number
): 'green' | 'orange' | 'red' {
  if (target <= 0) return 'green';
  const pct = (calories / target) * 100;
  if (pct <= 100) return 'green';
  if (pct <= orangePct) return 'orange';
  return 'red';
}

export function getSemaphoreBg(
  calories: number,
  target: number,
  orangePct: number,
  redPct: number
): string {
  const color = getSemaphoreColor(calories, target, orangePct, redPct);
  switch (color) {
    case 'green':
      return 'bg-emerald-500';
    case 'orange':
      return 'bg-amber-500';
    case 'red':
      return 'bg-red-500';
  }
}

export function getSemaphoreText(
  calories: number,
  target: number,
  orangePct: number,
  redPct: number
): string {
  const color = getSemaphoreColor(calories, target, orangePct, redPct);
  switch (color) {
    case 'green':
      return 'text-emerald-600';
    case 'orange':
      return 'text-amber-600';
    case 'red':
      return 'text-red-600';
  }
}

export function getProgressPct(calories: number, target: number): number {
  if (target <= 0) return 100;
  return Math.min(100, Math.round((calories / target) * 100));
}
