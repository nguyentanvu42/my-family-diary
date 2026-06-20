import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { familyName, name, email, password } = await req.json();

  if (!familyName || !name || !email || !password) {
    return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Email đã được sử dụng' }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      role: 'CHU_HO',
      familyName,
      password: hashedPassword,
    },
  });

  // Tạo House mặc định cho gia đình
  await prisma.house.create({
    data: {
      name: familyName,
      userId: user.id,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
