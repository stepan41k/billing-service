import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Settings, Megaphone, AlertCircle, CheckCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useNotificationsStore } from '@/stores/notifications-store'
import { formatDateTime, cn } from '@/lib/utils'
import PageTransition from '@/components/PageTransition/PageTransition'
import type { AppNotification } from '@/types'

const typeConfig: Record<AppNotification['type'], { icon: React.ElementType; color: string }> = {
  payment: { icon: CreditCard,   color: 'text-success bg-success/10'     },
  system:  { icon: Settings,     color: 'text-primary bg-primary/10'     },
  promo:   { icon: Megaphone,    color: 'text-warning bg-warning/10'     },
  alert:   { icon: AlertCircle,  color: 'text-destructive bg-destructive/10' },
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
const item = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } } }

export default function Notifications() {
  const { items, loading, unreadCount, fetch, markRead, markAllRead } = useNotificationsStore()

  useEffect(() => { fetch() }, [fetch])

  if (loading && items.length === 0)
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
      </div>
    )

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-foreground">Уведомления</h1>
            {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead}>
              <CheckCheck size={14} className="mr-1.5" />
              Прочитать все
            </Button>
          )}
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
          {items.map((n: AppNotification) => {
            const cfg = typeConfig[n.type] ?? typeConfig["system"]
            const Icon = cfg.icon
            return (
              <motion.div key={n.id} variants={item}>
                <Card
                  className={cn(
                    'cursor-pointer transition-colors hover:border-primary/20',
                    !n.read && 'border-l-2 border-l-primary bg-primary/[0.02]'
                  )}
                  onClick={() => { if (!n.read) markRead(n.id) }}
                >
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-md', cfg.color)}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn('text-sm font-medium', n.read ? 'text-muted-foreground' : 'text-foreground')}>
                          {n.title}
                        </p>
                        <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(n.createdAt)}</span>
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                    </div>
                    {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
          {!items.length && <p className="text-sm text-muted-foreground">Нет уведомлений</p>}
        </motion.div>
      </div>
    </PageTransition>
  )
}
