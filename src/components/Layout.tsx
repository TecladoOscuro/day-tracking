import { Outlet } from 'react-router-dom';
import TabBar from './TabBar';

export default function Layout() {
  return (
    <div className="h-dvh flex flex-col bg-gray-50 dark:bg-gray-950">
      <div className="flex-1 min-h-0 max-w-lg mx-auto w-full overflow-hidden">
        <Outlet />
      </div>
      <TabBar />
    </div>
  );
}
