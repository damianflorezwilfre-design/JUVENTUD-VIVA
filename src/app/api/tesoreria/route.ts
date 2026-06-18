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
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const records = await prisma.financeRecord.findMany({
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(records);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener registros' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { type, description, amount, date, proofUrl, donorDocument } = await request.json();

    if (!type || !description || !amount) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const newRecord = await prisma.financeRecord.create({
      data: {
        type,
        description,
        amount: parseFloat(amount),
        date: date ? new Date(date) : new Date(),
        proofUrl: proofUrl || null,
        donorDocument: donorDocument || null
      }
    });

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear registro' }, { status: 500 });
  }
}
