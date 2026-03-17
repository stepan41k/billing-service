import {
  useState,
  useCallback,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { useRegister } from "../../hooks/useRegister";
import { NetworkBackground } from "../../components/NetworkBackground";
import styles from "./Register.module.css";

const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.28, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 1.012,
    filter: "blur(3px)",
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
};

const cardVariants: Variants = {
  initial: { opacity: 0, y: 18, scale: 0.97 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
  },
};

const containerVariants: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.055, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

interface RegisterForm {
  login: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
}

function sanitizePhone(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 10);
}

export default function Register() {
  const [form, setForm] = useState<RegisterForm>({
    login: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [success, setSuccess] = useState(false);

  const { register, loading, error } = useRegister();
  const navigate = useNavigate();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handlePhone = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const next = sanitizePhone(e.target.value);
    setForm(prev => ({ ...prev, phone: next }));
  }, []);

  const isValid =
    form.login.length >= 3 &&
    form.password.length >= 6 &&
    form.password === form.confirm &&
    form.email.includes("@");

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!isValid || loading) return;

      const ok = await register({
        login: form.login,
        password: form.password,
        email: form.email,
        phone: form.phone ? `7${form.phone}` : "",
      });

      if (ok) {
        setSuccess(true);
        setTimeout(() => navigate("/login", { replace: true }), 1800);
      }
    },
    [form, isValid, loading, navigate, register],
  );

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
          className={styles.fields}
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.h1 className={styles.title} variants={itemVariants}>
            Регистрация
          </motion.h1>

          <motion.label className={styles.field} variants={itemVariants}>
            <span>Логин</span>
            <input
              name="login"
              type="text"
              autoComplete="username"
              value={form.login}
              onChange={handleChange}
              required
              disabled={disabled}
            />
          </motion.label>

          <motion.label className={styles.field} variants={itemVariants}>
            <span>Email</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={disabled}
            />
          </motion.label>

          <motion.label className={styles.field} variants={itemVariants}>
            <span>Телефон</span>
            <div className={styles.phoneWrap}>
              <span className={styles.phonePrefix}>+7</span>
              <input
                name="phone"
                type="tel"
                className={styles.phoneInput}
                autoComplete="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={handlePhone}
                maxLength={10}
                disabled={disabled}
              />
            </div>
          </motion.label>

          <motion.label className={styles.field} variants={itemVariants}>
            <span>Пароль</span>
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={disabled}
            />
          </motion.label>

          <motion.label className={styles.field} variants={itemVariants}>
            <span>Повтор пароля</span>
            <input
              name="confirm"
              type="password"
              autoComplete="new-password"
              value={form.confirm}
              onChange={handleChange}
              required
              disabled={disabled}
            />
          </motion.label>

          {error && (
            <motion.p
              className={styles.error}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.16 }}
            >
              {error}
            </motion.p>
          )}

          {success && (
            <motion.p
              className={styles.success}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              Аккаунт создан, перенаправляем на страницу входа...
            </motion.p>
          )}

          <motion.button
            type="submit"
            className={styles.btn}
            disabled={disabled || !isValid}
            variants={itemVariants}
            whileTap={!disabled && isValid ? { scale: 0.97 } : undefined}
          >
            {loading ? "Создание..." : "Зарегистрироваться"}
          </motion.button>

          <motion.div
            className={styles.switchWrap}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, delay: 0.42, ease: "easeOut" }}
          >
            <Link to="/login" tabIndex={disabled ? -1 : 0}>
              <button type="button" className={styles.switchBtn}>
                Уже есть аккаунт
              </button>
            </Link>
          </motion.div>

          <motion.p className={styles.signature} variants={itemVariants}>
            Регистрация доступа к биллингу Maxima
          </motion.p>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
