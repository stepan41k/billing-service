import { useEffect, useCallback, memo, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: ReactNode;
}

export const Modal = memo(function Modal({ open, onClose, onConfirm, children }: Props) {
  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [open, onClose]);

  // lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const stopProp = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

  if (!open) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal>
      <div className={styles.panel} onClick={stopProp}>
        <div className={styles.body}>{children}</div>
        <div className={styles.footer}>
          <button className={styles.cancel} onClick={onClose}>Отмена</button>
          <button className={styles.confirm} onClick={onConfirm}>Подключить</button>
        </div>
      </div>
    </div>,
    document.body
  );
});

