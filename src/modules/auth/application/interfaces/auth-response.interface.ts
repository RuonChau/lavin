import type { User } from '../../domain/types/user.type';

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}
