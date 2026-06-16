export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';

export interface HouseTask {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate?: Date | null;
  houseId: string;
}

export interface House {
  id: string;
  name: string;
  documents?: string[] | null;
  tasks: HouseTask[];
}

export interface CreateHouseTaskDto {
  title: string;
  dueDate?: Date;
  houseId: string;
}

export interface UpdateHouseTaskDto {
  title?: string;
  status?: TaskStatus;
  dueDate?: Date | null;
}
