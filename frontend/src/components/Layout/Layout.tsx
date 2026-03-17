import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { Sidebar } from '../Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { IconProfile, IconTariff, IconPayments } from '../Icons';
import type { NavItem } from '../../types';
import styles from './Layout.module.css';

const NAV_ITEMS: NavItem[] = [
  { label: 'Профиль', path: '/profile',  icon: <IconProfile  size={17} /> },
  { label: 'Тарифы',  path: '/tariffs',  icon: <IconTariff   size={17} /> },
  { label: 'Платежи', path: '/payments', icon: <IconPayments size={17} /> },
];

const shellVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.1, when: 'beforeChildren', staggerChildren: 0.06 },
  },
};

const sidebarVariants: Variants = {
  initial: { x: -24, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
};

const mainVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
};

export default function Layout() {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <motion.div
      className={styles.root}
      variants={shellVariants}
      initial="initial"
      animate="animate"
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      <motion.div variants={sidebarVariants} style={{ display: 'flex' }}>
        <Sidebar items={NAV_ITEMS} onLogout={handleLogout} />
      </motion.div>

      <motion.main className={styles.main} variants={mainVariants}>
        {/* AnimatePresence здесь — переходы между вкладками внутри кабинета */}
        <AnimatePresence mode="wait" initial={false}>
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </motion.main>
    </motion.div>
  );
}

