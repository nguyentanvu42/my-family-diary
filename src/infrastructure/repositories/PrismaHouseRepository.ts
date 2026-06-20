import { prisma } from '@/lib/prisma';
import type { IHouseRepository } from '@/core/interfaces/IHouseRepository';
import type { House, HouseTask, CreateHouseTaskDto, UpdateHouseTaskDto } from '@/core/entities/House';

export class PrismaHouseRepository implements IHouseRepository {
  async findByUserId(userId: string): Promise<House | null> {
    const row = await prisma.house.findFirst({ where: { userId }, include: { tasks: true } });
    if (!row) return null;
    return {
      ...row,
      documents: row.documents as string[] | null,
      tasks: row.tasks as HouseTask[],
    };
  }

  async createTask(data: CreateHouseTaskDto): Promise<HouseTask> {
    return prisma.houseTask.create({ data }) as unknown as HouseTask;
  }

  async updateTask(id: string, data: UpdateHouseTaskDto): Promise<HouseTask> {
    return prisma.houseTask.update({ where: { id }, data }) as unknown as HouseTask;
  }

  async deleteTask(id: string): Promise<void> {
    await prisma.houseTask.delete({ where: { id } });
  }
}
