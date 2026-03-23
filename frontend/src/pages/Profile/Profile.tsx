import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, FileText, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfileStore } from '@/stores/profile-store';
import { useBalanceStore } from '@/stores/balance-store';
import { formatCurrency } from '@/lib/utils';
import PageTransition from '@/components/PageTransition/PageTransition';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

export default function Profile() {
  const { user, loading, fetch } = useProfileStore();
  const { balance, fetch: fetchBalance } = useBalanceStore();

  useEffect(() => { fetch(); fetchBalance(); }, [fetch, fetchBalance]);

  if (loading || !user) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  const fields = [
    { icon: User, label: 'Логин', value: user.login },
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Phone, label: 'Телефон', value: user.phone },
    { icon: FileText, label: 'Договор', value: `#${user.contract}` },
    { icon: Clock, label: 'Последняя активность', value: user.lastActivity },
    { icon: User, label: 'Клиент', value: `#${user.client}` },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Профиль</h1>
          {user.readOnly && <Badge variant="warning">Только чтение</Badge>}
        </div>

        {/* Balance card */}
        {balance && (
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs text-muted-foreground">Баланс</p>
                <p className={`text-2xl font-bold ${balance.amount >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(balance.amount)}
                </p>
              </div>
              <Badge variant={balance.amount >= 0 ? 'success' : 'destructive'}>
                {balance.amount >= 0 ? 'Активен' : 'Задолженность'}
              </Badge>
            </CardContent>
          </Card>
        )}

        {/* Info grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {fields.map(({ icon: Icon, label, value }) => (
            <motion.div key={label} variants={item}>
              <Card className="hover:border-primary/30 transition-colors">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="truncate text-sm font-medium text-foreground">{value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageTransition>
  );
}
