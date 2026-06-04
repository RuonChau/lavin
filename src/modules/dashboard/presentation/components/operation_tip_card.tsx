import type { OperationTipCardProps } from '../../types/dashboard-component-props.type';
import { GlassCard } from '@/shared/components/GlassCard';

export function OperationTipCard({ tip }: OperationTipCardProps) {
  return (
    <GlassCard className="border-primary/20 bg-primary/10 p-6">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">Mẹo vận hành</h3>
      <p className="text-sm leading-relaxed text-text-secondary">{tip}</p>
    </GlassCard>
  );
}
