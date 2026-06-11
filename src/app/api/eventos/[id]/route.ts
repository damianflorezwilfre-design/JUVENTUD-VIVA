import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PUT(request: Request, context: any) {
  const { id } = await context.params;
  try {
    const session: any = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { title, description, date, location, imageUrl } = await request.json();
    
    if (!title || !description || !date) {
      return NextResponse.json({ error: 'Título, descripción y fecha son requeridos' }, { status: 400 });
    }

    if (session.role !== 'SUPER_ADMIN') {
      await prisma.editRequest.create({
        data: {
          userId: session.id,
          action: 'EDIT',
          modelName: 'Event',
          recordId: id,
          proposedData: JSON.stringify({ title, description, date: new Date(date).toISOString(), location, imageUrl })
        }
      });

      // Send email notification
      const { sendEmailNotification } = await import('@/lib/email');
      await sendEmailNotification(
        "Nueva Solicitud de Edición - Juventud ViVa",
        "Un editor ha solicitado editar un evento. Revisa el portal de administrador.",
        "<p>Un editor ha solicitado un cambio que requiere tu aprobación.</p><p>Puedes revisarlo en el <a href='https://juventud-viva.vercel.app/admin/solicitudes'>panel de administrador (Solicitudes)</a>.</p>"
      );

      const { sendWhatsAppNotification } = await import('@/lib/whatsapp');
      await sendWhatsAppNotification(`⚠️ *Nueva Solicitud de Edición*\n\nUn administrador secundario ha solicitado permiso para editar un evento.\n\nRevisa el panel de administrador para aprobar o rechazar.`);

      return NextResponse.json({ success: true, message: 'Solicitud enviada', isRequest: true });
    }

    const updatedEvento = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date: new Date(date),
        location,
        imageUrl: imageUrl || null
      }
    });

    return NextResponse.json(updatedEvento);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar evento' }, { status: 500 });
  }
}

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
          modelName: 'Event',
          recordId: id,
          proposedData: "{}"
        }
      });

      const { sendEmailNotification } = await import('@/lib/email');
      await sendEmailNotification(
        "Nueva Solicitud de Eliminación - Juventud ViVa",
        "Un editor ha solicitado eliminar un evento. Revisa el portal de administrador.",
        "<p>Un editor ha solicitado eliminar un evento que requiere tu aprobación.</p><p>Puedes revisarlo en el <a href='https://juventud-viva.vercel.app/admin/solicitudes'>panel de administrador (Solicitudes)</a>.</p>"
      );

      const { sendWhatsAppNotification } = await import('@/lib/whatsapp');
      await sendWhatsAppNotification(`⚠️ *Nueva Solicitud de Eliminación*\n\nUn administrador secundario ha solicitado permiso para eliminar un evento.\n\nRevisa el panel de administrador para aprobar o rechazar.`);

      return NextResponse.json({ success: true, message: 'Solicitud enviada', isRequest: true });
    }

    await prisma.event.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar evento' }, { status: 500 });
  }
}
