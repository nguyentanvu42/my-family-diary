export interface Moment {
  id: string;
  title: string;
  description?: string | null;
  mediaUrls: string[];
  takenAt: Date;
  isPublic: boolean;
  tags: string[];
  userId: string;
  createdAt: Date;
}

export interface CreateMomentDto {
  title: string;
  description?: string;
  mediaUrls: string[];
  takenAt: Date;
  isPublic?: boolean;
  tags?: string[];
  userId: string;
}

export interface UpdateMomentDto {
  title?: string;
  description?: string;
  mediaUrls?: string[];
  takenAt?: Date;
  isPublic?: boolean;
  tags?: string[];
}

export interface MomentFilter {
  isPublic?: boolean;
  userId?: string;
  tags?: string[];
}
