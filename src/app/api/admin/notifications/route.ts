export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const unreadMessages = await prisma.message.count({
      where: { isRead: false }
    });

    const pendingRequests = await prisma.editRequest.count({
      where: { status: 'PENDING' }
    });

    return NextResponse.json({ unreadMessages, pendingRequests });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching notifications' }, { status: 500 });
  }
}
