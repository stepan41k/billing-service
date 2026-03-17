import { memo, type ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';

interface Props {
  children: ReactNode;
  className?: string;
}

// staggerChildren — каждый ребёнок появляется с задержкой 0.05s
const listVariants: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
};

export const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 10, scale: 0.98 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const AnimatedList = memo(function AnimatedList({ children, className }: Props) {
  return (
    <motion.div
      className={className}
      variants={listVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
});

