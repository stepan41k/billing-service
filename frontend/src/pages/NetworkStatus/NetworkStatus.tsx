import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wrench, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useNetworkStore } from '@/stores/network-store';
import { formatDateTime } from '@/lib/utils';
import PageTransition from '@/components/PageTransition/PageTransition';
import type { NetworkEvent } from '@/types';

const typeConfig: Record<NetworkEvent['type'], { icon: typeof Wrench; label: string; variant: 'warning' | 'destructive' | 'success' | 'default'; color: string }> = {
  maintenance: { icon: Wrench, label: 'Работы', variant: 'warning', color: 'text-warning bg-warning/10' },
  outage: { icon: AlertTriangle, label: 'Авария', variant: 'destructive', color: 'text-destructive bg-destructive/10' },
  resolved: { icon: CheckCircle, label: 'Решено', variant: 'success', color: 'text-success bg-success/10' },
  degraded: { icon: Info, label: 'Информация', variant: 'default', color: 'text-primary bg-primary/10' },
  info:        { icon: Info,         label: 'Инфо',      variant: 'default'     as const, color: 'text-primary bg-primary/10' },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

export default function NetworkStatus() {
  const { events, loading, fetch } = useNetworkStore();

  useEffect(() => { fetch(); }, [fetch]);

  if (loading) {
    return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}</div>;
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <h1 className="text-xl font-semibold text-foreground">Состояние сети</h1>

        {/* Status bar */}
        <Card className="border-success/20 bg-success/5">
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle size={18} className="text-success" />
            <span className="text-sm font-medium text-success">Все системы работают штатно</span>
          </CardContent>
        </Card>

        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          {events.map((ev: NetworkEvent) => {
            const cfg = typeConfig[ev.type];
            const Icon = cfg.icon;
            return (
              <motion.div key={ev.id} variants={item}>
                <Card className="hover:border-primary/20 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${cfg.color}`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">{ev.title}</p>
                          <Badge variant={cfg.variant}>{cfg.label}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{ev.description}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span>Начало: {formatDateTime(ev.startedAt)}</span>
                          {ev.resolvedAt && <span>Конец: {formatDateTime(ev.resolvedAt)}</span>}
                          <span>Район: {ev.description}</span>
                        </div>
                      </div>
                    </div>
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
