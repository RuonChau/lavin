'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { GlassCard } from '@/shared/components/GlassCard';
import { authService } from '@/modules/auth/infrastructure/services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const sendOtp = async () => {
    if (!email) {
      toast.error('Vui long nhap email');
      return;
    }

    setIsSendingOtp(true);
    try {
      await authService.sendOtp(email);
      toast.success('Da gui ma OTP');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Khong the gui OTP';
      toast.error(message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const resetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !otp || !newPassword) {
      toast.error('Vui long nhap day du thong tin');
      return;
    }

    setIsResetting(true);
    try {
      await authService.resetPassword({ email, otp, newPassword });
      toast.success('Da dat lai mat khau');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Khong the dat lai mat khau';
      toast.error(message);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#EEF8FA] px-4 py-8">
      <div className="w-full max-w-md">
    <GlassCard className="p-8 md:p-10" blur={32} radius="4xl">
      <div className="mb-8">
        <Link href="/login" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary">
          <ArrowLeft size={16} />
          Dang nhap
        </Link>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/30">
          <Mail size={26} />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#2A1E17]">Quen mat khau</h1>
        <p className="mt-1 text-sm font-medium text-[#6F5A4A]">Nhan OTP qua email va tao mat khau moi.</p>
      </div>

      <form className="space-y-4" onSubmit={resetPassword}>
        <div className="space-y-2">
          <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-[#9A8677]">Email</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="user@example.com"
              className="glass-control flex-1 rounded-2xl px-4 py-3.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={sendOtp}
              disabled={isSendingOtp}
              className="rounded-2xl bg-white px-4 py-3 text-xs font-bold text-primary shadow-sm transition hover:bg-[#FFFAF4] disabled:opacity-70"
            >
              {isSendingOtp ? <Loader2 size={16} className="animate-spin" /> : 'Gui OTP'}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-[#9A8677]">OTP</label>
          <input
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            placeholder="123456"
            className="glass-control w-full rounded-2xl px-4 py-3.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-[#9A8677]">Mat khau moi</label>
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="glass-control w-full rounded-2xl px-4 py-3.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <button
          type="submit"
          disabled={isResetting}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-deep disabled:opacity-70"
        >
          {isResetting && <Loader2 size={18} className="animate-spin" />}
          Dat lai mat khau
        </button>
      </form>
    </GlassCard>
      </div>
    </main>
  );
}
