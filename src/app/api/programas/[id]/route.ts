import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function isAuthenticated() {
  const session = (await cookies()).get('session')?.value;
  if (!session) return false;
  return await verifyToken(session) !== null;
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { title, description, category, imageUrl } = await request.json();
    const { id } = await params;

    const updatedProgram = await prisma.program.update({
      where: { id },
      data: {
        title,
        description,
        category,
        imageUrl: imageUrl || null
      }
    });

    return NextResponse.json(updatedProgram);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar programa' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const { id } = await params;

    await prisma.program.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar programa' }, { status: 500 });
  }
}
