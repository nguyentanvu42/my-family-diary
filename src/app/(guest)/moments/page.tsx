import { PrismaMomentRepository } from '@/infrastructure/repositories/PrismaMomentRepository';
import { GetPublicMomentsUseCase } from '@/core/use-cases/moments/GetPublicMomentsUseCase';
import { MomentGrid } from '@/presentation/components/guest/MomentGrid';
import { Typography } from 'antd';

export const dynamic = 'force-dynamic';

const { Title, Text } = Typography;

export default async function MomentsPage() {
  const repo = new PrismaMomentRepository();
  const useCase = new GetPublicMomentsUseCase(repo);
  const moments = await useCase.execute();

  return (
    <div>
      <div className="mb-8">
        <Title level={2} style={{ color: '#1A2E25', marginBottom: 4 }}>
          Khoảnh khắc gia đình
        </Title>
        <Text style={{ color: '#6B8F7A' }}>Những kỷ niệm đẹp cùng gia đình</Text>
      </div>
      <MomentGrid moments={moments} />
    </div>
  );
}
