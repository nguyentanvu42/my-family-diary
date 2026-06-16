import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDownloadUrl } from '@vercel/blob';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const url = req.nextUrl.searchParams.get('url');
  if (!url || !url.includes('blob.vercel-storage.com')) {
    return new NextResponse('Invalid url', { status: 400 });
  }

  const downloadUrl = await getDownloadUrl(url);
  return NextResponse.redirect(downloadUrl);
}
