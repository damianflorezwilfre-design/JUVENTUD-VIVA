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
    const programas = await prisma.program.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(programas);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener programas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { title, description, category, imageUrl } = await request.json();

    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const newProgram = await prisma.program.create({
      data: {
        title,
        description,
        category,
        imageUrl: imageUrl || null
      }
    });

    return NextResponse.json(newProgram, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear programa' }, { status: 500 });
  }
}
