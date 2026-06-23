import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function isAuthenticated() {
  const session = (await cookies()).get('session')?.value;
  if (!session) return false;
  return await verifyToken(session) !== null;
}

import { unstable_cache } from 'next/cache';

const getCachedGallery = unstable_cache(
  async () => {
    return await prisma.gallery.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });
  },
  ['gallery-items'],
  { revalidate: 60 }
);

export async function GET() {
  try {
    const media = await getCachedGallery();
    return NextResponse.json(media);
  } catch (error) {
    console.error("Gallery GET error:", error);
    return NextResponse.json({ error: 'Error al obtener galería' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();

    if (body.items && Array.isArray(body.items)) {
      const result = await prisma.gallery.createMany({
        data: body.items.map((item: { title?: string, album?: string, url: string, type: string }) => ({
          title: item.title || null,
          album: item.album || "General",
          url: item.url,
          type: item.type
        }))
      });
      return NextResponse.json({ success: true, count: result.count }, { status: 201 });
    }

    const { title, url, type, album } = body;

    if (!url || !type) {
      return NextResponse.json({ error: 'La URL y el tipo son requeridos' }, { status: 400 });
    }

    const nuevoMedia = await prisma.gallery.create({
      data: {
        title: title || null,
        album: album || "General",
        url,
        type
      }
    });

    return NextResponse.json(nuevoMedia, { status: 201 });
  } catch (error) {
    console.error("Gallery POST error:", error);
    return NextResponse.json({ error: 'Error al subir multimedia' }, { status: 500 });
  }
}
