

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session: any = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const [
      volunteersCount,
      alliancesCount,
      programsCount,
      eventsCount,
      testimoniesCount,
      sponsorshipsCount,
      treasuryRecords,
      config
    ] = await Promise.all([
      prisma.volunteer.count(),
      prisma.alliance.count(),
      prisma.program.count(),
      prisma.event.count(),
      prisma.testimonial.count(),
      prisma.sponsorship.count(),
      prisma.financeRecord.findMany(),
      prisma.institution.findFirst()
    ]);

    // Calculate finances
    const totalIngresos = treasuryRecords.filter(r => r.type === 'INGRESO').reduce((acc, curr) => acc + curr.amount, 0);
    const totalEgresos = treasuryRecords.filter(r => r.type === 'EGRESO').reduce((acc, curr) => acc + curr.amount, 0);
    const saldo = totalIngresos - totalEgresos;

    return NextResponse.json({
      volunteers: volunteersCount,
      alliances: alliancesCount,
      programs: programsCount,
      events: eventsCount,
      testimonies: testimoniesCount,
      sponsorships: sponsorshipsCount,
      finances: {
        ingresos: totalIngresos,
        egresos: totalEgresos,
        saldo: saldo
      },
      config: config || {}
    });
  } catch (error) {
    console.error("Error generating rendicion:", error);
    return NextResponse.json({ error: 'Error al generar rendición de cuentas' }, { status: 500 });
  }
}
