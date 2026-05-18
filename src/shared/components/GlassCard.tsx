'use client';

import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/shared/utils/cn';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  blur?: 16 | 24 | 32;
  radius?: 'xl' | '2xl' | '3xl' | '4xl';
  className?: string;
}

export function GlassCard({
  children,
  blur = 24,
  radius = '3xl',
  className,
  ...props
}: GlassCardProps) {
  const radiusClass = {
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    '4xl': 'rounded-4xl',
  }[radius];

  return (
    <motion.div
      className={cn('glass-card', radiusClass, 'overflow-hidden', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
