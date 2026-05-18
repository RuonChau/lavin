'use client';

import { GlassCard } from '@/shared/components/GlassCard';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/modules/auth/presentation/hooks/use-auth';
import { Coffee } from 'lucide-react';

const registerSchema = z.object({
  role: z.string().min(1, 'Vui lòng chọn vai trò'),
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  otp: z.string().length(6, 'Mã OTP phải có 6 ký tự'),
  acceptTerms: z.boolean().refine(val => val === true, 'Bạn phải đồng ý với điều khoản'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser, isRegistering } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerUser(data);
  };

  return (
    <GlassCard className="p-8 md:p-10" blur={32} radius="4xl">
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 bg-primary rounded-2xl mb-4 flex items-center justify-center shadow-xl shadow-primary/30">
          <Coffee size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[#2A1E17] tracking-tight">Đăng ký tài khoản</h1>
        <p className="text-sm text-[#6F5A4A] mt-1 font-medium">Khởi tạo nền tảng BrewGlass của bạn</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest ml-1">Vai trò</label>
            <select 
              {...register('role')}
              className={`w-full glass-control rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm shadow-sm appearance-none bg-white/50 ${errors.role ? 'border-red-400' : ''}`}
            >
              <option value="">Chọn...</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Quản lý</option>
              <option value="STAFF">Nhân viên</option>
            </select>
            {errors.role && <p className="text-[10px] text-red-500 ml-1">{errors.role.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest ml-1">Tên đăng nhập</label>
            <input 
              {...register('username')}
              type="text" 
              placeholder="username" 
              className={`w-full glass-control rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm shadow-sm placeholder:text-[#9A8677]/40 ${errors.username ? 'border-red-400' : ''}`}
            />
            {errors.username && <p className="text-[10px] text-red-500 ml-1">{errors.username.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest ml-1">Email</label>
          <input 
            {...register('email')}
            type="email" 
            placeholder="name@brewglass.com" 
            className={`w-full glass-control rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm shadow-sm placeholder:text-[#9A8677]/40 ${errors.email ? 'border-red-400' : ''}`}
          />
          {errors.email && <p className="text-[10px] text-red-500 ml-1">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest ml-1">Mật khẩu</label>
            <input 
              {...register('password')}
              type="password" 
              placeholder="••••••••" 
              className={`w-full glass-control rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm shadow-sm placeholder:text-[#9A8677]/40 ${errors.password ? 'border-red-400' : ''}`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest ml-1">Mã OTP</label>
            <input 
              {...register('otp')}
              type="text" 
              placeholder="123456" 
              className={`w-full glass-control rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm shadow-sm placeholder:text-[#9A8677]/40 ${errors.otp ? 'border-red-400' : ''}`}
            />
          </div>
        </div>
        {(errors.password || errors.otp) && (
          <div className="flex gap-4">
            <div className="flex-1">{errors.password && <p className="text-[10px] text-red-500 ml-1">{errors.password.message}</p>}</div>
            <div className="flex-1">{errors.otp && <p className="text-[10px] text-red-500 ml-1">{errors.otp.message}</p>}</div>
          </div>
        )}

        <div className="flex flex-col gap-1 py-2">
          <div className="flex items-start gap-2 text-xs">
            <input 
              {...register('acceptTerms')}
              type="checkbox" 
              id="terms" 
              className="mt-0.5 rounded border-[#D8B894]/40 text-primary focus:ring-primary/20 bg-white/50" 
            />
            <label htmlFor="terms" className="text-[#6F5A4A] cursor-pointer leading-relaxed font-medium">
              Tôi đồng ý với <a href="#" className="text-primary font-bold hover:text-primary-deep transition-colors">Điều khoản dịch vụ</a> và <a href="#" className="text-primary font-bold hover:text-primary-deep transition-colors">Chính sách bảo mật</a>.
            </label>
          </div>
          {errors.acceptTerms && <p className="text-[10px] text-red-500 ml-1">{errors.acceptTerms.message}</p>}
        </div>

        <motion.button 
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.99 }}
          disabled={isRegistering}
          type="submit" 
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:bg-primary-deep transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isRegistering ? 'Đang khởi tạo...' : 'Đăng ký hệ thống'}
        </motion.button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-xs text-[#9A8677]">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-primary font-bold hover:text-primary-deep transition-colors">Đăng nhập ngay</Link>
        </p>
      </div>
    </GlassCard>
  );
}
