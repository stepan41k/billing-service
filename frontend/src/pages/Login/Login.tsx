import {
  useState,
  useCallback,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { NetworkBackground } from "../../components/NetworkBackground";
import styles from "./Login.module.css";

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
    transition: { staggerChildren: 0.065, delayChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: "easeOut" },
  },
};

interface LoginForm {
  login: string;
  password: string;
}

export default function Login() {
  const [form, setForm] = useState<LoginForm>({ login: "", password: "" });
  const { login: doLogin, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!form.login || !form.password || loading) return;

      const ok = await doLogin({ login: form.login, password: form.password });
      if (ok) {
        navigate("/profile", { replace: true });
      }
    },
    [doLogin, form.login, form.password, loading, navigate],
  );

  const disabled = loading || !form.login || !form.password;

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
            Вход в личный кабинет
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
              disabled={loading}
            />
          </motion.label>

          <motion.label className={styles.field} variants={itemVariants}>
            <span>Пароль</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
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

          <motion.button
            type="submit"
            className={styles.btn}
            disabled={disabled}
            variants={itemVariants}
            whileTap={!disabled ? { scale: 0.97 } : undefined}
          >
            {loading ? "Вход..." : "Войти"}
          </motion.button>

          <motion.p className={styles.signature} variants={itemVariants}>
            Нет аккаунта?{" "}
            <Link to="/register" tabIndex={disabled ? -1 : 0}>
              Зарегистрироваться
            </Link>
          </motion.p>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
