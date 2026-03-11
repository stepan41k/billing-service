import { motion } from 'framer-motion';
import { useProfile } from '../../hooks/useProfile';
import { PageTransition } from '../../components/PageTransition';
import { AnimatedList, itemVariants } from '../../components/AnimatedList';
import styles from './Profile.module.css';

const fields = [
  { key: 'login',        label: 'Логин' },
  { key: 'email',        label: 'Email' },
  { key: 'phone',        label: 'Телефон' },
  { key: 'contract',     label: 'Договор №' },
  { key: 'client',       label: 'Клиент ID' },
  { key: 'lastActivity', label: 'Последний вход' },
] as const;

export default function Profile() {
  const { user, loading, error } = useProfile();

  if (loading) return <div className={styles.state}>Загрузка…</div>;
  if (error)   return <div className={`${styles.state} ${styles.error}`}>{error}</div>;
  if (!user)   return null;

  return (
    <PageTransition>
      <div className={styles.root}>
        <h2 className={styles.heading}>Профиль</h2>
        <AnimatedList className={styles.grid}>
          {fields.map(({ key, label }) => (
            <motion.div key={key} className={styles.card} variants={itemVariants}>
              <span className={styles.fieldLabel}>{label}</span>
              <span className={styles.value}>{String(user[key] ?? '—')}</span>
            </motion.div>
          ))}
        </AnimatedList>
        {user.readOnly && <p className={styles.badge}>Режим только для чтения</p>}
      </div>
    </PageTransition>
  );
}

