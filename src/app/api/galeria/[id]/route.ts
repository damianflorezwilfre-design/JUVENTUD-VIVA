export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function DELETE(request: Request, context: any) {
  const { id } = await context.params;
  try {
    const session: any = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    if (session.role !== 'SUPER_ADMIN') {
      await prisma.editRequest.create({
        data: {
          userId: session.id,
          action: 'DELETE',
          modelName: 'Gallery',
          recordId: id,
        }
      });
      return NextResponse.json({ success: true, message: 'Solicitud de eliminación enviada', isRequest: true });
    }

    await prisma.gallery.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar multimedia' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: any) {
  const { id } = await context.params;
  try {
    const session: any = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { title, album } = await request.json();

    if (session.role !== 'SUPER_ADMIN') {
      await prisma.editRequest.create({
        data: {
          userId: session.id,
          action: 'EDIT',
          modelName: 'Gallery',
          recordId: id,
          proposedData: JSON.stringify({ title, album })
        }
      });
      return NextResponse.json({ success: true, message: 'Solicitud de edición enviada', isRequest: true });
    }

    const updatedMedia = await prisma.gallery.update({
      where: { id },
      data: { title, album }
    });

    return NextResponse.json(updatedMedia);
  } catch (error) {
    return NextResponse.json({ error: 'Error al editar multimedia' }, { status: 500 });
  }
}
