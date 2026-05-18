import { IBranchRepository } from '../../domain/repositories/branch.repository';
import { Branch } from '../../domain/entities/branch.entity';

export class GetBranchesUseCase {
  constructor(private branchRepository: IBranchRepository) {}

  async execute(): Promise<Branch[]> {
    return this.branchRepository.findAll();
  }
}
