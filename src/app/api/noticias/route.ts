export const revalidate = 60;
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
    const noticias = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(noticias);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener noticias' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { title, content, imageUrl } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Título y contenido son requeridos' }, { status: 400 });
    }

    const nuevaNoticia = await prisma.news.create({
      data: {
        title,
        content,
        imageUrl: imageUrl || null
      }
    });

    return NextResponse.json(nuevaNoticia, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear noticia' }, { status: 500 });
  }
}
