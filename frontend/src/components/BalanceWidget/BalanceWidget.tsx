import { memo } from 'react';
import { useBalance } from '../../hooks/useBalance';
import styles from './BalanceWidget.module.css';

export const BalanceWidget = memo(function BalanceWidget() {
  const { balance, loading, error } = useBalance();

  const isPositive = (balance?.amount ?? 0) >= 0;
  const display = loading
    ? '…'
    : error
    ? '—'
    : isPositive
    ? `${balance!.amount.toFixed(0)}`
    : `-${Math.abs(balance!.amount).toFixed(0)}`;

  return (
    <div className={styles.widget}>
      <span className={styles.label}>Баланс</span>
      <span className={`${styles.amount} ${isPositive ? styles.positive : styles.negative}`}>
        {display}
      </span>
    </div>
  );
});

