import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  FileText,
  CreditCard,
  Headphones,
  Gauge,
  Wifi,
  Bell,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotificationsStore } from '@/stores/notifications-store';
import { useSidebarStore } from '@/stores/sidebar-store';

const NAV_ITEMS = [
  { label: 'Профиль', path: '/profile', icon: User },
  { label: 'Договоры', path: '/tariffs', icon: FileText },
  { label: 'Платежи', path: '/payments', icon: CreditCard },
  { label: 'Поддержка', path: '/support', icon: Headphones },
  { label: 'Скорость', path: '/speedtest', icon: Gauge },
  { label: 'Сеть', path: '/network', icon: Wifi },
  { label: 'Уведомления', path: '/notifications', icon: Bell },
];

export default function Sidebar() {
  const { collapsed, toggle } = useSidebarStore();
  const unreadCount = useNotificationsStore((s) => s.unreadCount);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200',
        collapsed ? 'w-[52px]' : 'w-[220px]'
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between px-3">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="shrink-0">
                <rect width="28" height="28" rx="6" className="fill-primary" />
                <path d="M7 20V8l4 6 4-6v12M19 8v12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm font-semibold text-foreground">Максима</span>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="mx-auto shrink-0">
            <rect width="28" height="28" rx="6" className="fill-primary" />
            <path d="M7 20V8l4 6 4-6v12M19 8v12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-2 py-2">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-sidebar-accent text-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground',
                collapsed && 'justify-center px-0'
              )
            }
          >
            <Icon size={18} className="shrink-0" />
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
            {label === 'Уведомления' && unreadCount > 0 && (
              <span
                className={cn(
                  'flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white',
                  collapsed ? 'absolute -right-0.5 -top-0.5' : 'ml-auto'
                )}
              >
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggle}
        className="mx-2 mb-3 flex h-8 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
        aria-label={collapsed ? 'Развернуть' : 'Свернуть'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
