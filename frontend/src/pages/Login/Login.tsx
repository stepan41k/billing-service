import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { NetworkBackground } from '../../components/NetworkBackground';
import styles from './Login.module.css';

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
  animate: { transition: { staggerChildren: 0.065, delayChildren: 0.12 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
};

export default function Login() {
  const [login, setLogin]       = useState('');
  const [password, setPassword] = useState('');
  const { login: doLogin, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await doLogin({ login, password });
    if (ok) navigate('/profile');
  };

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
          <motion.h1 className={styles.title} variants={itemVariants}>Личный кабинет</motion.h1>

          <motion.label className={styles.field} variants={itemVariants}>
            <span>Логин</span>
            <input type="text" autoComplete="username"
              value={login} onChange={(e) => setLogin(e.target.value)}
              required disabled={loading} />
          </motion.label>

          <motion.label className={styles.field} variants={itemVariants}>
            <span>Пароль</span>
            <input type="password" autoComplete="current-password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              required disabled={loading} />
          </motion.label>

          {error && (
            <motion.p className={styles.error}
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.16 }}>
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit" className={styles.btn}
            disabled={loading || !login || !password}
            variants={itemVariants} whileTap={{ scale: 0.97 }}>
            {loading ? 'Вход…' : 'Войти'}
          </motion.button>

          <motion.p className={styles.signature} variants={itemVariants}>Максима</motion.p>
        </motion.div>
      </motion.form>

      {/* gap: 10px из .root — расстояние до кнопки */}
      <motion.div
        className={styles.switchWrap}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, delay: 0.36, ease: 'easeOut' }}
      >
        <Link to="/register" tabIndex={-1}>
          <button className={styles.switchBtn} type="button">Зарегистрироваться</button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

