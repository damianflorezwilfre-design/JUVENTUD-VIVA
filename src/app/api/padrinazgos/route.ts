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
    const padrinazgos = await prisma.sponsorship.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(padrinazgos);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener padrinazgos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { title, description, goalAmount, currentAmount, imageUrl, isActive } = await request.json();

    const nuevoPadrinazgo = await prisma.sponsorship.create({
      data: {
        title,
        description,
        goalAmount: goalAmount ? parseFloat(goalAmount) : null,
        currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
        imageUrl,
        isActive
      }
    });

    return NextResponse.json(nuevoPadrinazgo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear padrinazgo' }, { status: 500 });
  }
}
