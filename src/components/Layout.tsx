import { Outlet } from 'react-router-dom';
import TabBar from './TabBar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-16">
      <div className="max-w-lg mx-auto">
        <Outlet />
      </div>
      <TabBar />
    </div>
  );
}
