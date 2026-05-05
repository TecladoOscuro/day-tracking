# Day Tracking

A Progressive Web App (PWA) for daily calorie and weight tracking. Works offline, installable on iPhone and Android.

**Live**: [tecladooscuro.github.io/day-tracking](https://tecladooscuro.github.io/day-tracking)

## Features

- 📱 **PWA** — install to home screen, works offline
- 🌙 **Dark mode** — toggle in settings
- 🍽️ **Calorie tracking** — log meals by period (morning, midday, afternoon, night)
- 📅 **Week grid** — visual overview of 7 days × 4 periods with color coding
- ⚖️ **Weight tracking** — record weight with progress photos and comparison
- 📊 **Charts** — calorie and weight history with trend lines
- 🔥 **Streak** — daily goal compliance tracking
- 🎯 **Configurable goals** — calorie target, weight target, color thresholds
- 🧬 **Endocrine calculator** — BMR, TDEE, IMC, ideal weight (Mifflin-St Jeor)
- 📤 **Export/Import** — JSON backup with merge or replace modes
- 💡 **Personalized advice** — based on your physiological profile

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
2. Choose your **activity level** (sedentary to very active)
3. Review your **calculated metrics** and recommendations

All data is stored locally on your device (IndexedDB). Nothing is sent to any server.

### Setting your goals

1. Go to **⚙️ Más** → **🎯 Objetivos**
2. Set your daily calorie target and weight target
3. Adjust color thresholds (🟠 warning %, 🔴 danger %)
4. Choose week start day (Monday or Sunday)

You can also enable/disable dark mode here.

### Logging meals

**Today view** (🏠):
- See today's calorie progress with a color indicator
- Four periods: Mañana, Mediodía, Tarde, Noche
- Tap **+ Añadir** in any period to log a meal
- Tap a meal to edit or delete it
- Recent descriptions appear as suggestions when typing

**Week view** (📅):
- Navigate weeks with ← →
- See all 7 days as cards, each with 4 period cells
- Tap any cell to view or add meals
- Color coding: 🟢 within goal · 🟠 warning · 🔴 over limit

### Tracking weight

1. Go to **⚖️ Peso**
2. Tap **+ Registrar** to add weight, optional photo, and note
3. View your weight chart with trend line and goal marker
4. Use the tabs to switch between **Gráfica**, **Fotos**, and **Comparar**
5. Compare progress photos side by side

### Viewing progress

**📊 Progreso**:
- Calorie bar chart (30, 90, or 365 days)
- Weight line chart
- Monthly summary with totals, averages, and goal compliance
- Streak counter for consecutive days within goal
- Export your data as JSON

### Color thresholds

| Color | Default | Meaning |
|-------|---------|---------|
| 🟢 Green | ≤ 100% of target | Within goal |
| 🟠 Orange | 101% – 150% | Warning |
| 🔴 Red | > 150% | Over limit |

Thresholds are configurable in Settings.

### Exporting and importing

- Go to **⚙️ Más** → **📤 Datos**
- **Export**: downloads a `.json` file with all your data (meals, weights, photos, settings)
- **Import**: upload a previously exported file. Choose **Fusionar** to add to existing data or **Reemplazar** to start fresh.

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Dexie.js (IndexedDB)
- Recharts
- vite-plugin-pwa

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
