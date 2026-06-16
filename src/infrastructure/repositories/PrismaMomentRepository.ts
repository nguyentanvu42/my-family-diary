import { prisma } from '@/lib/prisma';
import type { IMomentRepository } from '@/core/interfaces/IMomentRepository';
import type { Moment, CreateMomentDto, UpdateMomentDto, MomentFilter } from '@/core/entities/Moment';

export class PrismaMomentRepository implements IMomentRepository {
  async findAll(filter?: MomentFilter): Promise<Moment[]> {
    const rows = await prisma.moment.findMany({
      where: {
        ...(filter?.isPublic !== undefined && { isPublic: filter.isPublic }),
        ...(filter?.userId && { userId: filter.userId }),
        ...(filter?.tags?.length && { tags: { hasSome: filter.tags } }),
      },
      orderBy: { takenAt: 'desc' },
    });
    return rows.map((r) => ({ ...r, mediaUrls: r.mediaUrls as string[] }));
  }

  async findById(id: string): Promise<Moment | null> {
    const row = await prisma.moment.findUnique({ where: { id } });
    if (!row) return null;
    return { ...row, mediaUrls: row.mediaUrls as string[] };
  }

  async create(data: CreateMomentDto): Promise<Moment> {
    const row = await prisma.moment.create({ data });
    return { ...row, mediaUrls: row.mediaUrls as string[] };
  }

  async update(id: string, data: UpdateMomentDto): Promise<Moment> {
    const row = await prisma.moment.update({ where: { id }, data });
    return { ...row, mediaUrls: row.mediaUrls as string[] };
  }

  async delete(id: string): Promise<void> {
    await prisma.moment.delete({ where: { id } });
  }
}
