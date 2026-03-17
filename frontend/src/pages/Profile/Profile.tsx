import { memo } from "react";
import { PageTransition } from "../../components/PageTransition";
import { useProfile } from "../../hooks/useProfile";
import styles from "./Profile.module.css";

function ProfileComponent() {
  const { user, loading, error } = useProfile();

  if (loading) {
    return <div className={styles.state}>Загрузка профиля...</div>;
  }

  if (error) {
    return (
      <div className={`${styles.state} ${styles.error}`}>
        Ошибка загрузки профиля: {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.state}>
        Данные профиля недоступны.
      </div>
    );
  }

  const accessLabel = user.readOnly ? "Только просмотр" : "Полный доступ";

  return (
    <PageTransition>
      <div className={styles.root}>
        <h2 className={styles.heading}>Профиль</h2>

        <div className={styles.grid}>
          <section className={styles.card}>
            <span className={styles.fieldLabel}>Логин</span>
            <span className={styles.value}>{user.login}</span>

            <span className={styles.fieldLabel}>ID аккаунта</span>
            <span className={styles.value}>{user.id}</span>
          </section>

          <section className={styles.card}>
            <span className={styles.fieldLabel}>Номер клиента</span>
            <span className={styles.value}>{user.client}</span>

            <span className={styles.fieldLabel}>Договор</span>
            <span className={styles.value}>{user.contract}</span>
          </section>

          <section className={styles.card}>
            <span className={styles.fieldLabel}>Телефон</span>
            <span className={styles.value}>{user.phone}</span>

            <span className={styles.fieldLabel}>Email</span>
            <span className={styles.value}>{user.email}</span>
          </section>

          <section className={styles.card}>
            <span className={styles.fieldLabel}>Режим доступа</span>
            <span className={styles.value}>{accessLabel}</span>

            <span className={styles.fieldLabel}>Последняя активность</span>
            <span className={styles.value}>{user.lastActivity}</span>
          </section>
        </div>

        <span className={styles.badge}>
          Аккаунт №{user.id} - {accessLabel}
        </span>
      </div>
    </PageTransition>
  );
}

export default memo(ProfileComponent);
