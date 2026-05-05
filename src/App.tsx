import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TodayPage from './pages/TodayPage';
import WeekPage from './pages/WeekPage';
import WeightPage from './pages/WeightPage';
import ProgressPage from './pages/ProgressPage';
import MorePage from './pages/MorePage';
import OnboardingWizard from './components/OnboardingWizard';
import { useProfile } from './hooks/useProfile';
import { useTheme } from './hooks/useTheme';

function AppContent() {
  const { hasProfile, loading, saveProfile } = useProfile();
  useTheme();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (!hasProfile) {
    return <OnboardingWizard onComplete={saveProfile} />;
  }

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<TodayPage />} />
          <Route path="/week" element={<WeekPage />} />
          <Route path="/weight" element={<WeightPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/more" element={<MorePage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default function App() {
  return <AppContent />;
}
