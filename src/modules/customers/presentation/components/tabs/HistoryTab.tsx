import { GlassCard } from "@/shared/components/GlassCard";
import { Search, ShoppingBag } from "lucide-react";
import { history } from "../../../mocks/history.mock";

export default function HistoryTab() {


  return (
    <GlassCard className="p-8" radius="4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D8B894]" size={18} />
          <input
            type="text"
            placeholder="Tìm theo mả đơn, tên KH..."
            className="w-full bg-white/60 border border-[#D8B894]/20 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary/40 focus:bg-white transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        {history.map(item => (
          <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white/40 border border-[#D8B894]/20 hover:border-primary/30 rounded-[24px] shadow-sm transition-all group cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-[#FFFAF4] flex items-center justify-center text-primary shadow-sm border border-[#D8B894]/20">
                <ShoppingBag size={20} />
              </div>
              <div>
                <p className="font-bold text-[#2A1E17] text-base group-hover:text-primary transition-colors">{item.customer}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[10px] font-black uppercase text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded-lg">{item.id}</span>
                  <span className="text-[11px] font-bold text-[#9A8677]">{item.date}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8 mt-4 md:mt-0">
              <div className="text-right">
                <p className="text-[10px] font-black text-[#968271] uppercase tracking-widest mb-1">Số lượng</p>
                <p className="font-bold text-[#2A1E17]">{item.items} món</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-[#968271] uppercase tracking-widest mb-1">Tổng tiền</p>
                <p className="font-bold text-primary">{item.total.toLocaleString()} ₫</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-[#968271] uppercase tracking-widest mb-1">Điểm nhận</p>
                <p className="font-black text-[#2A1E17] tag-green bg-green-50 px-2 py-1 rounded-lg">+{item.pointsEarned}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
