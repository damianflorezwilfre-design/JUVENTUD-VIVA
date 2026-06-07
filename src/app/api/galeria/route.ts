import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function isAuthenticated() {
  const session = (await cookies()).get('session')?.value;
  if (!session) return false;
  return await verifyToken(session) !== null;
}

export async function GET() {
  try {
    const media = await prisma.gallery.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener galería' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { title, url, type } = await request.json();

    if (!url || !type) {
      return NextResponse.json({ error: 'La URL y el tipo son requeridos' }, { status: 400 });
    }

    const nuevoMedia = await prisma.gallery.create({
      data: {
        title: title || null,
        url,
        type
      }
    });

    return NextResponse.json(nuevoMedia, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al añadir a galería' }, { status: 500 });
  }
}
