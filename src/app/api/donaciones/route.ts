export const revalidate = 60;
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, amount, reference } = await request.json();

    if (!name || !amount) {
      return NextResponse.json({ error: 'Nombre y monto requeridos' }, { status: 400 });
    }

    const record = await prisma.financeRecord.create({
      data: {
        type: 'INCOME',
        description: `Donación Web - ${name} (Ref: ${reference || 'N/A'})`,
        amount: parseFloat(amount),
      }
    });

    return NextResponse.json(record);
  } catch (error) {
    return NextResponse.json({ error: 'Error al registrar donación' }, { status: 500 });
  }
}
