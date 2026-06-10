import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function isAuthenticated() {
  const session = (await cookies()).get('session')?.value;
  if (!session) return false;
  return await verifyToken(session) !== null;
}

export async function GET() {
  try {
    const pines = await prisma.mapPin.findMany({
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(pines);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener pines' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { title, description, lat, lng, location, imageUrl, date } = await request.json();

    const nuevoPin = await prisma.mapPin.create({
      data: {
        title,
        description,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        location,
        imageUrl,
        date: date ? new Date(date) : new Date()
      }
    });

    return NextResponse.json(nuevoPin, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear pin' }, { status: 500 });
  }
}
