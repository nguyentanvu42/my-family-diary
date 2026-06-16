import type { IMomentRepository } from '../../interfaces/IMomentRepository';
import type { Moment, MomentFilter } from '../../entities/Moment';

export class GetAllMomentsUseCase {
  constructor(private repo: IMomentRepository) {}

  async execute(filter?: MomentFilter): Promise<Moment[]> {
    return this.repo.findAll(filter);
  }
}
