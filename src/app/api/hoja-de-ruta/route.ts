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
    const roadmap = await prisma.roadmapAction.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(roadmap);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener hoja de ruta' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { title, description, date, status } = await request.json();

    if (!title || !description) {
      return NextResponse.json({ error: 'Título y descripción son requeridos' }, { status: 400 });
    }

    const nuevaAccion = await prisma.roadmapAction.create({
      data: {
        title,
        description,
        date: date || null,
        status: status || 'pending'
      }
    });

    return NextResponse.json(nuevaAccion, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear acción' }, { status: 500 });
  }
}
