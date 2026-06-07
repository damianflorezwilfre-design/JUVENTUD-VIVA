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

    const { title, url, type } = await request.json();
    const { id } = await params;

    if (session.role !== 'SUPER_ADMIN') {
      await prisma.editRequest.create({
        data: {
          userId: session.id,
          action: 'EDIT',
          modelName: 'Gallery',
          recordId: id,
          proposedData: JSON.stringify({ title, url, type })
        }
      });
      return NextResponse.json({ success: true, message: 'Solicitud de edición enviada', isRequest: true });
    }

    const mediaActualizado = await prisma.gallery.update({
      where: { id },
      data: {
        title: title || null,
        url,
        type
      }
    });

    return NextResponse.json(mediaActualizado);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar galería' }, { status: 500 });
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
          modelName: 'Gallery',
          recordId: id,
          proposedData: null
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
