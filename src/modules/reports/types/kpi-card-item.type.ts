import type { ElementType } from 'react';

export interface IKpiCardItem {
  label: string;
  value: string;
  sub: string;
  growth?: number;
  icon: ElementType;
  color: string;
}