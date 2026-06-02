import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../infrastructure/services/auth.service';
import { useAuthStore } from '../stores/auth.store';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { browserAuthSession } from '../../infrastructure/auth/browser-auth-session';

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return fallback;
  }

  return (error as ApiError).response?.data?.message ?? fallback;
};

export const useAuth = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const storeLogout = useAuthStore((state) => state.logout);
  const setLoading = useAuthStore((state) => state.setLoading);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const queryClient = useQueryClient();
  
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
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Đăng nhập thất bại'));
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
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Đăng ký thất bại'));
    },
  });

  const getMeQuery = useQuery({
    queryKey: ['auth', 'me', 'role-v2'],
    queryFn: () => authService.getMe(),
    enabled: !!(typeof window !== 'undefined' && browserAuthSession.getAccessToken()),
    retry: false,
  });

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Local cleanup below still clears the browser auth state if the network request fails.
    }
    browserAuthSession.clear();
    storeLogout();
    queryClient.clear();
    router.push('/login');
  }, [queryClient, storeLogout, router]);

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
