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
  if (imc < 16) return 'Delgadez severa';
  if (imc < 17) return 'Delgadez moderada';
  if (imc < 18.5) return 'Delgadez leve';
  if (imc < 25) return 'Normopeso';
  if (imc < 30) return 'Sobrepeso';
  if (imc < 35) return 'Obesidad grado I';
  if (imc < 40) return 'Obesidad grado II';
  return 'Obesidad grado III (mórbida)';
}

export function getIMCCategory(imc: number): string {
  if (imc < 16) return 'underweight_severe';
  if (imc < 17) return 'underweight_moderate';
  if (imc < 18.5) return 'underweight_mild';
  if (imc < 25) return 'normal';
  if (imc < 30) return 'overweight';
  if (imc < 35) return 'obese_i';
  if (imc < 40) return 'obese_ii';
  return 'obese_iii';
}

export function calculateIdealWeightRange(heightCm: number) {
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

export function estimateWeeklyLoss(tdee: number, dailyKcal: number): number {
  return Math.round(((tdee - dailyKcal) * 7) / 770) / 10;
}

export function estimateBodyFat(
  imc: number,
  age: number,
  sex: 'male' | 'female'
): number {
  if (sex === 'male') {
    return Math.round((1.2 * imc + 0.23 * age - 16.2) * 10) / 10;
  }
  return Math.round((1.2 * imc + 0.23 * age - 5.4) * 10) / 10;
}

export function getBodyFatLabel(bf: number, sex: 'male' | 'female'): string {
  if (sex === 'male') {
    if (bf < 6) return 'Muy bajo (riesgo)';
    if (bf < 14) return 'Atlético';
    if (bf < 18) return 'Fit';
    if (bf < 25) return 'Aceptable';
    return 'Elevado';
  }
  if (bf < 14) return 'Muy bajo (riesgo)';
  if (bf < 21) return 'Atlético';
  if (bf < 25) return 'Fit';
  if (bf < 32) return 'Aceptable';
  return 'Elevado';
}

export function getObesityRisks(imc: number): string[] {
  const risks: string[] = [];
  const cat = getIMCCategory(imc);

  if (cat === 'overweight') {
    risks.push('Diabetes tipo 2: +50% de riesgo');
    risks.push('Hipertensión: +30% de riesgo');
    risks.push('Enfermedad cardiovascular: +20% de riesgo');
    risks.push('Apnea del sueño: riesgo moderado');
    risks.push('Artrosis: riesgo aumentado en articulaciones de carga');
  } else if (cat === 'obese_i') {
    risks.push('Diabetes tipo 2: riesgo 3× mayor');
    risks.push('Hipertensión: riesgo 2× mayor');
    risks.push('Enfermedad cardiovascular: +50% de riesgo');
    risks.push('Apnea del sueño: riesgo alto');
    risks.push('Esteatosis hepática: riesgo elevado');
    risks.push('Cálculos biliares: riesgo 3× mayor');
    risks.push('Artrosis: desgaste acelerado');
  } else if (cat === 'obese_ii') {
    risks.push('Diabetes tipo 2: riesgo 7× mayor');
    risks.push('Hipertensión: riesgo 3× mayor');
    risks.push('Infarto de miocardio: +80% de riesgo');
    risks.push('Apnea del sueño: riesgo muy alto');
    risks.push('Esteatosis hepática: probabilidad >70%');
    risks.push('Cáncer colorrectal: +50% de riesgo');
    risks.push('Insuficiencia venosa y tromboembolismo');
    risks.push('Depresión y ansiedad asociadas');
  } else if (cat === 'obese_iii') {
    risks.push('Diabetes tipo 2: riesgo 10× mayor');
    risks.push('Hipertensión: riesgo 4× mayor');
    risks.push('Infarto e ictus: riesgo 2-3× mayor');
    risks.push('Apnea del sueño: riesgo extremo (>80%)');
    risks.push('Esteatosis hepática y cirrosis');
    risks.push('Cáncer: ↑ riesgo colorrectal, mama, endometrio, riñón');
    risks.push('Tromboembolismo pulmonar: riesgo 4× mayor');
    risks.push('Artrosis invalidante de cadera y rodilla');
    risks.push('Mortalidad general: +100% respecto a normopeso');
    risks.push('Síndrome metabólico: presente en >80% de casos');
  } else if (cat === 'underweight_mild' || cat === 'underweight_moderate' || cat === 'underweight_severe') {
    risks.push('Mayor riesgo de infecciones por déficit inmune');
    risks.push('Osteoporosis y fracturas');
    risks.push('Pérdida de masa muscular (sarcopenia)');
    risks.push('Déficits nutricionales (vitaminas, minerales)');
    risks.push('Alteraciones hormonales y amenorrea');
  }

  return risks;
}

export function getPersonalizedAdvice(
  imc: number,
  _bmr: number,
  tdee: number,
  minSafe: number,
  deficitModerate: number,
  idealMin: number,
  idealMax: number,
  weight: number
): { title: string; body: string } {
  const cat = getIMCCategory(imc);

  if (cat === 'underweight_severe' || cat === 'underweight_moderate' || cat === 'underweight_mild') {
    return {
      title: 'Recuperación de peso saludable',
      body: `Tu IMC de ${imc.toFixed(1)} indica peso insuficiente. Para alcanzar el rango saludable (${idealMin}–${idealMax} kg), necesitas ganar aproximadamente ${Math.round(idealMin - weight)} kg. Se recomienda un superávit de 300–500 kcal/día sobre tu TDEE (${tdee} kcal), priorizando proteína y entrenamiento de fuerza para ganar masa muscular, no solo grasa. Consulta con un profesional si la pérdida de peso ha sido involuntaria.`,
    };
  }

  if (cat === 'normal') {
    return {
      title: 'Mantenimiento y salud óptima',
      body: `Tu IMC de ${imc.toFixed(1)} está dentro del rango saludable (${idealMin}–${idealMax} kg). Para mantenerlo, consume aproximadamente tu TDEE de ${tdee} kcal/día. Prioriza alimentos integrales, proteína magra, grasas saludables y fibra. Mantén actividad física regular (150+ min/semana de ejercicio moderado). Un déficit puntual de 300–500 kcal puede usarse para ajustes estéticos sin comprometer la salud.`,
    };
  }

  if (cat === 'overweight') {
    return {
      title: 'Pérdida de peso moderada',
      body: `Tu IMC de ${imc.toFixed(1)} indica sobrepeso. El objetivo es alcanzar ${idealMax} kg (IMC 25). Con un déficit moderado de ${deficitModerate} kcal/día (~${tdee - deficitModerate} kcal ingeridas), perderías aproximadamente ${estimateWeeklyLoss(tdee, deficitModerate).toFixed(2)} kg/semana. Prioriza proteína (1.6 g/kg), fibra (25+ g/día), y ejercicio combinado de fuerza + cardio. Evita dietas extremas (<${minSafe} kcal/día).`,
    };
  }

  if (cat === 'obese_i') {
    return {
      title: 'Plan de reducción estructurado',
      body: `Tu IMC de ${imc.toFixed(1)} corresponde a obesidad grado I. El primer objetivo es bajar a ${idealMax} kg (perder ~${Math.round(weight - idealMax)} kg). Con ${deficitModerate} kcal/día perderías ~${estimateWeeklyLoss(tdee, deficitModerate).toFixed(2)} kg/semana de forma segura. Se recomienda supervisión médica, déficit máximo de 750 kcal/día (mínimo ${minSafe} kcal), y ejercicio progresivo. La pérdida del 5–10% del peso ya produce mejoras significativas en marcadores de salud.`,
    };
  }

  return {
    title: 'Intervención clínica recomendada',
    body: `Tu IMC de ${imc.toFixed(1)} indica obesidad grado ${cat === 'obese_ii' ? 'II' : 'III'}. La pérdida de peso es una prioridad médica. El primer objetivo realista es perder el 10% de tu peso actual (${Math.round(weight * 0.1)} kg). Con ${deficitModerate} kcal/día (mínimo seguro: ${minSafe} kcal), perderías ~${estimateWeeklyLoss(tdee, deficitModerate).toFixed(2)} kg/semana. La supervisión médica es imprescindible. Valora consultar con endocrino/nutricionista para evaluar opciones como fármacos (GLP-1) o cirugía bariátrica si el IMC lo justifica.`,
  };
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
  const bodyFat = estimateBodyFat(imc, age, sex);
  const risks = getObesityRisks(imc);
  const advice = getPersonalizedAdvice(imc, bmr, tdee, minSafe, tdee - 500, ideal.min, ideal.max, weight);

  return {
    bmr,
    tdee,
    imc,
    imcLabel: getIMCLabel(imc),
    imcCategory: getIMCCategory(imc),
    idealMinWeight: ideal.min,
    idealMaxWeight: ideal.max,
    hamwiIdeal: hamwi,
    deficitModerate: Math.max(minSafe, tdee - 500),
    deficitAggressive: Math.max(minSafe, tdee - 750),
    minSafe,
    estimatedLoss: estimateWeeklyLoss(tdee, tdee - 500),
    bodyFat,
    bodyFatLabel: getBodyFatLabel(bodyFat, sex),
    risks,
    advice,
  };
}
