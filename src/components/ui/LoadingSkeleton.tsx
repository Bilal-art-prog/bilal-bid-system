import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function LoadingSkeleton({
  className = '',
  variant = 'rectangular',
}: LoadingSkeletonProps) {
  const baseStyles = 'skeleton rounded';

  const variants = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'h-24 w-full',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card rounded-xl p-6 space-y-4">
      <LoadingSkeleton className="h-4 w-1/3" />
      <LoadingSkeleton className="h-8 w-2/3" variant="text" />
      <div className="space-y-2">
        <LoadingSkeleton className="h-3 w-full" variant="text" />
        <LoadingSkeleton className="h-3 w-4/5" variant="text" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="glass-card rounded-lg p-4 flex items-center gap-4"
        >
          <LoadingSkeleton className="h-10 w-10 rounded-full" variant="circular" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton className="h-4 w-1/4" variant="text" />
            <LoadingSkeleton className="h-3 w-1/2" variant="text" />
          </div>
          <LoadingSkeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}
