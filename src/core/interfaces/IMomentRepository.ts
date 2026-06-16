import type { Moment, CreateMomentDto, UpdateMomentDto, MomentFilter } from '../entities/Moment';

export interface IMomentRepository {
  findAll(filter?: MomentFilter): Promise<Moment[]>;
  findById(id: string): Promise<Moment | null>;
  create(data: CreateMomentDto): Promise<Moment>;
  update(id: string, data: UpdateMomentDto): Promise<Moment>;
  delete(id: string): Promise<void>;
}
