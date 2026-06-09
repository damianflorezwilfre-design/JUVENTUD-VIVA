import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Correo inválido' }, { status: 400 });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });

    if (existing) {
      return NextResponse.json({ message: 'Ya estabas suscrito. ¡Gracias!' }, { status: 200 });
    }

    await prisma.newsletterSubscriber.create({
      data: { email }
    });

    return NextResponse.json({ message: 'Suscripción exitosa' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al procesar la suscripción' }, { status: 500 });
  }
}
