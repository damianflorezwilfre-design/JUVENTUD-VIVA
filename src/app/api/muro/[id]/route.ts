import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session: any = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { isApproved } = await request.json();
    const { id } = await params;

    if (session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Solo Super Admins pueden aprobar mensajes' }, { status: 403 });
    }

    const actualizado = await prisma.wallMessage.update({
      where: { id },
      data: { isApproved }
    });

    return NextResponse.json(actualizado);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session: any = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const { id } = await params;

    if (session.role !== 'SUPER_ADMIN') {
      await prisma.editRequest.create({
        data: { userId: session.id, action: 'DELETE', modelName: 'WallMessage', recordId: id, proposedData: null }
      });
      return NextResponse.json({ success: true, message: 'Solicitud enviada', isRequest: true });
    }

    await prisma.wallMessage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}
