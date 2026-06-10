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

    const { title, company, description, type, link, isActive } = await request.json();
    const { id } = await params;

    if (session.role !== 'SUPER_ADMIN') {
      await prisma.editRequest.create({
        data: {
          userId: session.id,
          action: 'EDIT',
          modelName: 'Opportunity',
          recordId: id,
          proposedData: JSON.stringify({ title, company, description, type, link, isActive })
        }
      });
      return NextResponse.json({ success: true, message: 'Solicitud enviada', isRequest: true });
    }

    const actualizado = await prisma.opportunity.update({
      where: { id },
      data: {
        title,
        company,
        description,
        type,
        link,
        isActive
      }
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
        data: { userId: session.id, action: 'DELETE', modelName: 'Opportunity', recordId: id, proposedData: null }
      });
      return NextResponse.json({ success: true, message: 'Solicitud enviada', isRequest: true });
    }

    await prisma.opportunity.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}
