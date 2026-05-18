import type { LoginDto } from '../dto/login.dto';
import { authService } from '../../infrastructure/services/auth.service';

export function loginUseCase(data: LoginDto) {
  return authService.login(data);
}
