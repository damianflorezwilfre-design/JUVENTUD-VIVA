export const dynamic = "force-dynamic";
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
    let institution = await prisma.institution.findUnique({
      where: { id: "singleton" }
    });

    if (!institution) {
      institution = await prisma.institution.create({
        data: {
          id: "singleton",
          aboutUs: "",
          mission: "",
          vision: "",
        }
      });
    }

    return NextResponse.json(institution);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener información institucional' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { aboutUs, mission, vision, address, phone, email, facebook, instagram, twitter } = await request.json();

    const updated = await prisma.institution.upsert({
      where: { id: "singleton" },
      update: {
        aboutUs,
        mission,
        vision,
        address,
        phone,
        email,
        facebook,
        instagram,
        twitter,
      },
      create: {
        id: "singleton",
        aboutUs,
        mission,
        vision,
        address,
        phone,
        email,
        facebook,
        instagram,
        twitter,
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error in PUT /api/institucional:", error);
    return NextResponse.json({ error: 'Error al actualizar información institucional', details: String(error) }, { status: 500 });
  }
}
