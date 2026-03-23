import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NetworkBackground from '@/components/NetworkBackground/NetworkBackground';
import { useAuthStore } from '@/stores/auth-store';
import { useThemeStore } from '@/stores/theme-store';

export default function Login() {
  const { isAuth, loading, error, login } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const [form, setForm] = useState({ login: '', password: '' });
  const [showPw, setShowPw] = useState(false);

  if (isAuth) return <Navigate to="/profile" replace />;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(form);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <NetworkBackground />
      {/* Theme toggle */}
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
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <svg width="40" height="40" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" className="fill-primary" />
            <path d="M7 20V8l4 6 4-6v12M19 8v12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 className="text-lg font-semibold text-foreground">Максима</h1>
          <p className="text-xs text-muted-foreground">Личный кабинет</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="login" className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Логин
            </label>
            <Input
              id="login"
              value={form.login}
              onChange={(e) => setForm((f) => ({ ...f, login: e.target.value }))}
              placeholder="ivanov"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Пароль
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="password123"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Регистрация
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
