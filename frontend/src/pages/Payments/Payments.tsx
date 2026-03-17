import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { usePayments } from "../../hooks/usePayments";
import { PageTransition } from "../../components/PageTransition";
import { AnimatedList, itemVariants } from "../../components/AnimatedList";
import type { Payment } from "../../types";
import styles from "./Payments.module.css";

const TYPE_LABEL: Record<Payment["type"], string> = {
  deposit: "Пополнение",
  charge: "Списание",
  refund: "Возврат",
};

interface PaymentRowProps {
  payment: Payment;
}

const PaymentRow = memo(function PaymentRow({ payment }: PaymentRowProps) {
  const sign = payment.type === "charge" ? "-" : "+";
  const formattedAmount = Math.abs(payment.amount).toFixed(2);

  return (
    <motion.div
      className={styles.row}
      variants={itemVariants}
      layout
    >
      <div className={styles.left}>
        <span
          className={`${styles.dot} ${styles[payment.type]}`}
        />
        <div>
          <p className={styles.desc}>{payment.description}</p>
          <p className={styles.meta}>
            {TYPE_LABEL[payment.type]} • договор №{payment.contractNumber} •{" "}
            {payment.date}
          </p>
        </div>
      </div>

      <span
        className={`${styles.amount} ${styles[payment.type]}`}
      >
        {sign}
        {formattedAmount} ₽
      </span>
    </motion.div>
  );
});

export default function Payments() {
  const { payments, loading, error } = usePayments();

  const total = useMemo(
    () => payments.reduce((acc, p) => acc + p.amount, 0),
    [payments],
  );

  if (loading) {
    return <div className={styles.state}>Загрузка...</div>;
  }

  if (error) {
    return (
      <div className={`${styles.state} ${styles.error}`}>
        {error}
      </div>
    );
  }

  if (!payments.length) {
    return (
      <div className={styles.state}>
        История платежей пока пуста.
      </div>
    );
  }

  return (
    <PageTransition>
      <div className={styles.root}>
        <div className={styles.topBar}>
          <h2 className={styles.heading}>Платежи</h2>
          <div className={styles.summary}>
            <span>ИТОГО ПО ОПЕРАЦИЯМ</span>
            <strong>{total.toFixed(2)} ₽</strong>
          </div>
        </div>

        <AnimatedList className={styles.list}>
          {payments.map(payment => (
            <PaymentRow key={payment.id} payment={payment} />
          ))}
        </AnimatedList>
      </div>
    </PageTransition>
  );
}
