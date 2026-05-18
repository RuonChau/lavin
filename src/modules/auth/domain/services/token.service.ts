export interface TokenService {
  sign(payload: Record<string, unknown>): Promise<string>;
  verify<TPayload = Record<string, unknown>>(token: string): Promise<TPayload>;
}
