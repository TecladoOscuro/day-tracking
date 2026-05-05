import type { WeekStart } from '../types';

export function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function getWeekDays(date: Date, weekStartsOn: WeekStart): Date[] {
  const day = date.getDay();
  const offset = weekStartsOn === 'monday' ? (day === 0 ? -6 : 1 - day) : -day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + offset);
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatDateShort(date: Date): string {
  const days = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
  return `${days[date.getDay()]} ${date.getDate()}`;
}

export function formatMonthYear(date: Date): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function getWeekLabel(days: Date[]): string {
  const first = days[0];
  const last = days[6];
  return `${first.getDate()} ${formatMonthYear(first).split(' ')[0]} - ${last.getDate()} ${formatMonthYear(last).split(' ')[0]}`;
}

export function getPeriodLabel(period: string): string {
  const labels: Record<string, string> = {
    morning: 'Mañana',
    midday: 'Mediodía',
    afternoon: 'Tarde',
    night: 'Noche',
  };
  return labels[period] || period;
}

export function getPeriodFromHour(hour: number): string {
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 15) return 'midday';
  if (hour >= 15 && hour < 20) return 'afternoon';
  return 'night';
}

export function addWeeks(date: Date, weeks: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return formatDate(a) === formatDate(b);
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function getWeekStart(date: Date, weekStartsOn: WeekStart): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = weekStartsOn === 'monday' ? (day === 0 ? -6 : 1 - day) : -day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function getLastNDays(days: number): Date[] {
  const result: Date[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push(d);
  }
  return result;
}

export function diffInDays(a: string, b: string): number {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}
