import { Sun, Moon, LogOut } from 'lucide-react';
import { useThemeStore } from '@/stores/theme-store';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';
import { useBalanceStore } from '@/stores/balance-store';
import { formatCurrency } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { theme, toggle } = useThemeStore();
  const logout = useAuthStore((s) => s.logout);
  const user = useProfileStore((s) => s.user);
  const balance = useBalanceStore((s) => s.balance);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-header-border bg-header px-6">
      <div className="flex items-center gap-3 text-sm">
        {user && (
          <span className="text-muted-foreground">
            {user.login}
            <span className="mx-2 text-border">|</span>
            Клиент #{user.clientNumber}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {balance && (
          <span
            className={`mr-3 text-sm font-medium ${balance.amount >= 0 ? 'text-success' : 'text-destructive'}`}
          >
            {formatCurrency(balance.amount)}
          </span>
        )}
        <button
          onClick={toggle}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Сменить тему"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          onClick={handleLogout}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Выйти"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
