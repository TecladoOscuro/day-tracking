import { useState, useRef, useEffect } from 'react';
import { useGoals } from '../hooks/useGoals';
import { useProfile } from '../hooks/useProfile';
import { useSettings } from '../hooks/useSettings';
import { useFoodPresets } from '../hooks/useFoodPresets';
import { useTheme } from '../hooks/useTheme';
import { exportAllData, downloadJSON, importData } from '../utils/exportImport';
import { db } from '../db/database';
import { getFullResults, ACTIVITY_LABELS } from '../utils/endocrine';
import type { WeekStart } from '../types';
import type { Goals, Settings } from '../types';

export default function MorePage() {
  const { goals, saveGoals } = useGoals();
  const { profile, hasProfile } = useProfile();
  const { settings, saveSettings } = useSettings();
  const { presets, deletePreset } = useFoodPresets();
  const { theme, toggle: toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [localGoals, setLocalGoals] = useState<Goals>(goals);
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  useEffect(() => { setLocalGoals(goals); }, [goals]);
  useEffect(() => { setLocalSettings(settings); }, [settings]);

  const [section, setSection] = useState<
    'goals' | 'profile' | 'advice' | 'export' | 'presets'
  >('goals');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('merge');

  const results = profile
    ? getFullResults(
        profile.currentWeight,
        profile.height,
        profile.age,
        profile.sex,
        profile.activityLevel
      )
    : null;

  const handleExport = async () => {
    const data = await exportAllData();
    downloadJSON(data, `daytracking-${new Date().toISOString().split('T')[0]}.json`);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const success = await importData(text, importMode);
    setImportStatus(
      success
        ? '✅ Datos importados correctamente. Recarga la página.'
        : '❌ Error al importar. Formato no válido.'
    );
    if (success) {
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('¿Seguro que quieres borrar TODOS los datos? Esta acción no se puede deshacer.')) return;
    if (!window.confirm('Última advertencia: se perderán todas las comidas, pesos, fotos y ajustes. ¿Continuar?')) return;
    await db.meals.clear();
    await db.weights.clear();
    await db.profile.clear();
    await db.goals.clear();
    await db.settings.clear();
    await db.foodPresets.clear();
    window.location.reload();
  };

  const tabs = [
    { key: 'goals' as const, label: 'Objetivos', icon: '🎯' },
    { key: 'profile' as const, label: 'Perfil', icon: '👤' },
    { key: 'advice' as const, label: 'Consejos', icon: '💡' },
    { key: 'presets' as const, label: 'Comidas', icon: '📋' },
    { key: 'export' as const, label: 'Datos', icon: '📤' },
  ];

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Más</h1>

      <div className="flex gap-1 flex-wrap mb-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setSection(t.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              section === t.key
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {section === 'goals' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200">Objetivos</h2>
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
              Objetivo diario (kcal)
            </label>
            <input
              type="number"
              value={localGoals.kcalTarget}
              onChange={(e) =>
                setLocalGoals({ ...localGoals, kcalTarget: Number(e.target.value) || 0 })
              }
              onBlur={() => saveGoals(localGoals)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
              Objetivo de peso (kg)
            </label>
            <input
              type="number"
              value={localGoals.weightTarget}
              onChange={(e) =>
                setLocalGoals({
                  ...localGoals,
                  weightTarget: Number(e.target.value) || 0,
                })
              }
              onBlur={() => saveGoals(localGoals)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                Umbral 🟠 (%)
              </label>
              <input
                type="number"
                value={localGoals.orangePct}
                onChange={(e) =>
                  setLocalGoals({
                    ...localGoals,
                    orangePct: Number(e.target.value) || 100,
                  })
                }
                onBlur={() => saveGoals(localGoals)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                Umbral 🔴 (%)
              </label>
              <input
                type="number"
                value={localGoals.redPct}
                onChange={(e) =>
                  setLocalGoals({ ...localGoals, redPct: Number(e.target.value) || 100 })
                }
                onBlur={() => saveGoals(localGoals)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
              Primer día de la semana
            </label>
            <select
              value={localSettings.weekStartsOn}
              onChange={(e) => {
                const next = { ...localSettings, weekStartsOn: e.target.value as WeekStart };
                setLocalSettings(next);
                saveSettings(next);
              }}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="monday">Lunes</option>
              <option value="sunday">Domingo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
              Tema
            </label>
            <button
              onClick={toggleTheme}
              className={`w-full py-2.5 rounded-xl text-sm font-medium transition ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {theme === 'dark' ? '🌙 Oscuro' : '☀️ Claro'}
            </button>
          </div>
        </div>
      )}

      {section === 'profile' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200">Perfil fisiológico</h2>
          {hasProfile && profile ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <p className="text-xs text-gray-400 dark:text-gray-500">Altura</p>
                  <p className="font-semibold dark:text-white">{profile.height} cm</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <p className="text-xs text-gray-400 dark:text-gray-500">Peso</p>
                  <p className="font-semibold dark:text-white">{profile.currentWeight} kg</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <p className="text-xs text-gray-400 dark:text-gray-500">Edad</p>
                  <p className="font-semibold dark:text-white">{profile.age} años</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <p className="text-xs text-gray-400 dark:text-gray-500">Sexo</p>
                  <p className="font-semibold dark:text-white">
                    {profile.sex === 'male' ? 'Hombre' : 'Mujer'}
                  </p>
          </div>

          <div className="mt-4">
            <button
              onClick={handleReset}
              className="w-full py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
              🗑️ Borrar todos los datos
            </button>
          </div>
        </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500">Actividad</p>
                <p className="font-semibold dark:text-white text-sm">
                  {ACTIVITY_LABELS[profile.activityLevel]}
                </p>
              </div>
              <button
                onClick={() => setSection('advice')}
                className="text-sm text-indigo-600 font-medium hover:underline"
              >
                Ver consejos personalizados →
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Completa el perfil en el onboarding para ver tus métricas.
            </p>
          )}
        </div>
      )}

      {section === 'advice' && results ? (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm space-y-3">
            <h2 className="font-semibold text-gray-700 dark:text-gray-200">Tus métricas</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Metabolismo basal (BMR)</span>
                <span className="font-semibold dark:text-white">{results.bmr} kcal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Gasto diario (TDEE)</span>
                <span className="font-semibold dark:text-white">{results.tdee} kcal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">IMC</span>
                <span className="font-semibold dark:text-white">
                  {results.imc} — {results.imcLabel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Grasa corporal est.</span>
                <span className="font-semibold dark:text-white">
                  {results.bodyFat}% — {results.bodyFatLabel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Peso ideal (IMC 18.5–25)</span>
                <span className="font-semibold dark:text-white">
                  {results.idealMinWeight} – {results.idealMaxWeight} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Peso ideal (Hamwi)</span>
                <span className="font-semibold dark:text-white">{results.hamwiIdeal} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Déficit recomendado</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {results.deficitModerate} kcal/día
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Déficit máximo</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {results.deficitAggressive} kcal/día
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Mínimo seguro (80% BMR)</span>
                <span className="font-semibold text-red-500 dark:text-red-400">
                  {results.minSafe} kcal/día
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-2">
              🩺 {results.advice.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {results.advice.body}
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 rounded-2xl p-4">
            <h3 className="font-semibold text-amber-800 dark:text-amber-400 text-sm mb-2">
              ⚠️ Advertencia
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-400/80 leading-relaxed">
              Tu mínimo seguro es de <strong>{results.minSafe} kcal/día</strong>.
              Comer por debajo de forma prolongada causa pérdida muscular,
              ralentización metabólica, deficiencias nutricionales y efecto rebote.
              Una VLCD debe limitarse a 4-6 semanas con supervisión médica.
              La estrategia más segura: déficit de 500 kcal/día, pérdida de ~{results.estimatedLoss.toFixed(1)} kg/semana.
            </p>
          </div>

          {results.risks.length > 0 && (
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl p-4">
              <h3 className="font-semibold text-red-800 dark:text-red-400 text-sm mb-2">
                🏥 Riesgos asociados a tu IMC
              </h3>
              <ul className="text-sm text-red-700 dark:text-red-400/80 space-y-1">
                {results.risks.map((r, i) => (
                  <li key={i}>• {r}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900 rounded-2xl p-4">
            <h3 className="font-semibold text-indigo-800 dark:text-indigo-400 text-sm mb-2">
              💡 Recomendaciones generales
            </h3>
            <ul className="text-sm text-indigo-700 dark:text-indigo-400/80 space-y-1.5">
              <li>• Prioriza proteína (1.6-2g por kg de peso) para preservar músculo</li>
              <li>• Bebe 2-3L de agua al día</li>
              <li>• Pésate siempre a la misma hora (mañana, ayunas)</li>
              <li>• El peso fluctúa ±1-2 kg al día; mira la tendencia, no el dato aislado</li>
              <li>• Distribuye las calorías en 3-4 comidas para mantener la saciedad</li>
              <li>• Incluye fibra (verduras, legumbres) para mejorar la digestión</li>
              <li>• El sueño afecta el metabolismo: duerme 7-8h para optimizar resultados</li>
              <li>• El ejercicio de fuerza preserva masa muscular durante la pérdida de peso</li>
            </ul>
          </div>
        </div>
      ) : null}

      {section === 'presets' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Comidas frecuentes</h2>
          {presets.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Las comidas que registres se guardarán aquí automáticamente para
              reutilizarlas.
            </p>
          ) : (
            <div className="space-y-1">
              {presets.map((p) => (
                <div
                  key={p.id}
                className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0"
              >
                  <span className="text-sm text-gray-700 dark:text-gray-200">{p.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-indigo-600 font-medium">
                      {p.calories} kcal
                    </span>
                    <button
                      onClick={() => {
                        if (window.confirm('¿Eliminar esta comida frecuente?')) {
                          p.id !== undefined && deletePreset(p.id);
                        }
                      }}
                      className="text-gray-300 hover:text-red-400 text-sm"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {section === 'export' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm space-y-3">
            <h2 className="font-semibold text-gray-700 dark:text-gray-200">Exportar datos</h2>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Descarga todos tus datos (comidas, pesos, fotos, ajustes) en un archivo
              JSON para hacer copia de seguridad o migrar a otro dispositivo.
            </p>
            <button
              onClick={handleExport}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow"
            >
              📤 Descargar backup
            </button>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm space-y-3">
            <h2 className="font-semibold text-gray-700 dark:text-gray-200">Importar datos</h2>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Carga un archivo JSON exportado previamente para restaurar o migrar
              tus datos.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setImportMode('merge')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                  importMode === 'merge'
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}
              >
                Fusionar
              </button>
              <button
                onClick={() => setImportMode('replace')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                  importMode === 'replace'
                    ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}
              >
                Reemplazar
              </button>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              📥 Cargar archivo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            {importStatus && (
              <p
                className={`text-sm ${importStatus.startsWith('✅') ? 'text-emerald-600' : 'text-red-500'}`}
              >
                {importStatus}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
