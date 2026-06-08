export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session: any = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener los 5 registros más recientes de cada tabla para armar una línea de tiempo
    const [news, docs, programs, users] = await Promise.all([
      prisma.news.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { title: true, createdAt: true } }),
      prisma.document.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { title: true, createdAt: true } }),
      prisma.program.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { title: true, createdAt: true } }),
      prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { username: true, createdAt: true } })
    ]);

    let activity: any[] = [];

    news.forEach(n => activity.push({ text: `Se publicó la noticia '${n.title}'`, date: n.createdAt }));
    docs.forEach(d => activity.push({ text: `Se subió el documento '${d.title}'`, date: d.createdAt }));
    programs.forEach(p => activity.push({ text: `Se creó el programa '${p.title}'`, date: p.createdAt }));
    users.forEach(u => activity.push({ text: `Se registró el usuario '${u.username}'`, date: u.createdAt }));

    // Ordenar por fecha descendente
    activity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Devolver los últimos 10 eventos
    return NextResponse.json(activity.slice(0, 10));
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener actividad' }, { status: 500 });
  }
}
