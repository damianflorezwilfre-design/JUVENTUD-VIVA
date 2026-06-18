export const revalidate = 60;

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session: any = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const [usersCount, documentsCount, newsCount, programsCount] = await Promise.all([
      prisma.user.count(),
      prisma.document.count(),
      prisma.news.count(),
      prisma.program.count()
    ]);

    // Fetch last 7 days of analytics for the chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const analyticsData = await prisma.analytics.findMany({
      where: { date: { gte: sevenDaysAgo } },
      orderBy: { date: 'asc' }
    });

    return NextResponse.json({
      users: usersCount,
      documents: documentsCount,
      news: newsCount,
      programs: programsCount,
      username: session.username,
      analytics: analyticsData
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
  }
}
