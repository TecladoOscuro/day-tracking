export const PAL: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: 'Sedentario (poco o nada de ejercicio)',
  light: 'Ligero (1-3 días/semana)',
  moderate: 'Moderado (3-5 días/semana)',
  active: 'Activo (6-7 días/semana)',
  very_active: 'Muy activo (entrenamiento intenso diario)',
};

export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  sex: 'male' | 'female'
): number {
  if (sex === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

export function calculateTDEE(bmr: number, activity: string): number {
  return Math.round(bmr * (PAL[activity] || 1.2));
}

export function calculateIMC(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weight / (heightM * heightM);
}

export function getIMCLabel(imc: number): string {
  if (imc < 18.5) return 'Bajo peso';
  if (imc < 25) return 'Normopeso';
  if (imc < 30) return 'Sobrepeso';
  return 'Obesidad';
}

export function calculateIdealWeightRange(heightCm: number): {
  min: number;
  max: number;
} {
  const heightM = heightCm / 100;
  return {
    min: Math.round(18.5 * heightM * heightM * 10) / 10,
    max: Math.round(24.9 * heightM * heightM * 10) / 10,
  };
}

export function calculateHamwiIdeal(
  heightCm: number,
  sex: 'male' | 'female'
): number {
  const inches = heightCm / 2.54;
  if (sex === 'male') {
    return Math.round((48 + 1.1 * (inches - 60)) * 10) / 10;
  }
  return Math.round((45.5 + 0.9 * (inches - 60)) * 10) / 10;
}

export function estimateWeeklyLoss(
  tdee: number,
  dailyKcal: number
): number {
  return Math.round(((tdee - dailyKcal) * 7) / 770) / 10;
}

export function getFullResults(
  weight: number,
  height: number,
  age: number,
  sex: 'male' | 'female',
  activity: string
) {
  const bmr = Math.round(calculateBMR(weight, height, age, sex));
  const tdee = calculateTDEE(bmr, activity);
  const imc = Math.round(calculateIMC(weight, height) * 10) / 10;
  const ideal = calculateIdealWeightRange(height);
  const hamwi = calculateHamwiIdeal(height, sex);
  const minSafe = Math.round(bmr * 0.8);

  return {
    bmr,
    tdee,
    imc,
    imcLabel: getIMCLabel(imc),
    idealMinWeight: ideal.min,
    idealMaxWeight: ideal.max,
    hamwiIdeal: hamwi,
    deficitModerate: Math.max(minSafe, tdee - 500),
    deficitAggressive: Math.max(minSafe, tdee - 750),
    minSafe,
    estimatedLoss: estimateWeeklyLoss(tdee, tdee - 500),
  };
}
