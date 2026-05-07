# Day Tracking

A Progressive Web App (PWA) for daily calorie and weight tracking. Works offline, installable on iPhone and Android.

**Live**: [tecladooscuro.github.io/day-tracking](https://tecladooscuro.github.io/day-tracking)

## Features

- 📱 **PWA** — install to home screen, works fully offline
- 🌙 **Dark / Light mode** — toggle in settings, saved instantly
- 🍽️ **Calorie tracking** — log meals by period (Mañana, Mediodía, Tarde, Noche)
- 📅 **Week grid** — 7-day overview as cards with color-coded cells
- ⚖️ **Weight tracking** — record weight with multiple photos per entry
- 📸 **Photo gallery** — fullscreen viewer with prev/next, compare side by side
- 📊 **Charts** — calorie bars and weight lines with year/month filtering
- 🔥🏆 **Streak + all-time record** — current streak and your best ever
- 🎯 **Configurable goals** — kcal target, weight target, color thresholds, week start day
- 🧬 **Endocrine calculator** — BMR, TDEE, IMC (7 WHO categories), body fat %, Hamwi ideal weight
- 🏥 **Obesity risk profiles** — specific % increases for diabetes, cardiovascular, cancer, etc.
- 🩺 **Personalized medical advice** — 5 tiers based on your IMC (underweight → obese III)
- 📤 **Export/Import** — JSON backup with merge or replace modes
- 🗑️ **Reset data** — clear all data and start fresh
- 📋 **Recent meal suggestions** — based on your actual meal history

## How to install on iPhone

1. Open the URL in Safari
2. Tap the **Share** button (↑)
3. Scroll down and tap **"Add to Home Screen"**
4. Name it and tap **Add**

The app will open fullscreen, like a native app, and work without internet.

## How to use

### First launch

You'll see a 3-step onboarding wizard:
1. Enter your **sex, height, weight, and age**
2. Choose your **activity level** (sedentary → very active)
3. Review your **calculated metrics** (BMR, TDEE, IMC, body fat %, ideal weight) and medical advice

All data is stored locally on your device (IndexedDB). Nothing is sent to any server.

### Tabs

| Tab | Description |
|-----|-------------|
| 🏠 Hoy | Today's meals grouped by period with calorie semaphore |
| 📅 Semana | Weekly calendar, navigate with arrows, tap any cell |
| ⚖️ Peso | Weight chart, history, photo compare |
| 📊 Progreso | Charts, streaks, monthly summaries, year filters |
| ⚙️ Más | Settings, medical advice, export/import, reset |

### Setting your goals

1. Go to **⚙️ Más** → **🎯 Objetivos**
2. Set your daily calorie target and weight target
3. Adjust color thresholds (🟠 warning %, 🔴 danger %)
4. Choose week start day (Monday or Sunday)
5. Toggle dark/light mode

### Logging meals

**Today view** (🏠):
- See today's calorie progress with a color-coded circle
- Four periods: Mañana, Mediodía, Tarde, Noche
- Tap **+ Añadir** in any period → modal asks for description and calories (no period selector — the period is implicit)
- Tap a meal to edit or delete it
- Recent descriptions appear as suggestions when typing

**Week view** (📅):
- Navigate weeks with ← → and real date labels (e.g. "5 - 11 Mayo")
- See all 7 days as cards, each with 4 period cells
- Tap any cell to view existing meals or add new ones
- Color coding: 🟢 within goal · 🟠 warning · 🔴 over limit

### Tracking weight

**⚖️ Peso**:
- **Weight card**: shows current weight, IMC, change since start, distance to goal
- **Chart**: line chart with trend and goal reference, filterable by year
- **History**: tap any entry to edit — change weight, date, photos, note, or delete
- **Multiple photos** per entry: add front/side/any angle photos
- **🔍 Comparar**: pick any two photos (from any dates) and view them side by side with weight difference
- **Fullscreen viewer**: tap any photo for a fullscreen view with prev/next navigation

### Viewing progress

**📊 Progreso**:
- **Calorie tab**: bar chart with 30d/90d/365d quick filters + year buttons. Monthly breakdown when a year is selected
- **Weight tab**: line chart filterable by year. Monthly weight summary (avg kg, min-max range, month-to-month change arrow)
- **Streaks**: current streak (🔥) and all-time best (🏆 récord). Only count completed days
- **Monthly summary**: avg kcal/day as the hero number, total kcal as subtitle, days in goal percentage
- **Year filtering**: dynamic years from your data with horizontal scroll

### Color thresholds

| Color | Default | Meaning |
|-------|---------|---------|
| 🟢 Green | ≤ 100% of target | Within goal |
| 🟠 Orange | 101% – 150% | Warning |
| 🔴 Red | > 150% | Over limit |

Thresholds are configurable in Settings.

### Medical advice

**⚙️ Más → 💡 Consejos**:
- **Métricas**: BMR, TDEE, IMC with WHO subcategory, estimated body fat % (CUN-BAE formula), Hamwi ideal weight, safe deficit ranges
- **Plan personalizado**: 5 tiers from underweight recovery to clinical intervention for obese III
- **Riesgos**: specific % increases for diabetes, hypertension, cardiovascular disease, apnea, hepatic steatosis, cancer, etc.
- **Recomendaciones**: protein intake, hydration, weighing routine, sleep, exercise
- Always uses your **latest logged weight**, not static profile data

### Exporting and importing

- Go to **⚙️ Más** → **📤 Datos**
- **Export**: downloads a `.json` file with all your data (meals, weights, photos, settings)
- **Import**: upload a previously exported file. **Fusionar** adds to existing data (skips duplicates). **Reemplazar** starts fresh
- **Reset**: double-confirmation button to delete all data and restart

### Data format (import)

```json
{
  "version": 1,
  "exportDate": "2026-05-06T...",
  "data": {
    "profile": { "height": 179, "currentWeight": 85, "age": 29, "sex": "male", "activityLevel": "sedentary" },
    "goals": { "kcalTarget": 1500, "weightTarget": 75, "orangePct": 150, "redPct": 200 },
    "settings": { "weekStartsOn": "monday" },
    "meals": [{ "date": "2026-05-06", "period": "morning", "description": "Tortilla", "calories": 300 }],
    "weights": [{ "date": "2026-05-06", "weight": 85.5, "photos": ["base64..."], "note": "Ayunas" }],
    "foodPresets": []
  }
}
```

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS (dark mode via `class` strategy)
- Dexie.js (IndexedDB)
- Recharts
- vite-plugin-pwa (service worker + manifest)

## Development

```bash
npm install
npm run dev      # dev server on localhost:5173
npm run build    # production build to dist/
npm run preview  # preview production build
```

## Deployment

Pushed to `main` branch → GitHub Actions builds and deploys to GitHub Pages automatically.

To publish under your own account:
1. Fork the repo
2. Update `base` in `vite.config.ts`
3. Enable GitHub Pages in repo settings (source: GitHub Actions)
