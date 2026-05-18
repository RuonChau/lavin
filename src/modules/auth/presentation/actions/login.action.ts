'use server';

import type { LoginDto } from '../../application/dto/login.dto';
import { loginUseCase } from '../../application/use-cases/login.use-case';

export async function loginAction(data: LoginDto) {
  return loginUseCase(data);
}
