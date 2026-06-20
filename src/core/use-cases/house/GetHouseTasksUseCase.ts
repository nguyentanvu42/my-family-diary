import type { IHouseRepository } from '../../interfaces/IHouseRepository';
import type { House } from '../../entities/House';

export class GetHouseTasksUseCase {
  constructor(private repo: IHouseRepository) {}

  async execute(userId: string): Promise<House | null> {
    return this.repo.findByUserId(userId);
  }
}
