export const dynamic = "force-dynamic";
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
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const voluntarios = await prisma.volunteer.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(voluntarios);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener voluntarios' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, phone, skills, availability } = await request.json();

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Nombre, email y teléfono son requeridos' }, { status: 400 });
    }

    const nuevoVoluntario = await prisma.volunteer.create({
      data: { name, email, phone, skills, availability }
    });

    return NextResponse.json(nuevoVoluntario, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al registrar voluntario' }, { status: 500 });
  }
}
