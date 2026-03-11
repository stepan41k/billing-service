import { useState, useCallback, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRegister } from '../../hooks/useRegister';
import { NetworkBackground } from '../../components/NetworkBackground';
import styles from './Register.module.css';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.28, ease: 'easeOut' } },
  exit:    { opacity: 0, scale: 1.012, filter: 'blur(3px)',
             transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } },
};

const cardVariants = {
  initial: { opacity: 0, y: 18, scale: 0.97 },
  animate: { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] } },
};

const containerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
};

// Разрешаем только цифры после +7, максимум 10 цифр (без +7)
function sanitizePhone(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 10);
}

export default function Register() {
  const [form, setForm] = useState({
    login: '', password: '', confirm: '', email: '', phone: '',
  });
  const [success, setSuccess] = useState(false);
  const { register, loading, error } = useRegister();
  const navigate = useNavigate();

  const set = useCallback(
    (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value })),
    []
  );

  // Обработка поля телефона — только цифры после +7
  const handlePhone = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, phone: sanitizePhone(e.target.value) }));
  }, []);

  const isValid =
    form.login.length >= 3 &&
    form.password.length >= 6 &&
    form.password === form.confirm &&
    form.email.includes('@');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    const ok = await register({
      login:    form.login,
      password: form.password,
      email:    form.email,
      phone:    form.phone ? `+7${form.phone}` : '',
    });
    if (ok) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1800);
    }
  };

  const disabled = loading || success;

  return (
    <motion.div
      className={styles.root}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <NetworkBackground />

      <motion.form
        className={styles.card}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        onSubmit={handleSubmit}
        noValidate
      >
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className={styles.fields}
        >
          <motion.h1 className={styles.title} variants={itemVariants}>Регистрация</motion.h1>

          <motion.label className={styles.field} variants={itemVariants}>
            <span>Логин</span>
            <input type="text" autoComplete="username"
              value={form.login} onChange={set('login')}
              required disabled={disabled} />
          </motion.label>

          <motion.label className={styles.field} variants={itemVariants}>
            <span>Email</span>
            <input type="email" autoComplete="email"
              value={form.email} onChange={set('email')}
              required disabled={disabled} />
          </motion.label>

          {/* Телефон — статичный +7 prefix, пользователь вводит только цифры */}
          <motion.div className={styles.field} variants={itemVariants}>
            <span>Телефон</span>
            <div className={styles.phoneWrap}>
              <span className={styles.phonePrefix}>+7</span>
              <input
                type="tel"
                className={styles.phoneInput}
                autoComplete="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={handlePhone}
                disabled={disabled}
                maxLength={10}
              />
            </div>
          </motion.div>

          <motion.label className={styles.field} variants={itemVariants}>
            <span>Пароль</span>
            <input type="password" autoComplete="new-password"
              value={form.password} onChange={set('password')}
              required disabled={disabled} />
          </motion.label>

          <motion.label className={styles.field} variants={itemVariants}>
            <span>Повторите пароль</span>
            <input type="password" autoComplete="new-password"
              value={form.confirm} onChange={set('confirm')}
              required disabled={disabled} />
          </motion.label>

          {error && (
            <motion.p className={styles.error}
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.16 }}>
              {error}
            </motion.p>
          )}

          {success && (
            <motion.p className={styles.success}
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}>
              Регистрация прошла успешно. Переход на вход…
            </motion.p>
          )}

          <motion.button
            type="submit" className={styles.btn}
            disabled={disabled || !isValid}
            variants={itemVariants} whileTap={{ scale: 0.97 }}>
            {loading ? 'Регистрация…' : 'Создать аккаунт'}
          </motion.button>

          <motion.p className={styles.signature} variants={itemVariants}>Максима</motion.p>
        </motion.div>
      </motion.form>

      <motion.div
        className={styles.switchWrap}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, delay: 0.42, ease: 'easeOut' }}
      >
        <Link to="/login" tabIndex={-1}>
          <button className={styles.switchBtn} type="button">
            Уже есть аккаунт — Войти
          </button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

