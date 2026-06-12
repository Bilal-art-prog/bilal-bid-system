import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusBadgeProps {
  status: StatusType;
  children: ReactNode;
  size?: 'sm' | 'md';
}

const statusStyles: Record<StatusType, string> = {
  success: 'bg-success/15 text-success border-success/20',
  warning: 'bg-warning/15 text-warning border-warning/20',
  error: 'bg-error/15 text-error border-error/20',
  info: 'bg-primary/15 text-primary border-primary/20',
  neutral: 'bg-muted text-muted-foreground border-border',
};

export default function StatusBadge({
  status,
  children,
  size = 'sm',
}: StatusBadgeProps) {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center rounded-full font-medium border ${statusStyles[status]} ${sizes[size]}`}
    >
      {children}
    </motion.span>
  );
}

export function GoNoGoBadge({ type }: { type: 'GO' | 'NO_GO' | 'CONDITIONAL' }) {
  const styles = {
    GO: 'bg-success/20 text-success border-success/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    NO_GO: 'bg-error/20 text-error border-error/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]',
    CONDITIONAL:
      'bg-warning/20 text-warning border-warning/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`inline-flex items-center px-4 py-2 rounded-lg font-bold text-lg border ${styles[type]}`}
    >
      {type.replace('_', ' ')}
    </motion.div>
  );
}
