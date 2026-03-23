import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpCircle, ArrowDownCircle, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usePaymentsStore } from '@/stores/payments-store';
import { formatCurrency, formatDate } from '@/lib/utils';
import PageTransition from '@/components/PageTransition/PageTransition';
import type { Payment } from '@/types';

const typeConfig = {
  deposit: { icon: ArrowUpCircle, color: 'text-success', bg: 'bg-success/10' },
  charge: { icon: ArrowDownCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
  refund: { icon: RotateCcw, color: 'text-primary', bg: 'bg-primary/10' },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
};

export default function Payments() {
  const { payments, loading, fetch } = usePaymentsStore();

  useEffect(() => { fetch(); }, [fetch]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <h1 className="text-xl font-semibold text-foreground">Платежи</h1>
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
          {payments.map((p: Payment) => {
            const cfg = typeConfig[p.type];
            const Icon = cfg.icon;
            return (
              <motion.div key={p.id} variants={item}>
                <Card className="hover:border-primary/20 transition-colors">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${cfg.bg} ${cfg.color}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(p.date)} · Договор #{p.contractNumber}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${p.amount >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {p.amount >= 0 ? '+' : ''}{formatCurrency(p.amount)}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </PageTransition>
  );
}
