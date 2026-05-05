import { useState } from 'react';
import type { Profile, Sex, ActivityLevel } from '../types';
import { ACTIVITY_LABELS } from '../utils/endocrine';
import { getFullResults } from '../utils/endocrine';

interface Props {
  onComplete: (profile: Profile) => void;
}

export default function OnboardingWizard({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [age, setAge] = useState(30);
  const [sex, setSex] = useState<Sex>('male');
  const [activity, setActivity] = useState<ActivityLevel>('sedentary');

  const results = getFullResults(weight, height, age, sex, activity);

  const handleComplete = () => {
    onComplete({
      height,
      currentWeight: weight,
      age,
      sex,
      activityLevel: activity,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-500 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md p-6">
        <div className="flex gap-1 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Cuéntame sobre ti
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Estos datos se usan para calcular tu metabolismo y darte recomendaciones personalizadas. Todo se guarda solo en tu dispositivo.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Sexo
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['male', 'female'] as Sex[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSex(s)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition ${
                      sex === s
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {s === 'male' ? '♂ Hombre' : '♀ Mujer'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Altura: {height} cm
              </label>
              <input
                type="range"
                min={130}
                max={220}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500">
                <span>130cm</span>
                <span>220cm</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Peso actual: {weight} kg
              </label>
              <input
                type="range"
                min={35}
                max={200}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500">
                <span>35kg</span>
                <span>200kg</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Edad: {age} años
              </label>
              <input
                type="range"
                min={14}
                max={100}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500">
                <span>14</span>
                <span>100</span>
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow mt-2"
            >
              Siguiente
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Nivel de actividad
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Esto determina cuántas calorías gastas al día.
            </p>
            {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActivity(key as ActivityLevel)}
                className={`w-full text-left p-3 rounded-xl border-2 transition ${
                  activity === key
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                <span className="font-medium text-sm">{label}</span>
              </button>
            ))}
            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Atrás
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Tus resultados</h2>

            <div className="bg-gradient-to-br from-indigo-50 dark:from-indigo-950 to-indigo-100 dark:to-indigo-900 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Metabolismo basal (BMR)</span>
                <span className="font-bold text-indigo-700">{results.bmr} kcal</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Gasto diario (TDEE)</span>
                <span className="font-bold text-indigo-700">{results.tdee} kcal</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">IMC</span>
                <span className="font-bold">{results.imc} — {results.imcLabel}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Peso ideal</span>
                <span className="font-bold">
                  {results.idealMinWeight} – {results.idealMaxWeight} kg
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Déficit moderado</span>
                <span className="font-bold text-emerald-600">
                  {results.deficitModerate} kcal/día
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Déficit agresivo</span>
                <span className="font-bold text-amber-600">
                  {results.deficitAggressive} kcal/día
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Mínimo seguro (80% BMR)</span>
                <span className="font-bold text-red-500">{results.minSafe} kcal</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Pérdida estimada/semana</span>
                <span className="font-bold text-emerald-600">
                  ~{results.estimatedLoss.toFixed(2)} kg
                </span>
              </div>
            </div>

            <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl">
              ⚠️ Como endocrino te recomiendo no bajar de {results.minSafe} kcal/día (80% de tu BMR). Por debajo de ese umbral el riesgo de pérdida muscular, efecto rebote y deficiencias nutricionales es alto. Un déficit de 500 kcal/día es la estrategia más segura y sostenible a largo plazo.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Atrás
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow"
              >
                Empezar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
