import type { UserRepository } from '../../domain/repositories/user.repository';
import type { User } from '../../domain/types/user.type';

export class PrismaUserRepository implements UserRepository {
  async findById(_id: string): Promise<User | null> {
    return null;
  }

  async findByEmail(_email: string): Promise<User | null> {
    return null;
  }
}
