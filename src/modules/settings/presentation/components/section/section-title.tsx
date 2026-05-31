import { Button } from "antd";
import { RefreshCcw, Tag } from "lucide-react";

export function SectionTitle({ icon: Icon, title, description, dirty, onReset }: { icon: React.ElementType; title: string; description: string; dirty: boolean; onReset: () => void }) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-primary-soft/20 pb-5 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          <Icon size={22} />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-black text-text-primary">{title}</h2>
            {dirty && <Tag color="orange" className="m-0 rounded-full px-3 py-1 text-[10px] font-black uppercase">Chưa lưu</Tag>}
          </div>
          <p className="mt-1 text-sm font-medium text-text-secondary">{description}</p>
        </div>
      </div>
      <Button icon={<RefreshCcw size={16} />} onClick={onReset} className="border-primary-soft/40! bg-white/70! font-black! text-text-secondary!">
        Reset phần này
      </Button>
    </div>
  );
}
