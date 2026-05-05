import { useState } from 'react';
import { useWeights } from '../hooks/useWeights';
import { useGoals } from '../hooks/useGoals';
import { useProfile } from '../hooks/useProfile';
import WeightChart from '../components/WeightChart';
import WeightEntry from '../components/WeightEntry';
import PhotoCompare from '../components/PhotoCompare';
import ProgressPhotos from '../components/ProgressPhotos';
import { calculateIMC, getIMCLabel } from '../utils/endocrine';

export default function WeightPage() {
  const { weights, addWeight, deleteWeight } = useWeights();
  const { goals } = useGoals();
  const { profile } = useProfile();
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<'chart' | 'photos' | 'compare'>('chart');

  const latest = weights.length > 0 ? weights[weights.length - 1] : null;
  const imc = latest && profile
    ? calculateIMC(latest.weight, profile.height)
    : null;

  const getWeightChange = () => {
    if (weights.length < 2) return null;
    const first = weights[0];
    const last = weights[weights.length - 1];
    const diff = last.weight - first.weight;
    return diff;
  };

  const change = getWeightChange();

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">Peso</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 shadow"
        >
          + Registrar
        </button>
      </div>

      {latest ? (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white mb-4 shadow-lg">
          <p className="text-sm opacity-80">Peso actual</p>
          <p className="text-3xl font-bold">{latest.weight} kg</p>
          {imc && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm opacity-80">IMC {imc.toFixed(1)}</span>
              <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                {getIMCLabel(imc)}
              </span>
            </div>
          )}
          {change !== null && (
            <p className="text-sm mt-2 opacity-90">
              {change <= 0 ? '↓' : '↑'} {Math.abs(change).toFixed(1)} kg desde el inicio
            </p>
          )}
          {goals.weightTarget > 0 && (
            <div className="mt-2 bg-white/15 rounded-lg p-2 text-sm">
              A {Math.abs(latest.weight - goals.weightTarget).toFixed(1)} kg de tu objetivo ({goals.weightTarget} kg)
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-400 mb-4 shadow-sm">
          <p className="text-3xl mb-2">⚖️</p>
          <p className="text-sm">No hay registros de peso aún. Empieza registrando tu primer peso.</p>
        </div>
      )}

      {weights.length > 1 && (
        <>
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-3">
            {(['chart', 'photos', 'compare'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                  tab === t ? 'bg-white shadow text-gray-800' : 'text-gray-500'
                }`}
              >
                {t === 'chart' ? '📈 Gráfica' : t === 'photos' ? '🖼️ Fotos' : '🔍 Comparar'}
              </button>
            ))}
          </div>

          {tab === 'chart' && (
            <WeightChart weights={weights} target={goals.weightTarget} />
          )}
          {tab === 'photos' && <ProgressPhotos weights={weights} />}
          {tab === 'compare' && <PhotoCompare weights={weights} />}
        </>
      )}

      <div className="mt-4 space-y-2 mb-16">
        <h3 className="text-sm font-semibold text-gray-600">Historial</h3>
        {weights.length === 0 ? (
          <p className="text-xs text-gray-400">Sin registros</p>
        ) : (
          weights
            .slice()
            .reverse()
            .map((w) => (
              <div
                key={w.id}
                className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3"
              >
                {w.photo && (
                  <img
                    src={w.photo}
                    alt={w.date}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700">
                    {new Date(w.date).toLocaleDateString('es-ES', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                  {w.note && (
                    <p className="text-xs text-gray-400 truncate">{w.note}</p>
                  )}
                </div>
                <span className="font-bold text-gray-800">{w.weight} kg</span>
                <button
                  onClick={() => {
                    if (window.confirm('¿Eliminar este registro de peso?')) {
                      w.id !== undefined && deleteWeight(w.id);
                    }
                  }}
                  className="text-gray-300 hover:text-red-400 text-lg leading-none ml-1"
                >
                  ×
                </button>
              </div>
            ))
        )}
      </div>

      {showForm && (
        <WeightEntry onSave={addWeight} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
