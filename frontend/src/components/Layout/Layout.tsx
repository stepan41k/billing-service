import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';
import { useProfileStore } from '@/stores/profile-store';
import { useBalanceStore } from '@/stores/balance-store';
import { useNotificationsStore } from '@/stores/notifications-store';
import { useSidebarStore } from '@/stores/sidebar-store';
import { cn } from '@/lib/utils';

export default function Layout() {
  const fetchProfile = useProfileStore((s) => s.fetch);
  const fetchBalance = useBalanceStore((s) => s.fetch);
  const fetchNotifications = useNotificationsStore((s) => s.fetch);
  const collapsed = useSidebarStore((s) => s.collapsed);

  useEffect(() => {
    fetchProfile();
    fetchBalance();
    fetchNotifications();
  }, [fetchProfile, fetchBalance, fetchNotifications]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div
        className={cn(
          'flex flex-1 flex-col transition-[margin-left] duration-200',
          collapsed ? 'ml-[52px]' : 'ml-[220px]'
        )}
      >
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
