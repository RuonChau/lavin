'use client';

import { GlassCard } from '@/shared/components/GlassCard';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/modules/auth/presentation/hooks/use-auth';
import { Coffee } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(3, 'Tên đăng nhập không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <GlassCard className="p-8 md:p-10" blur={32} radius="4xl">
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 bg-primary rounded-2xl mb-4 flex items-center justify-center shadow-xl shadow-primary/30">
          <Coffee size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[#2A1E17] tracking-tight">Chào mừng trở lại</h1>
        <p className="text-sm text-[#6F5A4A] mt-1 font-medium">Hệ thống quản lý BrewGlass ERP</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest ml-1">Tên đăng nhập</label>
          <input 
            {...register('username')}
            type="text" 
            placeholder="manager_coffee" 
            className={`w-full glass-control rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm shadow-sm placeholder:text-[#9A8677]/50 ${errors.username ? 'border-red-400' : ''}`}
          />
          {errors.username && <p className="text-[10px] text-red-500 ml-1">{errors.username.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest ml-1">Mật khẩu</label>
          <input 
            {...register('password')}
            type="password" 
            placeholder="••••••••" 
            className={`w-full glass-control rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm shadow-sm placeholder:text-[#9A8677]/50 ${errors.password ? 'border-red-400' : ''}`}
          />
          {errors.password && <p className="text-[10px] text-red-500 ml-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between text-xs py-1">
          <label className="flex items-center gap-2 text-[#6F5A4A] cursor-pointer">
            <input type="checkbox" className="rounded-md border-[#D8B894]/40 text-primary focus:ring-primary/20 bg-white/50" />
            <span className="font-medium">Ghi nhớ đăng nhập</span>
          </label>
          <a href="#" className="text-primary font-bold hover:text-primary-deep transition-colors">Quên mật khẩu?</a>
        </div>

        <motion.button 
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.99 }}
          disabled={isLoggingIn}
          type="submit" 
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:bg-primary-deep transition-all mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoggingIn ? 'Đang xác thực...' : 'Đăng nhập vào hệ thống'}
        </motion.button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-xs text-[#9A8677]">
          Chưa có tài khoản quản trị?{' '}
          <Link href="/register" className="text-primary font-bold hover:text-primary-deep transition-colors">Liên hệ IT hệ thống</Link>
        </p>
      </div>
    </GlassCard>
  );
}
