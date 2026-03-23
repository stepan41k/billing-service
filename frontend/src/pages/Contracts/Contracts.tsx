import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, MapPin, Calendar, Banknote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useContractsStore } from '@/stores/contracts-store';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import PageTransition from '@/components/PageTransition/PageTransition';
import type { Contract } from '@/types';

const statusMap = {
  active: { label: 'Активен', variant: 'success' as const },
  suspended: { label: 'Приостановлен', variant: 'warning' as const },
  closed: { label: 'Закрыт', variant: 'destructive' as const },
};

export default function Contracts() {
  const { contracts, loading, fetch } = useContractsStore();
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => { fetch(); }, [fetch]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
      </div>
    );
  }

  const toggle = (id: number) => setExpanded((v) => (v === id ? null : id));

  return (
    <PageTransition>
      <div className="space-y-6">
        <h1 className="text-xl font-semibold text-foreground">Договоры</h1>
        <div className="space-y-3">
          {contracts.map((c: Contract) => {
            const st = statusMap[c.status];
            const isOpen = expanded === c.id;
            return (
              <Card key={c.id} className="overflow-hidden transition-colors hover:border-primary/20">
                <button
                  onClick={() => toggle(c.id)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Zap size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        #{c.number} - {c.tariff}
                      </p>
                      <p className="text-xs text-muted-foreground">{c.speedMbps} Мбит/с</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={st.variant}>{st.label}</Badge>
                    <ChevronDown
                      size={16}
                      className={cn('text-muted-foreground transition-transform duration-200', isOpen && 'rotate-180')}
                    />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <CardContent className="border-t border-border pt-4">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin size={14} className="text-muted-foreground" />
                            <span className="text-muted-foreground">Адрес:</span>
                            <span className="text-foreground">{c.address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Banknote size={14} className="text-muted-foreground" />
                            <span className="text-muted-foreground">Стоимость:</span>
                            <span className="text-foreground">{formatCurrency(c.pricePerMonth)}/мес</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar size={14} className="text-muted-foreground" />
                            <span className="text-muted-foreground">Дата:</span>
                            <span className="text-foreground">{formatDate(c.created)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Zap size={14} className="text-muted-foreground" />
                            <span className="text-muted-foreground">Трафик:</span>
                            <span className="text-foreground">
                              {c.unlimitedTraffic ? 'Безлимит' : `${c.trafficLimitGb} ГБ`}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
