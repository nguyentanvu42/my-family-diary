import type { IMomentRepository } from '../../interfaces/IMomentRepository';
import type { Moment, CreateMomentDto } from '../../entities/Moment';

export class CreateMomentUseCase {
  constructor(private repo: IMomentRepository) {}

  async execute(data: CreateMomentDto): Promise<Moment> {
    return this.repo.create(data);
  }
}
