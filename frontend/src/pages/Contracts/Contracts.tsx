import { useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { useContracts } from "../../hooks/useContracts";
import { PageTransition } from "../../components/PageTransition";
import { AnimatedList, itemVariants } from "../../components/AnimatedList";
import { Modal } from "../../components/Modal";
import { IconChevron } from "../../components/Icons";
import type { Contract } from "../../types";
import styles from "./Contracts.module.css";

const STATUS_LABEL: Record<Contract["status"], string> = {
  active: "Активен",
  suspended: "Приостановлен",
  closed: "Закрыт",
};

const bodyVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] },
      opacity: { duration: 0.2 },
    },
  },
};

const collapseVariants = {
  expanded: { rotate: 90, transition: { duration: 0.2 } },
  collapsed: { rotate: 0, transition: { duration: 0.2 } },
};

interface CardProps {
  c: Contract;
  activeContract: Contract | undefined;
  onConnect: (c: Contract) => void;
}

const ContractCard = memo(function ContractCard({
  c,
  activeContract,
  onConnect,
}: CardProps) {
  const [open, setOpen] = useState(false);
  const isCurrent = activeContract?.id === c.id;

  return (
    <motion.div
      className={`${styles.card} ${styles[c.status]}`}
      variants={itemVariants}
      layout
    >
      <button
        type="button"
        className={styles.header}
        onClick={() => setOpen(p => !p)}
      >
        <div className={styles.headerLeft}>
          <span className={styles.number}>№ {c.number}</span>
          <span className={`${styles.badge} ${styles[c.status]}`}>
            {STATUS_LABEL[c.status]}
          </span>
          {isCurrent && <span className={styles.current}>Текущий</span>}
        </div>
        <motion.span
          className={styles.chevron}
          variants={collapseVariants}
          animate={open ? "expanded" : "collapsed"}
        >
          <IconChevron size={15} />
        </motion.span>
      </button>

      <motion.div
        className={styles.body}
        variants={bodyVariants}
        initial="collapsed"
        animate={open ? "expanded" : "collapsed"}
        style={{ overflow: "hidden" }}
      >
        <div className={styles.grid}>
          <div className={styles.field}>
            <span>Тариф</span>
            <strong>{c.tariff}</strong>
          </div>
          <div className={styles.field}>
            <span>Скорость</span>
            <strong>{c.speedMbps} Мбит/с</strong>
          </div>
          <div className={styles.field}>
            <span>Трафик</span>
            <strong>
              {c.unlimitedTraffic
                ? "Безлимит"
                : `${c.trafficLimitGb ?? 0} ГБ/мес`}
            </strong>
          </div>
          <div className={styles.field}>
            <span>Стоимость</span>
            <strong className={styles.price}>{c.pricePerMonth} ₽/мес</strong>
          </div>
          <div className={styles.field}>
            <span>Адрес</span>
            <strong>{c.address}</strong>
          </div>
          <div className={styles.field}>
            <span>Дата подключения</span>
            <strong>{c.created}</strong>
          </div>
        </div>

        {!isCurrent && c.status !== "closed" && (
          <button
            type="button"
            className={styles.connectBtn}
            onClick={e => {
              e.stopPropagation();
              onConnect(c);
            }}
          >
            Подключить
          </button>
        )}
      </motion.div>
    </motion.div>
  );
});

export default function Contracts() {
  const { contracts, loading, error } = useContracts();
  const [pending, setPending] = useState<Contract | null>(null);

  const activeContract = contracts.find(c => c.status === "active");

  const handleConnect = useCallback((c: Contract) => {
    setPending(c);
  }, []);

  const handleClose = useCallback(() => {
    setPending(null);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!pending || !activeContract) {
      setPending(null);
      return;
    }

    try {
      // TODO[backend]: интегрировать реальный API переключения тарифа.
      // Пример контракта:
      // await api.switchContract({
      //   fromId: activeContract.id,
      //   toId: pending.id,
      // });
      //
      // См. файл frontend/INTEGRATION_NOTES.md.
    } finally {
      setPending(null);
    }
  }, [activeContract, pending]);

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

  return (
    <>
      <PageTransition>
        <div className={styles.root}>
          <h2 className={styles.heading}>Тарифы</h2>
          <AnimatedList className={styles.list}>
            {contracts.map(c => (
              <ContractCard
                key={c.id}
                c={c}
                activeContract={activeContract}
                onConnect={handleConnect}
              />
            ))}
          </AnimatedList>
        </div>
      </PageTransition>

      <Modal
        open={Boolean(pending)}
        onClose={handleClose}
        onConfirm={handleConfirm}
      >
        <p>
          Вы хотите переключить текущий тариф{" "}
          <strong>«{activeContract?.tariff ?? "—"}»</strong>{" "}
          на тариф <strong>«{pending?.tariff}»</strong>?
        </p>
      </Modal>
    </>
  );
}
