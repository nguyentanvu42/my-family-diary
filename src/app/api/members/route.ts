import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'CHU_HO') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const members = await prisma.user.findMany({
    where: { householdId: session.user.id, role: 'MEMBER' },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      relationship: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'CHU_HO') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, email, password, relationship, avatar } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Email đã được sử dụng' }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const member = await prisma.user.create({
    data: {
      name,
      email,
      role: 'MEMBER',
      householdId: session.user.id,
      password: hashedPassword,
      relationship: relationship ?? null,
      avatar: avatar ?? null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      relationship: true,
      createdAt: true,
    },
  });

  return NextResponse.json(member, { status: 201 });
}
