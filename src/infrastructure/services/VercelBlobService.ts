import { put, del } from '@vercel/blob';

export class VercelBlobService {
  async upload(file: File, folder = 'moments'): Promise<string> {
    const blob = await put(`${folder}/${Date.now()}-${file.name}`, file, {
      access: 'public',
    });
    return blob.url;
  }

  async delete(url: string): Promise<void> {
    await del(url);
  }
}
