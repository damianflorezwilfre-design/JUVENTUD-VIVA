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

    const { title, description, category, imageUrl } = await request.json();
    const { id } = await params;

    if (session.role !== 'SUPER_ADMIN') {
      await prisma.editRequest.create({
        data: {
          userId: session.id,
          action: 'EDIT',
          modelName: 'Program',
          recordId: id,
          proposedData: JSON.stringify({ title, description, category, imageUrl })
        }
      });

      // Send email notification
      const { sendEmailNotification } = await import('@/lib/email');
      await sendEmailNotification(
        "Nueva Solicitud de Edición - Juventud ViVa",
        "Un editor ha solicitado un cambio. Revisa el portal de administrador.",
        "<p>Un editor ha solicitado un cambio que requiere tu aprobación.</p><p>Puedes revisarlo en el <a href='https://juventud-viva.vercel.app/admin/solicitudes'>panel de administrador (Solicitudes)</a>.</p>"
      );

      return NextResponse.json({ success: true, message: 'Solicitud de edición enviada', isRequest: true });
    }

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
          modelName: 'Program',
          recordId: id,
          proposedData: null
        }
      });

      // Send email notification
      const { sendEmailNotification } = await import('@/lib/email');
      await sendEmailNotification(
        "Nueva Solicitud de Edición - Juventud ViVa",
        "Un editor ha solicitado un cambio. Revisa el portal de administrador.",
        "<p>Un editor ha solicitado un cambio que requiere tu aprobación.</p><p>Puedes revisarlo en el <a href='https://juventud-viva.vercel.app/admin/solicitudes'>panel de administrador (Solicitudes)</a>.</p>"
      );

      return NextResponse.json({ success: true, message: 'Solicitud de eliminación enviada', isRequest: true });
    }

    await prisma.program.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar programa' }, { status: 500 });
  }
}
