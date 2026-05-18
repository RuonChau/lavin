'use server';

import type { RegisterDto } from '../../application/dto/register.dto';
import { registerUseCase } from '../../application/use-cases/register.use-case';

export async function registerAction(data: RegisterDto) {
  return registerUseCase(data);
}
