import { db } from '../db/database';

export async function exportAllData() {
  const [meals, weights, foodPresets] = await Promise.all([
    db.meals.toArray(),
    db.weights.toArray(),
    db.foodPresets.toArray(),
  ]);
  const profileItems = await db.profile.toArray();
  const goalItems = await db.goals.toArray();
  const settingItems = await db.settings.toArray();

  return {
    version: 1,
    exportDate: new Date().toISOString(),
    data: {
      profile: profileItems[0] || null,
      goals: goalItems[0] || null,
      settings: settingItems[0] || null,
      meals: meals.map(({ id, ...rest }) => rest),
      weights: weights.map(({ id, ...rest }) => rest),
      foodPresets: foodPresets.map(({ id, ...rest }) => rest),
    },
  };
}

export async function importData(
  json: string,
  mode: 'replace' | 'merge'
): Promise<boolean> {
  try {
    const parsed = JSON.parse(json);
    if (!parsed.version || !parsed.data) throw new Error('Invalid format');

    const d = parsed.data;

    if (mode === 'replace') {
      await db.meals.clear();
      await db.weights.clear();
      await db.foodPresets.clear();
      await db.profile.clear();
      await db.goals.clear();
      await db.settings.clear();
    }

    if (d.profile) {
      const existing = await db.profile.toArray();
      if (existing.length > 0) {
        await db.profile.update(existing[0].id!, d.profile);
      } else {
        await db.profile.add(d.profile);
      }
    }
    if (d.goals) {
      const existing = await db.goals.toArray();
      if (existing.length > 0) {
        await db.goals.update(existing[0].id!, d.goals);
      } else {
        await db.goals.add(d.goals);
      }
    }
    if (d.settings) {
      const existing = await db.settings.toArray();
      if (existing.length > 0) {
        await db.settings.update(existing[0].id!, d.settings);
      } else {
        await db.settings.add(d.settings);
      }
    }

    if (mode === 'merge' && d.meals) {
      const existing = await db.meals.toArray();
      const existingKeys = new Set(
        existing.map((m) => `${m.date}|${m.period}|${m.description}`)
      );
      const toAdd = d.meals.filter(
        (m: { date: string; period: string; description: string }) =>
          !existingKeys.has(`${m.date}|${m.period}|${m.description}`)
      );
      if (toAdd.length > 0) await db.meals.bulkAdd(toAdd);
    } else if (d.meals) {
      await db.meals.bulkAdd(d.meals);
    }

    if (mode === 'merge' && d.weights) {
      const existing = await db.weights.toArray();
      const existingKeys = new Set(existing.map((w) => w.date));
      const toAdd = d.weights.filter(
        (w: { date: string }) => !existingKeys.has(w.date)
      );
      if (toAdd.length > 0) await db.weights.bulkAdd(toAdd);
    } else if (d.weights) {
      await db.weights.bulkAdd(d.weights);
    }

    if (mode === 'merge' && d.foodPresets) {
      const existing = await db.foodPresets.toArray();
      const existingKeys = new Set(existing.map((f) => f.name));
      const toAdd = d.foodPresets.filter(
        (f: { name: string }) => !existingKeys.has(f.name)
      );
      if (toAdd.length > 0) await db.foodPresets.bulkAdd(toAdd);
    } else if (d.foodPresets) {
      await db.foodPresets.bulkAdd(d.foodPresets);
    }

    return true;
  } catch (e) {
    console.error('Import failed:', e);
    return false;
  }
}

export function downloadJSON(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
