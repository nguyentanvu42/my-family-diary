'use client';

import { Table, Tag } from 'antd';

export interface HouseholdRow {
  id: string;
  name: string;
  email: string;
  familyName: string | null;
  createdAt: string;
  memberCount: number;
}

const columns = [
  {
    title: 'Tên gia đình',
    key: 'familyName',
    render: (_: unknown, r: HouseholdRow) => (
      <div>
        <div className="font-semibold text-text-primary">{r.familyName ?? '—'}</div>
        <div className="text-xs text-text-secondary">Chủ hộ: {r.name}</div>
      </div>
    ),
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Thành viên',
    key: 'members',
    render: (_: unknown, r: HouseholdRow) => (
      <Tag color="green">{r.memberCount} thành viên</Tag>
    ),
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (d: string) => new Date(d).toLocaleDateString('vi-VN'),
  },
];

export function HouseholdsTable({ data }: { data: HouseholdRow[] }) {
  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 20 }}
      locale={{ emptyText: 'Chưa có gia đình nào đăng ký.' }}
    />
  );
}
