'use client';

import { useState } from 'react';
import { App, Input } from 'antd';
import { X, KeyRound, UserPlus, Loader2, Copy, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { AntdModalShell } from '@/shared/ui/antd-modal-shell';
import { Employee } from '@/modules/employees/application/interfaces/employee.interfaces';
import { EmployeeAccountCredentials } from '@/modules/employees/infrastructure/services/employee.service';

export interface EmployeeAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  /** Gọi API tạo tài khoản hoặc reset mật khẩu tuỳ theo employee.has_account */
  onSubmit: (password?: string) => Promise<EmployeeAccountCredentials>;
  isSubmitting: boolean;
}

const MIN_PASSWORD_LENGTH = 6;

export function EmployeeAccountModal({
  isOpen,
  onClose,
  employee,
  onSubmit,
  isSubmitting,
}: EmployeeAccountModalProps) {
  const { message } = App.useApp();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<EmployeeAccountCredentials | null>(null);

  if (!employee) return null;

  const handleClose = () => {
    setPassword('');
    setError(null);
    setCredentials(null);
    onClose();
  };

  const isReset = employee.has_account;
  const username = employee.username ?? employee.employee_code;

  const handleSubmit = async () => {
    const value = password.trim();
    if (value && value.length < MIN_PASSWORD_LENGTH) {
      setError(`Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự`);
      return;
    }
    setError(null);
    try {
      const result = await onSubmit(value || undefined);
      setCredentials(result);
      message.success(isReset ? 'Đã reset mật khẩu thành công!' : 'Đã tạo tài khoản đăng nhập thành công!');
    } catch (err) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? (isReset ? 'Không thể reset mật khẩu' : 'Không thể tạo tài khoản'));
    }
  };

  const handleCopy = async () => {
    if (!credentials) return;
    try {
      await navigator.clipboard.writeText(`Tên đăng nhập: ${credentials.username}\nMật khẩu: ${credentials.password}`);
      message.success('Đã sao chép thông tin đăng nhập');
    } catch {
      message.error('Không thể sao chép');
    }
  };

  return (
    <AntdModalShell open={isOpen} onClose={handleClose} width={448} zIndex={1000} maskClosable={!isSubmitting}>
      <GlassCard className="relative overflow-hidden p-8" radius="4xl">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary-soft/30">
            {credentials ? <CheckCircle2 size={32} /> : isReset ? <KeyRound size={32} /> : <UserPlus size={32} />}
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-text-primary">
              {credentials
                ? 'Thông tin đăng nhập'
                : isReset ? 'Reset mật khẩu' : 'Tạo tài khoản đăng nhập'}
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Nhân viên <span className="font-bold text-primary">{employee.name}</span> — {employee.role}
            </p>
          </div>

          {credentials ? (
            <div className="w-full space-y-3 text-left">
              <div className="rounded-2xl border border-primary-soft/30 bg-white/60 p-4 space-y-2">
                <div className="flex justify-between gap-4">
                  <span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Tên đăng nhập</span>
                  <span className="text-sm font-black text-text-primary">{credentials.username}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Mật khẩu</span>
                  <span className="text-sm font-black text-text-primary font-mono">{credentials.password}</span>
                </div>
              </div>
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                Mật khẩu chỉ hiển thị một lần. Hãy gửi cho nhân viên và nhắc đổi mật khẩu sau khi đăng nhập.
              </p>
            </div>
          ) : (
            <div className="w-full space-y-3 text-left">
              <div>
                <span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Tên đăng nhập</span>
                <Input value={username} readOnly className="mt-1 h-12 rounded-xl bg-gray-50 text-text-muted" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">
                    {isReset ? 'Mật khẩu mới' : 'Mật khẩu'}
                  </span>
                  <span className="text-[10px] font-medium text-text-muted bg-gray-100 px-2 py-0.5 rounded-full">Tuỳ chọn</span>
                </div>
                <Input.Password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onPressEnter={handleSubmit}
                  placeholder="Bỏ trống để hệ thống tự sinh mật khẩu"
                  className="mt-1 h-12 rounded-xl bg-white/60 border-primary-soft/30"
                />
              </div>
              {isReset && (
                <p className="text-xs text-text-muted">
                  Sau khi reset, nhân viên sẽ bị đăng xuất khỏi tất cả thiết bị.
                </p>
              )}
              {error && <p className="text-xs font-medium text-red-500">{error}</p>}
            </div>
          )}

          <div className="flex flex-col w-full gap-3 pt-2">
            {credentials ? (
              <>
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Copy size={18} />
                  Sao chép thông tin
                </button>
                <button
                  onClick={handleClose}
                  className="w-full px-6 py-3 rounded-2xl border border-primary-soft/30 text-sm font-bold text-text-secondary hover:bg-white/60 transition-all"
                >
                  Đóng
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:scale-100"
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : isReset ? (
                    <KeyRound size={18} />
                  ) : (
                    <UserPlus size={18} />
                  )}
                  {isReset ? 'Reset mật khẩu' : 'Tạo tài khoản'}
                </button>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 rounded-2xl border border-primary-soft/30 text-sm font-bold text-text-secondary hover:bg-white/60 transition-all"
                >
                  Hủy bỏ
                </button>
              </>
            )}
          </div>
        </div>

        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-2 text-text-muted hover:bg-white/60 rounded-xl transition-all"
        >
          <X size={20} />
        </button>
      </GlassCard>
    </AntdModalShell>
  );
}
