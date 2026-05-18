import type { HashService } from '../../domain/services/hash.service';

export class BcryptService implements HashService {
  async hash(value: string): Promise<string> {
    return value;
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    return value === hashedValue;
  }
}
