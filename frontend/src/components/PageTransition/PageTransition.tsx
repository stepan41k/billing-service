import { memo, type ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';

interface Props { children: ReactNode }

const variants: Variants = {
  initial: { opacity: 0, y: 8,  filter: 'blur(2px)'  },
  animate: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0, y: -5, filter: 'blur(2px)',
    transition: { duration: 0.14, ease: [0.4, 0, 1, 1] },
  },
};

export const PageTransition = memo(function PageTransition({ children }: Props) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ willChange: 'opacity, transform, filter' }}
    >
      {children}
    </motion.div>
  );
});

