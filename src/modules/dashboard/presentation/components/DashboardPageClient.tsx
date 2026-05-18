'use client';

import { useAuth } from '@/modules/auth/presentation/hooks/use-auth';
import { motion } from 'motion/react';
import { 
  TrendingUp,
  Users,
  ShoppingCart,
  Box,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { cn } from '@/shared/utils/cn';

export default function DashboardPage() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-[28px] font-bold text-[#2A1E17] tracking-tight">Xin chào, {user?.name}</h1>
        <p className="text-[#6F5A4A]">Đây là báo cáo tổng quan của chuỗi BrewGlass hôm nay.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPIStatCard 
          title="Doanh thu hôm nay" 
          value="₫24.8M" 
          change="+12.3%" 
          trend="up" 
          icon={<TrendingUp size={20} />} 
        />
        <KPIStatCard 
          title="Số đơn hàng" 
          value="384" 
          change="+5.4%" 
          trend="up" 
          icon={<ShoppingCart size={20} />} 
        />
        <KPIStatCard 
          title="Tồn kho cảnh báo" 
          value="18" 
          change="-2" 
          trend="down" 
          icon={<Box size={20} />} 
          variant="warning"
        />
        <KPIStatCard 
          title="Nhân viên đang trực" 
          value="12" 
          change="+1" 
          trend="up" 
          icon={<Users size={20} />} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#2A1E17]">Đơn hàng gần đây</h3>
              <button className="p-2 text-[#9A8677] hover:bg-white/40 rounded-xl transition-all">
                <MoreVertical size={20} />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#D8B894]/20 text-[#9A8677] text-xs font-bold uppercase tracking-widest">
                    <th className="pb-4 px-2">Mã đơn</th>
                    <th className="pb-4 px-2">Khách hàng</th>
                    <th className="pb-4 px-2">Chi nhánh</th>
                    <th className="pb-4 px-2">Thanh toán</th>
                    <th className="pb-4 px-2">Trạng thái</th>
                    <th className="pb-4 px-2">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody className="text-[#6F5A4A] text-sm">
                  {[1, 2, 3, 4, 5].map((idx) => (
                    <tr key={idx} className="border-b border-[#D8B894]/10 hover:bg-white/40 transition-colors">
                      <td className="py-4 px-2 font-mono text-[#2A1E17]">#ORD-BR{idx}04</td>
                      <td className="py-4 px-2">
                        <div className="font-semibold text-[#2A1E17]">Khách hàng {idx}</div>
                        <div className="text-[11px] text-[#9A8677]">0912***{idx}45</div>
                      </td>
                      <td className="py-4 px-2 text-xs">Chi nhánh Quận 1</td>
                      <td className="py-4 px-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0FA7A0]/10 text-[#0FA7A0]">Momo</span>
                      </td>
                      <td className="py-4 px-2">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[11px] font-bold",
                          idx === 1 ? "bg-[#21B57D]/10 text-[#21B57D]" : "bg-[#C9822B]/10 text-[#C9822B]"
                        )}>
                          {idx === 1 ? 'Hoàn tất' : 'Đang pha chế'}
                        </span>
                      </td>
                      <td className="py-4 px-2 font-bold text-[#2A1E17]">₫{65 * idx}.000</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-[#2A1E17] mb-6">Top món bán chạy</h3>
            <div className="space-y-5">
              {[
                { name: 'Phê La Latte', sales: '142 đơn', price: '₫65.000', img: 'https://picsum.photos/seed/coffee1/100/100' },
                { name: 'Trà Sữa Oolong', sales: '98 đơn', price: '₫55.000', img: 'https://picsum.photos/seed/coffee2/100/100' },
                { name: 'Espresso', sales: '84 đơn', price: '₫45.000', img: 'https://picsum.photos/seed/coffee3/100/100' },
                { name: 'Matcha Latte', sales: '76 đơn', price: '₫65.000', img: 'https://picsum.photos/seed/coffee4/100/100' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-sm">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[#2A1E17]">{item.name}</h4>
                    <p className="text-xs text-[#9A8677]">{item.sales}</p>
                  </div>
                  <div className="text-sm font-bold text-[#8B5E3C]">{item.price}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 bg-primary/10 border-primary/20">
            <h3 className="text-sm font-bold text-[#8B5E3C] uppercase tracking-widest mb-4">Mẹo vận hành</h3>
            <p className="text-sm text-[#6F5A4A] leading-relaxed">
              Chi nhánh Quận 1 đang có tỷ lệ khách vào khung giờ 16:00 - 18:00 tăng 15%. Hãy cân nhắc bổ sung 1 nhân viên pha chế cho khung giờ này.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function KPIStatCard({ title, value, change, trend, icon, variant = 'default' }: { 
  title: string, 
  value: string, 
  change: string, 
  trend: 'up' | 'down', 
  icon: React.ReactNode,
  variant?: 'default' | 'warning'
}) {
  return (
    <GlassCard className="p-5">
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          "w-10 h-10 rounded-2xl flex items-center justify-center border",
          variant === 'warning' ? "bg-[#C9822B]/10 text-[#C9822B] border-[#C9822B]/20" : "bg-[#8B5E3C]/10 text-[#8B5E3C] border-[#8B5E3C]/20"
        )}>
          {icon}
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
          trend === 'up' ? "bg-[#21B57D]/10 text-[#21B57D]" : "bg-[#D95F76]/10 text-[#D95F76]"
        )}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </div>
      </div>
      
      <p className="text-xs font-bold text-[#9A8677] uppercase tracking-widest">{title}</p>
      <h3 className="text-[28px] font-bold text-[#2A1E17] mt-1 tracking-tight">{value}</h3>
    </GlassCard>
  );
}
