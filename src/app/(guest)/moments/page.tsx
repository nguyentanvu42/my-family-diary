import { PrismaMomentRepository } from '@/infrastructure/repositories/PrismaMomentRepository';
import { GetPublicMomentsUseCase } from '@/core/use-cases/moments/GetPublicMomentsUseCase';
import { MomentGrid } from '@/presentation/components/guest/MomentGrid';
export const dynamic = 'force-dynamic';

export default async function MomentsPage() {
  const repo = new PrismaMomentRepository();
  const useCase = new GetPublicMomentsUseCase(repo);
  const moments = await useCase.execute();

  return (
    <div>
      <div className="mb-8">
        <h2 style={{ color: '#1A2E25', marginBottom: 4, fontSize: 24, fontWeight: 600, margin: '0 0 4px' }}>
          Khoảnh khắc gia đình
        </h2>
        <p style={{ color: '#6B8F7A', margin: 0 }}>Những kỷ niệm đẹp cùng gia đình</p>
      </div>
      <MomentGrid moments={moments} />
    </div>
  );
}
