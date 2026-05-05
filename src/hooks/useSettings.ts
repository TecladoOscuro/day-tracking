import { useEffect, useState } from 'react';
import { db } from '../db/database';
import type { Settings } from '../types';

const DEFAULT_SETTINGS: Settings = {
  weekStartsOn: 'monday',
  darkMode: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.settings.toArray().then((items) => {
      if (items.length > 0) {
        setSettings({ ...DEFAULT_SETTINGS, ...items[0] });
      }
      setLoading(false);
    });
  }, []);

  const saveSettings = async (s: Settings) => {
    const existing = await db.settings.toArray();
    if (existing.length > 0) {
      await db.settings.update(existing[0].id!, s as any);
    } else {
      await db.settings.add(s as any);
    }
    setSettings(s);
  };

  return { settings, loading, saveSettings };
}
