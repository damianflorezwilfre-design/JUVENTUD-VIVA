export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { action } = await req.json();

    // Obtener la fecha de hoy sin horas
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const data: any = {};
    if (action === 'view') data.portalViews = { increment: 1 };
    if (action === 'fbClick') data.fbClicks = { increment: 1 };
    if (action === 'igClick') data.igClicks = { increment: 1 };

    await prisma.analytics.upsert({
      where: { date: today },
      update: data,
      create: {
        date: today,
        portalViews: action === 'view' ? 1 : 0,
        fbClicks: action === 'fbClick' ? 1 : 0,
        igClicks: action === 'igClick' ? 1 : 0,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error registrando analítica' }, { status: 500 });
  }
}
