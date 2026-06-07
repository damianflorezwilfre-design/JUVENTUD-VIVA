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
    const documentos = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(documentos);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener documentos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { title, fileUrl, type } = await request.json();

    if (!title || !fileUrl || !type) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    const nuevoDocumento = await prisma.document.create({
      data: {
        title,
        fileUrl,
        type
      }
    });

    return NextResponse.json(nuevoDocumento, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear documento' }, { status: 500 });
  }
}
