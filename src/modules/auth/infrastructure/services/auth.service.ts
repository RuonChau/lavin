import { api } from '@/shared/lib/axios';
import { LoginDto, RegisterDto, ResetPasswordDto } from '../../application/dto/login.dto';
import { User, EUserRole } from '../../domain/types/user.type';
import { LoginDevice } from '../../domain/types/login-device.type';
import { unwrapData, unwrapList } from '@/shared/lib/api-response';

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

// Shape the server actually returns inside the `data` envelope
interface ServerAuthData {
  user?: ServerUser;
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  refresh_token?: string;
}

interface ServerUser {
  id?: string;
  _id?: string;
  username?: string;
  name?: string;
  email?: string;
  role?: string | { name?: string; key?: string; role?: string };
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

interface ServerLoginDevice {
  id: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  createdAt: string;
  lastActiveAt: string;
  isCurrent: boolean;
}

function mapServerLoginDevice(d: ServerLoginDevice): LoginDevice {
  return {
    id: d.id,
    device: d.device,
    browser: d.browser,
    os: d.os,
    ip: d.ip,
    createdAt: new Date(d.createdAt),
    lastActiveAt: new Date(d.lastActiveAt),
    isCurrent: d.isCurrent,
  };
}

const getServerRole = (role: ServerUser['role']): EUserRole => {
  if (typeof role === 'string') return role as EUserRole;
  if (role && typeof role === 'object') {
    return ((role.name ?? role.key ?? role.role) as EUserRole) ?? EUserRole.BARISTA;
  }

  return EUserRole.BARISTA;
};

async function getMeWithToken(accessToken: string): Promise<User> {
  const res = await api.get<{ success: boolean; user?: ServerUser; data?: ServerUser }>('/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const payload = unwrapData<ServerUser>(res.data);
  return mapServerUser(payload ?? {});
}

/** Map the server's user shape to our domain User */
function mapServerUser(u: ServerUser): User {
  return {
    id: u.id ?? u._id ?? '',
    name: u.name ?? u.username ?? '',
    email: u.email ?? '',
    role: getServerRole(u.role),
    createdAt: u.createdAt ? new Date(u.createdAt) : u.created_at ? new Date(u.created_at) : new Date(),
    updatedAt: u.updatedAt ? new Date(u.updatedAt) : u.updated_at ? new Date(u.updated_at) : new Date(),
  };
}

export const authService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const res = await api.post<{ success: boolean; data?: ServerAuthData; accessToken?: string; refreshToken?: string }>('/login', data);
    const payload = unwrapData(res.data) as ServerAuthData;
    const accessToken = payload.accessToken ?? payload.access_token ?? '';
    const user = payload.user ? mapServerUser(payload.user) : await getMeWithToken(accessToken);

    return {
      user,
      access_token: accessToken,
      refresh_token: payload.refreshToken ?? payload.refresh_token ?? '',
    };
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const res = await api.post<{ success: boolean; data?: ServerAuthData; accessToken?: string; refreshToken?: string }>('/register', data);
    const payload = unwrapData(res.data) as ServerAuthData;
    const accessToken = payload.accessToken ?? payload.access_token ?? '';
    const user = payload.user ? mapServerUser(payload.user) : await getMeWithToken(accessToken);

    return {
      user,
      access_token: accessToken,
      refresh_token: payload.refreshToken ?? payload.refresh_token ?? '',
    };
  },

  getMe: async (): Promise<User> => {
    const res = await api.get<{ success: boolean; user?: ServerUser; data?: ServerUser }>('/me');
    const payload = unwrapData(res.data) as ServerUser;
    return mapServerUser(payload ?? {});
  },

  refreshToken: async (refreshToken: string): Promise<{ access_token: string }> => {
    const res = await api.post<{ success: boolean; data: { accessToken?: string; access_token?: string } }>(
      '/refresh-token',
      { refresh_token: refreshToken }
    );
    const payload = unwrapData(res.data);
    return { access_token: payload?.accessToken ?? payload?.access_token ?? '' };
  },

  sendOtp: async (email: string): Promise<void> => {
    await api.post('/send-otp', { email });
  },

  resetPassword: async (data: ResetPasswordDto): Promise<void> => {
    await api.post('/reset-password', data);
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await api.post('/change-password', data);
  },

  getLoginDevices: async (): Promise<LoginDevice[]> => {
    const res = await api.get('/devices');
    const items = unwrapList<ServerLoginDevice>(res.data);
    return items.map(mapServerLoginDevice);
  },

  revokeLoginDevice: async (sessionId: string): Promise<void> => {
    await api.delete(`/devices/${sessionId}`);
  },
};
