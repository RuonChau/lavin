import type { User } from '../../domain/types/user.type';

export function toUser(entity: User): User {
  return entity;
}
