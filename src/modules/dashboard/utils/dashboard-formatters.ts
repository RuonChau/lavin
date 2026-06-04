import { paymentStatusMap } from '../config/dashboard-status.config';
import type { Trend } from '../types/trend.type';

export function getTrend(value: number): Trend {
  if (value > 0) return 'up';
  if (value < 0) return 'down';
  return 'neutral';
}

export function getInverseTrend(value: number): Trend {
  if (value > 0) return 'down';
  if (value < 0) return 'up';
  return 'neutral';
}

export function formatPercentChange(value: number): string {
  if (value === 0) return '0%';
  return `${value > 0 ? '+' : ''}${value.toLocaleString('vi-VN')}%`;
}

export function formatSignedNumber(value: number): string {
  if (value === 0) return '0';
  return `${value > 0 ? '+' : ''}${value.toLocaleString('vi-VN')}`;
}

export function maskPhone(phone?: string): string {
  if (!phone) return '';
  if (phone.length < 7) return phone;
  return `${phone.slice(0, 4)}***${phone.slice(-3)}`;
}

export function formatPayment(method: string, paymentStatus: string): string {
  const normalizedMethod = method ? method.toUpperCase() : 'COD';
  return paymentStatusMap[paymentStatus] ?? normalizedMethod;
}
