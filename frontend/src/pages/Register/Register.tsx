import { useState, type FormEvent } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Sun, Moon } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useThemeStore } from '@/stores/theme-store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import NetworkBackground from '@/components/NetworkBackground/NetworkBackground'

export default function Register() {
  const { isAuth, loading, error, register } = useAuthStore()
  const { theme, toggle } = useThemeStore()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    login: '',
    password: '',
    confirmPassword: '',
    email: '',
    phoneNumber: '',
    clientNumber: '',
    contractNumber: '',
  })
  const [showPw, setShowPw] = useState(false)
  const [localError, setLocalError] = useState('')

  if (isAuth) return <Navigate to="/profile" replace />

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLocalError('')

    if (form.password !== form.confirmPassword) {
      setLocalError('Пароли не совпадают')
      return
    }

    if (form.password.length < 6) {
      setLocalError('Пароль минимум 6 символов')
      return
    }

    const ok = await register({
      login: form.login,
      password: form.password,
      email: form.email,
      phoneNumber: form.phoneNumber,
      clientNumber: form.clientNumber,
      contractNumber: form.contractNumber,
    })

    if (ok) navigate('/login')
  }

  const fieldErr = localError || error

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <NetworkBackground />

      <button
        onClick={toggle}
        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card/80 text-muted-foreground transition-colors backdrop-blur-sm hover:text-foreground"
        aria-label="Тема"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="relative z-10 w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg">
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label htmlFor="reg-login" className="mb-1 block text-xs font-medium text-muted-foreground">
              Логин
            </label>
            <Input
              id="reg-login"
              value={form.login}
              onChange={e => setForm(f => ({ ...f, login: e.target.value }))}
              required
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="mb-1 block text-xs font-medium text-muted-foreground">
              Email
            </label>
            <Input
              id="reg-email"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <label htmlFor="reg-phone" className="mb-1 block text-xs font-medium text-muted-foreground">
              Телефон
            </label>
            <Input
              id="reg-phone"
              type="tel"
              value={form.phoneNumber}
              onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
              placeholder="+7 999 000-00-00"
              required
            />
          </div>

          <div>
            <label htmlFor="reg-client" className="mb-1 block text-xs font-medium text-muted-foreground">
              Лицевой счёт
            </label>
            <Input
              id="reg-client"
              value={form.clientNumber}
              onChange={e => setForm(f => ({ ...f, clientNumber: e.target.value }))}
              required
            />
          </div>

          <div>
            <label htmlFor="reg-contract" className="mb-1 block text-xs font-medium text-muted-foreground">
              Номер договора
            </label>
            <Input
              id="reg-contract"
              value={form.contractNumber}
              onChange={e => setForm(f => ({ ...f, contractNumber: e.target.value }))}
              required
            />
          </div>

          <div>
            <label htmlFor="reg-pw" className="mb-1 block text-xs font-medium text-muted-foreground">
              Пароль
            </label>
            <div className="relative">
              <Input
                id="reg-pw"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="reg-pw2" className="mb-1 block text-xs font-medium text-muted-foreground">
              Подтверждение пароля
            </label>
            <Input
              id="reg-pw2"
              type={showPw ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
              required
            />
          </div>

          {fieldErr && <p className="text-xs text-destructive">{fieldErr}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '...' : 'Зарегистрироваться'}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Войти
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
