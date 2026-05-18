import { api } from '@/shared/lib/axios';
import { LoginDto, RegisterDto, ResetPasswordDto } from '../../application/dto/login.dto';
import { User, UserRole } from '../../domain/types/user.type';

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export const authService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    // Mocking login for testing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: 'mock-id-123',
            name: data.username,
            email: `${data.username}@example.com`,
            role: UserRole.ADMIN,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token'
        });
      }, 500);
    });
  },
  
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/register', data);
    return response.data;
  },
  
  getMe: async (userId: string): Promise<User> => {
    // Mocking getMe for testing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: userId || 'mock-id-123',
          name: 'Manager User',
          email: 'manager@example.com',
          role: UserRole.MANAGER,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }, 300);
    });
  },
  
  refreshToken: async (refreshToken: string): Promise<{ access_token: string }> => {
    const response = await api.post<{ access_token: string }>('/refresh-token', { refreshToken });
    return response.data;
  },
  
  sendOtp: async (email: string): Promise<void> => {
    await api.post('/send-otp', { email });
  },
  
  resetPassword: async (data: ResetPasswordDto): Promise<void> => {
    await api.post('/reset-password', data);
  }
};
