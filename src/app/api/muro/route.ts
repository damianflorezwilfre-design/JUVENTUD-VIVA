import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function isAuthenticated() {
  const session = (await cookies()).get('session')?.value;
  if (!session) return false;
  return await verifyToken(session) !== null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publicOnly = searchParams.get('public') === 'true';

    const mensajes = await prisma.wallMessage.findMany({
      where: publicOnly ? { isApproved: true } : undefined,
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(mensajes);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener mensajes del muro' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, message } = await request.json();

    if (!name || !message) {
      return NextResponse.json({ error: 'Nombre y mensaje requeridos' }, { status: 400 });
    }

    const nuevoMensaje = await prisma.wallMessage.create({
      data: {
        name,
        message,
        isApproved: false // Requires admin approval
      }
    });

    return NextResponse.json(nuevoMensaje, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al enviar mensaje' }, { status: 500 });
  }
}
