import type { ReactNode } from 'react';
import type { Trend } from './trend.type';

export interface KPIStatCardProps {
  title: string;
  value: string;
  change: string;
  trend: Trend;
  icon: ReactNode;
  variant?: 'default' | 'warning';
}
