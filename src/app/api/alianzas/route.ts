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
    const alianzas = await prisma.alliance.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(alianzas);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener alianzas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { name, logoUrl, website } = await request.json();

    if (!name || !logoUrl) {
      return NextResponse.json({ error: 'Nombre y logo son requeridos' }, { status: 400 });
    }

    const nuevaAlianza = await prisma.alliance.create({
      data: {
        name,
        logoUrl,
        website: website || null
      }
    });

    return NextResponse.json(nuevaAlianza, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear alianza' }, { status: 500 });
  }
}
