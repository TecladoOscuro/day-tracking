import { useState, useMemo } from 'react';
import { useWeights } from '../hooks/useWeights';
import { useGoals } from '../hooks/useGoals';
import { useProfile } from '../hooks/useProfile';
import WeightChart from '../components/WeightChart';
import WeightEntry from '../components/WeightEntry';
import PhotoCompare from '../components/PhotoCompare';
import { calculateIMC, getIMCLabel } from '../utils/endocrine';
import type { WeightEntry as WeightEntryType } from '../types';

export default function WeightPage() {
  const { weights, addWeight, deleteWeight } = useWeights();
  const { goals } = useGoals();
  const { profile } = useProfile();
  const [showForm, setShowForm] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WeightEntryType | null>(null);
  const [weightYear, setWeightYear] = useState<number | 'all'>('all');

  const weightYears = useMemo(() => {
    const years = new Set<number>();
    weights.forEach((w) => {
      const y = parseInt(w.date.substring(0, 4));
      if (!isNaN(y)) years.add(y);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [weights]);

  const latest = weights.length > 0 ? weights[weights.length - 1] : null;
  const imc = latest && profile ? calculateIMC(latest.weight, profile.height) : null;

  const getWeightChange = () => {
    if (weights.length < 2) return null;
    const first = weights[0];
    const last = weights[weights.length - 1];
    return last.weight - first.weight;
  };
  const change = getWeightChange();

  const handleDelete = async () => {
    if (!editingEntry?.id) return;
    if (!window.confirm('¿Eliminar este registro de peso?')) return;
    await deleteWeight(editingEntry.id);
    setEditingEntry(null);
    setShowForm(false);
  };

  const filteredWeights = useMemo(() => {
    if (weightYear === 'all') return weights;
    return weights.filter((w) => w.date.startsWith(String(weightYear)));
  }, [weights, weightYear]);

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Peso</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCompare(true)}
            className="px-3 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all"
          >
            🔍 Comparar
          </button>
          <button
            onClick={() => { setEditingEntry(null); setShowForm(true); }}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow"
          >
            + Registrar
          </button>
        </div>
      </div>

      {latest ? (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white mb-4 shadow-lg">
          <p className="text-sm opacity-80">Peso actual</p>
          <p className="text-3xl font-bold">{latest.weight} kg</p>
          {imc && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm opacity-80">IMC {imc.toFixed(1)}</span>
              <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">{getIMCLabel(imc)}</span>
            </div>
          )}
          {change !== null && (
            <p className="text-sm mt-1 opacity-90">
              {change <= 0 ? '↓' : '↑'} {Math.abs(change).toFixed(1)} kg desde el inicio
            </p>
          )}
          {goals.weightTarget > 0 && (
            <div className="mt-2 bg-white/15 rounded-lg p-2 text-sm">
              A {Math.abs(latest.weight - goals.weightTarget).toFixed(1)} kg del objetivo ({goals.weightTarget} kg)
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center text-gray-400 dark:text-gray-500 mb-4 shadow-sm">
          <p className="text-3xl mb-2">⚖️</p>
          <p className="text-sm">No hay registros de peso aún. Empieza registrando tu primer peso.</p>
        </div>
      )}

      {weights.length > 1 && (
        <div className="mb-4">
          {weightYears.length > 1 && (
            <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
              <button
                onClick={() => setWeightYear('all')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-medium shrink-0 transition ${
                  weightYear === 'all' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >Todo</button>
              {weightYears.map((y) => (
                <button key={y} onClick={() => setWeightYear(y)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium shrink-0 transition ${
                    weightYear === y ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >{y}</button>
              ))}
            </div>
          )}
          <WeightChart weights={weights} target={goals.weightTarget} year={weightYear} />
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Historial</h3>
        {filteredWeights.length === 0 ? (
          <p className="text-xs text-gray-400 dark:text-gray-500">Sin registros</p>
        ) : (
          filteredWeights.slice().reverse().map((w) => (
            <div
              key={w.id}
              onClick={() => { setEditingEntry(w); setShowForm(true); }}
              className="bg-white dark:bg-gray-900 rounded-xl p-3 shadow-sm flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 transition-colors"
            >
              {w.photos && w.photos.length > 0 ? (
                <div className="flex gap-1 shrink-0">
                  {w.photos.slice(0, 3).map((p, i) => (
                    <img key={i} src={p} alt={`${w.date}-${i}`} className="w-12 h-12 rounded-lg object-cover" />
                  ))}
                  {w.photos.length > 3 && (
                    <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500">
                      +{w.photos.length - 3}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                  <span className="text-gray-400 text-lg">⚖️</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {new Date(w.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                {w.note && <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{w.note}</p>}
              </div>
              <span className="font-bold text-gray-800 dark:text-white">{w.weight} kg</span>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <WeightEntry
          onSave={(data) => { addWeight(data); setEditingEntry(null); }}
          onDelete={editingEntry ? handleDelete : undefined}
          onClose={() => { setShowForm(false); setEditingEntry(null); }}
          initialDate={editingEntry?.date}
          initialWeight={editingEntry?.weight}
          initialPhotos={editingEntry?.photos}
          initialNote={editingEntry?.note}
        />
      )}

      {showCompare && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowCompare(false)}>
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <PhotoCompare weights={weights} />
            <button onClick={() => setShowCompare(false)} className="w-full py-2.5 mt-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
