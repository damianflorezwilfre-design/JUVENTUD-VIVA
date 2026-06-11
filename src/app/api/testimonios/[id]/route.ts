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

    const { name, role, quote, imageUrl, order } = await request.json();

    if (session.role !== 'SUPER_ADMIN') {
      await prisma.editRequest.create({
        data: {
          userId: session.id,
          action: 'EDIT',
          modelName: 'Testimonial',
          recordId: id,
          proposedData: JSON.stringify({ name, role, quote, imageUrl, order })
        }
      });

      const { sendEmailNotification } = await import('@/lib/email');
      await sendEmailNotification(
        "Nueva Solicitud de Edición - Juventud ViVa",
        "Un editor ha solicitado editar un testimonio. Revisa el portal de administrador.",
        "<p>Un editor ha solicitado un cambio que requiere tu aprobación.</p><p>Puedes revisarlo en el <a href='https://juventud-viva.vercel.app/admin/solicitudes'>panel de administrador (Solicitudes)</a>.</p>"
      );

      const { sendWhatsAppNotification } = await import('@/lib/whatsapp');
      await sendWhatsAppNotification(`⚠️ *Nueva Solicitud de Edición*\n\nUn administrador secundario ha solicitado permiso para editar un testimonio.\n\nRevisa el panel de administrador para aprobar o rechazar.`);

      return NextResponse.json({ success: true, message: 'Solicitud enviada', isRequest: true });
    }

    const updatedTestimonio = await prisma.testimonial.update({
      where: { id },
      data: {
        name,
        role: role || null,
        quote,
        imageUrl: imageUrl || null,
        order: order ? parseInt(order.toString()) : 0
      }
    });

    return NextResponse.json(updatedTestimonio);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar testimonio' }, { status: 500 });
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
          modelName: 'Testimonial',
          recordId: id,
          proposedData: "{}"
        }
      });

      const { sendEmailNotification } = await import('@/lib/email');
      await sendEmailNotification(
        "Nueva Solicitud de Eliminación - Juventud ViVa",
        "Un editor ha solicitado eliminar un testimonio. Revisa el portal de administrador.",
        "<p>Un editor ha solicitado eliminar un testimonio que requiere tu aprobación.</p><p>Puedes revisarlo en el <a href='https://juventud-viva.vercel.app/admin/solicitudes'>panel de administrador (Solicitudes)</a>.</p>"
      );

      const { sendWhatsAppNotification } = await import('@/lib/whatsapp');
      await sendWhatsAppNotification(`⚠️ *Nueva Solicitud de Eliminación*\n\nUn administrador secundario ha solicitado permiso para eliminar un testimonio.\n\nRevisa el panel de administrador para aprobar o rechazar.`);

      return NextResponse.json({ success: true, message: 'Solicitud enviada', isRequest: true });
    }

    await prisma.testimonial.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar testimonio' }, { status: 500 });
  }
}
