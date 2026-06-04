import { GlassCard } from "@/shared/components/GlassCard";
import { cn } from "@/shared/utils/cn";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { KPIStatCardProps } from "../../types/kpi-stat-card-props.type";

export function KPIStatCard({
  title,
  value,
  change,
  trend,
  icon,
  variant = 'default',
}: KPIStatCardProps) {
  return (
    <GlassCard className="p-5">
      <div className="mb-4 flex items-start justify-between">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-2xl border',
            variant === 'warning'
              ? 'border-caramel/20 bg-caramel/10 text-caramel'
              : 'border-primary/20 bg-primary/10 text-primary',
          )}
        >
          {icon}
        </div>
        <div
          className={cn(
            'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold',
            trend === 'up' && 'bg-mint/10 text-mint',
            trend === 'down' && 'bg-berry/10 text-berry',
            trend === 'neutral' && 'bg-primary/10 text-primary',
          )}
        >
          {trend === 'up' && <ArrowUpRight size={14} />}
          {trend === 'down' && <ArrowDownRight size={14} />}
          {change}
        </div>
      </div>

      <p className="text-xs font-bold uppercase tracking-widest text-text-muted">{title}</p>
      <h3 className="mt-1 text-[28px] font-bold tracking-tight text-text-primary">{value}</h3>
    </GlassCard>
  );
}
