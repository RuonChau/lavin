import type { TokenService } from '../../domain/services/token.service';

export class JwtService implements TokenService {
  async sign(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }

  async verify<TPayload = Record<string, unknown>>(token: string): Promise<TPayload> {
    return JSON.parse(token) as TPayload;
  }
}
