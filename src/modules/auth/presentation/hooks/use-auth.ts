import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '../../infrastructure/services/auth.service';
import { useAuthStore } from '../stores/auth.store';
import { LoginDto, RegisterDto } from '../../application/dto/login.dto';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { browserAuthSession } from '../../infrastructure/auth/browser-auth-session';

export const useAuth = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const storeLogout = useAuthStore((state) => state.logout);
  const setLoading = useAuthStore((state) => state.setLoading);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      browserAuthSession.setAccessToken(data.access_token);
      browserAuthSession.setRefreshToken(data.refresh_token);
      localStorage.setItem('user_id', data.user.id);
      setUser(data.user);
      toast.success('Đăng nhập thành công!');
      router.push('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      browserAuthSession.setAccessToken(data.access_token);
      browserAuthSession.setRefreshToken(data.refresh_token);
      localStorage.setItem('user_id', data.user.id);
      setUser(data.user);
      toast.success('Đăng ký thành công!');
      router.push('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại');
    },
  });

  const getMeQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') || '' : '';
      return authService.getMe(userId);
    },
    enabled: !!(typeof window !== 'undefined' && browserAuthSession.getAccessToken()),
    retry: false,
  });

  const logout = useCallback(() => {
    browserAuthSession.clear();
    storeLogout();
    router.push('/login');
  }, [storeLogout, router]);

  useEffect(() => {
    if (getMeQuery.data) {
      // Avoid redundant state updates
      if (JSON.stringify(getMeQuery.data) !== JSON.stringify(user)) {
        setUser(getMeQuery.data);
      }
    } else if (getMeQuery.isError) {
      logout();
    }
    
    if (!getMeQuery.isLoading && isLoading) {
      setLoading(false);
    }
  }, [getMeQuery.data, getMeQuery.isError, getMeQuery.isLoading, setUser, logout, setLoading, user, isLoading]);

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout,
    user,
    isAuthenticated,
    isLoading,
  };
};
