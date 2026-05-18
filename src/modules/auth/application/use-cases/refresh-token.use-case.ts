import { authService } from '../../infrastructure/services/auth.service';

export function refreshTokenUseCase(refreshToken: string) {
  return authService.refreshToken(refreshToken);
}
