import { formatVndReport } from "@/modules/reports/utils/formatVndReport";

export function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;


  return (
    <div className="rounded-2xl border border-[#D8B894]/30 bg-white/95 p-3 shadow-xl">
      <p className="mb-2 text-xs font-black text-[#2A1E17]">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} className="text-xs font-bold" style={{ color: entry.color }}>
          {entry.name}: {entry.name?.toLowerCase().includes('doanh thu') || entry.dataKey === 'revenue' ? formatVndReport(entry.value) : entry.value.toLocaleString('vi-VN')}
        </p>
      ))}
    </div>
  );
}
