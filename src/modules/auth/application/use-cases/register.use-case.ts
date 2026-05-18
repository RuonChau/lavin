import type { RegisterDto } from '../dto/register.dto';
import { authService } from '../../infrastructure/services/auth.service';

export function registerUseCase(data: RegisterDto) {
  return authService.register(data);
}
