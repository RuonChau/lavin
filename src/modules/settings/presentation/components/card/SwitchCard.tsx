import { Form, Switch } from 'antd';
import { cn } from '@/shared/utils/cn';

export function SwitchCard({ name, title, description, compact = false }: { name: (string | number)[]; title: string; description: string; compact?: boolean }) {
  return (
    <div className={cn('rounded-3xl border border-[#D8B894]/25 bg-white/58 p-4 shadow-sm', compact && 'h-full')}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-black text-[#2A1E17]">{title}</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-[#9A8677]">{description}</p>
        </div>
        <Form.Item name={name} valuePropName="checked" className="!mb-0">
          <Switch />
        </Form.Item>
      </div>
    </div>
  );
}