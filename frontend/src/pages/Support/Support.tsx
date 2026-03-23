import { useEffect, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, Plus, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useSupportStore } from '@/stores/support-store';
import { formatDateTime, cn } from '@/lib/utils';
import PageTransition from '@/components/PageTransition/PageTransition';

const statusMap = {
  open: { label: 'Открыт', variant: 'default' as const },
  in_progress: { label: 'В работе', variant: 'warning' as const },
  resolved: { label: 'Решён', variant: 'success' as const },
  closed: { label: 'Закрыт', variant: 'secondary' as const },
};

const priorityMap = {
  low: { label: 'Низкий', variant: 'secondary' as const },
  medium: { label: 'Средний', variant: 'warning' as const },
  high: { label: 'Высокий', variant: 'destructive' as const },
};

export default function Support() {
  const { tickets, loading, fetch, create, reply } = useSupportStore();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newText, setNewText] = useState('');
  const [replyText, setReplyText] = useState('');

  useEffect(() => { fetch(); }, [fetch]);

  const onCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newText.trim()) return;
    await create(newSubject.trim(), newText.trim());
    setNewSubject('');
    setNewText('');
    setShowNew(false);
  };

  const onReply = async (ticketId: number) => {
    if (!replyText.trim()) return;
    await reply(ticketId, replyText.trim());
    setReplyText('');
  };

  if (loading && tickets.length === 0) {
    return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}</div>;
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Поддержка</h1>
          <Button size="sm" onClick={() => setShowNew((v) => !v)}>
            <Plus size={14} className="mr-1.5" />
            Новое обращение
          </Button>
        </div>

        {/* New ticket form */}
        <AnimatePresence>
          {showNew && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Card>
                <CardContent className="p-4">
                  <form onSubmit={onCreateSubmit} className="space-y-3">
                    <Input placeholder="Тема обращения" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} />
                    <textarea
                      className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px] resize-y"
                      placeholder="Опишите проблему..."
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" type="button" onClick={() => setShowNew(false)}>Отмена</Button>
                      <Button size="sm" type="submit">Отправить</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tickets */}
        <div className="space-y-3">
          {tickets.map((t) => {
            const st = statusMap[t.status];
            const pr = priorityMap[t.priority];
            const isOpen = expanded === t.id;
            return (
              <Card key={t.id} className="overflow-hidden">
                <button onClick={() => setExpanded((v) => v === t.id ? null : t.id)} className="flex w-full items-center justify-between p-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <MessageCircle size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">#{t.id} - {t.subject}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(t.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={pr.variant}>{pr.label}</Badge>
                    <Badge variant={st.variant}>{st.label}</Badge>
                    <ChevronDown size={16} className={cn('text-muted-foreground transition-transform duration-200', isOpen && 'rotate-180')} />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <CardContent className="border-t border-border pt-4 space-y-3">
                        {t.messages.map((m) => (
                          <div key={m.id} className={cn('rounded-lg p-3 text-sm', m.sender === 'user' ? 'bg-primary/5 ml-6' : 'bg-muted mr-6')}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-muted-foreground">{m.sender === 'user' ? 'Вы' : 'Поддержка'}</span>
                              <span className="text-xs text-muted-foreground">{formatDateTime(m.createdAt)}</span>
                            </div>
                            <p className="text-foreground">{m.text}</p>
                          </div>
                        ))}
                        {t.status !== 'closed' && (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Ваш ответ..."
                              value={expanded === t.id ? replyText : ''}
                              onChange={(e) => setReplyText(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') onReply(t.id); }}
                            />
                            <Button size="icon" onClick={() => onReply(t.id)}><Send size={14} /></Button>
                          </div>
                        )}
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
