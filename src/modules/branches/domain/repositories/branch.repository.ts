import { Branch } from '../entities/branch.entity';

export interface IBranchRepository {
  findAll(): Promise<Branch[]>;
  findById(id: string): Promise<Branch | null>;
  create(branch: Partial<Branch>): Promise<Branch>;
  update(id: string, branch: Partial<Branch>): Promise<Branch>;
  delete(id: string): Promise<void>;
}
