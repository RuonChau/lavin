import { AlertCircle, Clock, Truck, LucideIcon } from 'lucide-react';

export interface SystemAlert {
  type: 'PENDING_APPROVAL' | 'SHIPPING_ACTIVE' | 'DEBT_WARNING' | string;
  title: string;
  desc: string;
}

export interface MappedAlert {
  title: string;
  desc: string;
  icon: LucideIcon;
  color: string;
}

export function mapSystemAlerts(systemAlerts: SystemAlert[] = []): MappedAlert[] {
  if (systemAlerts.length > 0) {
    return systemAlerts.map((alert) => {
      let icon: LucideIcon = AlertCircle;
      let color = 'bg-amber-50 border-amber-100 text-amber-500';

      if (alert.type === 'PENDING_APPROVAL') {
        icon = Clock;
        color = 'bg-amber-50 border-amber-100 text-amber-500';
      } else if (alert.type === 'SHIPPING_ACTIVE') {
        icon = Truck;
        color = 'bg-blue-50 border-blue-100 text-blue-500';
      } else if (alert.type === 'DEBT_WARNING') {
        icon = AlertCircle;
        color = 'bg-amber-50 border-amber-100 text-amber-500';
      }

      return {
        title: alert.title,
        desc: alert.desc,
        icon,
        color,
      };
    });
  }

  // Fallback default warning alert
  return [
    {
      title: 'Cảnh báo công nợ',
      desc: 'Có 2 nhà cung cấp sắp đến hạn thanh toán công nợ. Vui lòng kiểm tra đối soát trước khi duyệt đơn mới.',
      icon: AlertCircle,
      color: 'bg-amber-50 border-amber-100 text-amber-500',
    },
  ];
}
