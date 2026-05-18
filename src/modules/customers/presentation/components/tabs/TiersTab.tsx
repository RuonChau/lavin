'use client';

import { useState } from "react";
import { GlassCard } from "@/shared/components/GlassCard";
import { cn } from "@/shared/utils/cn";
import { Edit2, Gift, TrendingUp } from "lucide-react";
import { tiers } from "../../../mocks/tiers.mock";
import { UpdatePolicyModal } from "../modals/UpdatePolicyModal";

export default function TiersTab() {
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);


  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setIsPolicyModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-primary hover:text-white transition-all transform active:scale-95 group"
        >
          <TrendingUp size={16} />
          Cập nhật chính sách
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {tiers.map((tier) => (
          <GlassCard key={tier.id} className="p-8 relative group hover:border-primary/30 transition-all border-[#D8B894]/20" radius="4xl">
            <div className="flex justify-between items-start mb-6">
              <div className={cn(
                "px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest",
                tier.color === 'amber' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                  tier.color === 'blue' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                    tier.color === 'zinc' ? 'bg-zinc-50 border-zinc-200 text-zinc-700' :
                      'bg-slate-50 border-slate-200 text-slate-700'
              )}>
                {tier.name}
              </div>
              <button className="p-2 text-[#9A8677] hover:text-primary transition-colors"><Edit2 size={16} /></button>
            </div>

            <div className="mb-6">
              <p className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em] mb-1">MỨC ĐIỂM YÊU CẦU</p>
              <p className="text-3xl font-black text-[#2A1E17]">{tier.minPoints}</p>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em] border-b border-[#D8B894]/10 pb-2">ĐẶC QUYỀN</p>
              {tier.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="mt-1"><Gift size={12} className="text-primary" /></div>
                  <span className="text-sm font-medium text-[#6F5A4A]">{benefit}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>

      <UpdatePolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
      />
    </div>
  );
}