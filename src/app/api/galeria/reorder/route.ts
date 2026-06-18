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

export async function PUT(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    
    if (!body.items || !Array.isArray(body.items)) {
      return NextResponse.json({ error: 'Faltan los items para reordenar' }, { status: 400 });
    }

    // Execute bulk update in a transaction
    await prisma.$transaction(
      body.items.map((item: { id: string, order: number }) => 
        prisma.gallery.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al reordenar galería' }, { status: 500 });
  }
}
