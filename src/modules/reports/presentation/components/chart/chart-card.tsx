import { ChartCardProps } from "@/modules/reports/types/ChartCardProps";
import { cn } from "@/shared/utils/cn";
import { Card } from "antd";
import { BarChart3 } from "lucide-react";

export default function ChartCard({ title, subtitle, children, className }: ChartCardProps) {
  return (
    <Card className={cn('report-card h-full min-w-0 border-primary-soft/25! shadow-[0_14px_38px_rgba(91,58,41,0.08)]!', className)}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-black text-text-primary">{title}</h3>
          <p className="mt-1 text-xs font-semibold text-text-muted">{subtitle}</p>
        </div>
        <BarChart3 size={20} className="text-primary" />
      </div>
      {children}
    </Card>
  );
}
