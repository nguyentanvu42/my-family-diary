import type { House, HouseTask, CreateHouseTaskDto, UpdateHouseTaskDto } from '../entities/House';

export interface IHouseRepository {
  findFirst(): Promise<House | null>;
  createTask(data: CreateHouseTaskDto): Promise<HouseTask>;
  updateTask(id: string, data: UpdateHouseTaskDto): Promise<HouseTask>;
  deleteTask(id: string): Promise<void>;
}
