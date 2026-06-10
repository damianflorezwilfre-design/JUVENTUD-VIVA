import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const document = searchParams.get('document');

    if (!document) {
      return NextResponse.json({ error: 'Documento es requerido' }, { status: 400 });
    }

    const records = await prisma.financeRecord.findMany({
      where: { 
        donorDocument: document,
        type: 'INCOME'
      },
      orderBy: { date: 'desc' }
    });

    if (records.length === 0) {
      return NextResponse.json({ error: 'No se encontraron donaciones con este documento' }, { status: 404 });
    }

    const totalDonated = records.reduce((acc, curr) => acc + curr.amount, 0);

    return NextResponse.json({ records, totalDonated });
  } catch (error) {
    return NextResponse.json({ error: 'Error al buscar certificados' }, { status: 500 });
  }
}
