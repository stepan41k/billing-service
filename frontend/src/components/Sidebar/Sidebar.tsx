import { useState, memo } from 'react';
import { NavLink } from 'react-router-dom';
import { BalanceWidget } from '../BalanceWidget';
import { IconCollapse, IconChevron, IconLogout } from '../Icons';
import type { NavItem } from '../../types';
import styles from './Sidebar.module.css';

interface Props {
  items: NavItem[];
  onLogout: () => void;
}

export const Sidebar = memo(function Sidebar({ items, onLogout }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <button
        className={styles.toggle}
        onClick={() => setCollapsed((p) => !p)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed
          ? <IconChevron size={16} />
          : <IconCollapse size={16} />
        }
      </button>

      {!collapsed && <BalanceWidget />}

      <nav className={styles.nav}>
        {items.map(({ label, path, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            {icon && <span className={styles.icon}>{icon}</span>}
            {!collapsed && <span className={styles.label}>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button className={styles.logout} onClick={onLogout} aria-label="Выйти">
        <IconLogout size={16} />
        {!collapsed && <span>Выйти</span>}
      </button>
    </aside>
  );
});

