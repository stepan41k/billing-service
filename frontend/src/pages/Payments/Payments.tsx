import { memo } from 'react';
import { motion } from 'framer-motion';
import { usePayments } from '../../hooks/usePayments';
import { PageTransition } from '../../components/PageTransition';
import { AnimatedList, itemVariants } from '../../components/AnimatedList';
import type { Payment } from '../../types';
import styles from './Payments.module.css';

const TYPE_LABEL: Record<Payment['type'], string> = {
  deposit: 'Пополнение',
  charge:  'Списание',
  refund:  'Возврат',
};

const PaymentRow = memo(function PaymentRow({ p }: { p: Payment }) {
  const sign = p.type === 'charge' ? '-' : '+';
  return (
    <motion.div className={styles.row} variants={itemVariants}>
      <div className={styles.left}>
        <span className={`${styles.dot} ${styles[p.type]}`} />
        <div>
          <p className={styles.desc}>{p.description}</p>
          <p className={styles.meta}>{TYPE_LABEL[p.type]} · Договор № {p.contractNumber} · {p.date}</p>
        </div>
      </div>
      <span className={`${styles.amount} ${styles[p.type]}`}>
        {sign}{Math.abs(p.amount).toFixed(2)} ₽
      </span>
    </motion.div>
  );
});

export default function Payments() {
  const { payments, loading, error } = usePayments();

  if (loading) return <div className={styles.state}>Загрузка…</div>;
  if (error)   return <div className={`${styles.state} ${styles.error}`}>{error}</div>;

  return (
    <PageTransition>
      <div className={styles.root}>
        <h2 className={styles.heading}>Платежи</h2>
        <AnimatedList className={styles.list}>
          {payments.map((p) => <PaymentRow key={p.id} p={p} />)}
        </AnimatedList>
      </div>
    </PageTransition>
  );
}

