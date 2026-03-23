import { useState, type FormEvent } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NetworkBackground from '@/components/NetworkBackground/NetworkBackground';
import { useAuthStore } from '@/stores/auth-store';
import { useThemeStore } from '@/stores/theme-store';

export default function Register() {
  const { isAuth, loading, error, register } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ login: '', password: '', confirmPassword: '', email: '', phone: '' });
  const [showPw, setShowPw] = useState(false);
  const [localError, setLocalError] = useState('');

  if (isAuth) return <Navigate to="/profile" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (form.password !== form.confirmPassword) {
      setLocalError('Пароли не совпадают');
      return;
    }
    if (form.password.length < 6) {
      setLocalError('Пароль минимум 6 символов');
      return;
    }
    const ok = await register({
      login: form.login,
      password: form.password,
      email: form.email,
      phone: form.phone,
    });
    if (ok) navigate('/login');
  };

  const fieldErr = localError || error;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <NetworkBackground />
      <button
        onClick={toggle}
        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card/80 text-muted-foreground hover:text-foreground transition-colors backdrop-blur-sm"
        aria-label="Сменить тему"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm rounded-xl border border-border bg-card/90 p-8 backdrop-blur-md"
      >
        <div className="mb-6 flex flex-col items-center gap-2">
          <svg width="40" height="40" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" className="fill-primary" />
            <path d="M7 20V8l4 6 4-6v12M19 8v12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 className="text-lg font-semibold text-foreground">Регистрация</h1>
          <p className="text-xs text-muted-foreground">Создать личный кабинет</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label htmlFor="reg-login" className="mb-1 block text-xs font-medium text-muted-foreground">Логин</label>
            <Input id="reg-login" value={form.login} onChange={(e) => setForm((f) => ({ ...f, login: e.target.value }))} required />
          </div>
          <div>
            <label htmlFor="reg-email" className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
            <Input id="reg-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
          </div>
          <div>
            <label htmlFor="reg-phone" className="mb-1 block text-xs font-medium text-muted-foreground">Телефон</label>
            <Input id="reg-phone" type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+7 (___) ___-__-__" required />
          </div>
          <div>
            <label htmlFor="reg-pw" className="mb-1 block text-xs font-medium text-muted-foreground">Пароль</label>
            <div className="relative">
              <Input id="reg-pw" type={showPw ? 'text' : 'password'} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="reg-pw2" className="mb-1 block text-xs font-medium text-muted-foreground">Повтор пароля</label>
            <Input id="reg-pw2" type={showPw ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))} required />
          </div>
          {fieldErr && <p className="text-xs text-destructive">{fieldErr}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-primary hover:underline">Войти</Link>
        </p>
      </motion.div>
    </div>
  );
}
