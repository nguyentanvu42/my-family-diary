import type { IMomentRepository } from '../../interfaces/IMomentRepository';
import type { Moment, MomentFilter } from '../../entities/Moment';

export class GetPublicMomentsUseCase {
  constructor(private repo: IMomentRepository) {}

  async execute(filter?: Omit<MomentFilter, 'isPublic'>): Promise<Moment[]> {
    return this.repo.findAll({ ...filter, isPublic: true });
  }
}
