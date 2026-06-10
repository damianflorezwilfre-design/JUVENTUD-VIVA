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
    const oportunidades = await prisma.opportunity.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(oportunidades);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener oportunidades' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { title, company, description, type, link, isActive } = await request.json();

    const nuevaOportunidad = await prisma.opportunity.create({
      data: {
        title,
        company,
        description,
        type,
        link,
        isActive
      }
    });

    return NextResponse.json(nuevaOportunidad, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear oportunidad' }, { status: 500 });
  }
}
