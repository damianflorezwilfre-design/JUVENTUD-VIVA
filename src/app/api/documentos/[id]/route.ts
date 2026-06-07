import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getSession } from '@/lib/auth';
import { cookies } from 'next/headers';

async function isAuthenticated() {
  const session = (await cookies()).get('session')?.value;
  if (!session) return false;
  return await verifyToken(session) !== null;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session: any = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { title, fileUrl, type } = await request.json();
    const { id } = await params;

    if (session.role !== 'SUPER_ADMIN') {
      await prisma.editRequest.create({
        data: {
          userId: session.id,
          action: 'EDIT',
          modelName: 'Document',
          recordId: id,
          proposedData: JSON.stringify({ title, fileUrl, type })
        }
      });
      return NextResponse.json({ success: true, message: 'Solicitud de edición enviada', isRequest: true });
    }

    const docActualizado = await prisma.document.update({
      where: { id },
      data: {
        title,
        fileUrl,
        type
      }
    });

    return NextResponse.json(docActualizado);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar documento' }, { status: 500 });
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
        data: {
          userId: session.id,
          action: 'DELETE',
          modelName: 'Document',
          recordId: id,
          proposedData: null
        }
      });
      return NextResponse.json({ success: true, message: 'Solicitud de eliminación enviada', isRequest: true });
    }

    await prisma.document.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar documento' }, { status: 500 });
  }
}
