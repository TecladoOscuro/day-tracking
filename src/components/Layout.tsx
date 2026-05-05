import { Outlet } from 'react-router-dom';
import TabBar from './TabBar';

export default function Layout() {
  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-gray-950">
      <div className="max-w-lg mx-auto pb-20">
        <Outlet />
      </div>
      <TabBar />
    </div>
  );
}
