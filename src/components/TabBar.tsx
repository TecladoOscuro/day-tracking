import { useLocation, useNavigate } from 'react-router-dom';

const TABS = [
  { path: '/', label: 'Hoy', icon: '🏠' },
  { path: '/week', label: 'Semana', icon: '📅' },
  { path: '/weight', label: 'Peso', icon: '⚖️' },
  { path: '/progress', label: 'Progreso', icon: '📊' },
  { path: '/more', label: 'Más', icon: '⚙️' },
];

export default function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 safe-area-bottom z-40">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {TABS.map((tab) => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            aria-label={tab.label}
            aria-current={isActive(tab.path) ? 'page' : undefined}
            className={`flex flex-col items-center py-2 px-3 min-w-[60px] transition-colors ${
              isActive(tab.path)
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px] font-medium mt-0.5">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
