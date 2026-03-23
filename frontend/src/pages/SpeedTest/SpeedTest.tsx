import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gauge, ArrowDown, ArrowUp, Timer, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSpeedTestStore } from '@/stores/speedtest-store';
import { formatDateTime } from '@/lib/utils';
import PageTransition from '@/components/PageTransition/PageTransition';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
};

export default function SpeedTest() {
  const { results, running, loading, fetch, run } = useSpeedTestStore();

  useEffect(() => { fetch(); }, [fetch]);

  const latest = results[0];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Тест скорости</h1>
          <Button onClick={run} disabled={running} size="sm">
            <Play size={14} className={`mr-1.5 ${running ? 'animate-spin' : ''}`} />
            {running ? 'Тестирование...' : 'Запустить тест'}
          </Button>
        </div>

        {/* Current speed cards */}
        {latest && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Card className="border-success/20 bg-success/5">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                  <ArrowDown size={18} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Загрузка</p>
                  <p className="text-lg font-bold text-success">{latest.downloadMbps.toFixed(1)} <span className="text-xs font-normal">Мбит/с</span></p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ArrowUp size={18} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Отдача</p>
                  <p className="text-lg font-bold text-primary">{latest.uploadMbps.toFixed(1)} <span className="text-xs font-normal">Мбит/с</span></p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-warning/20 bg-warning/5">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                  <Timer size={18} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Пинг</p>
                  <p className="text-lg font-bold text-warning">{latest.pingMs} <span className="text-xs font-normal">мс</span></p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Running animation */}
        {running && (
          <Card className="overflow-hidden">
            <CardContent className="flex items-center justify-center p-8">
              <motion.div
                className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              >
                <Gauge size={32} className="text-primary" />
              </motion.div>
            </CardContent>
          </Card>
        )}

        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">История тестов</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && results.length === 0 ? (
              <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
            ) : (
              <motion.div variants={container} initial="hidden" animate="show">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs text-muted-foreground">
                        <th className="pb-2 pr-4">Дата</th>
                        <th className="pb-2 pr-4">Загрузка</th>
                        <th className="pb-2 pr-4">Отдача</th>
                        <th className="pb-2 pr-4">Пинг</th>
                        <th className="pb-2">Сервер</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r) => (
                        <motion.tr key={r.id} variants={item} className="border-b border-border/50 last:border-0">
                          <td className="py-2.5 pr-4 text-muted-foreground">{formatDateTime(r.date)}</td>
                          <td className="py-2.5 pr-4 font-medium text-success">{r.downloadMbps.toFixed(1)}</td>
                          <td className="py-2.5 pr-4 font-medium text-primary">{r.uploadMbps.toFixed(1)}</td>
                          <td className="py-2.5 pr-4 font-medium text-warning">{r.pingMs} мс</td>
                          <td className="py-2.5 text-foreground">{r.server}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
