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

    const { title, description, lat, lng, location, imageUrl, date } = await request.json();
    const { id } = await params;

    if (session.role !== 'SUPER_ADMIN') {
      await prisma.editRequest.create({
        data: {
          userId: session.id,
          action: 'EDIT',
          modelName: 'MapPin',
          recordId: id,
          proposedData: JSON.stringify({ title, description, lat, lng, location, imageUrl, date })
        }
      });

      // Send email notification
      const { sendEmailNotification } = await import('@/lib/email');
      await sendEmailNotification(
        "Nueva Solicitud de Edición - Juventud ViVa",
        "Un editor ha solicitado un cambio. Revisa el portal de administrador.",
        "<p>Un editor ha solicitado un cambio que requiere tu aprobación.</p><p>Puedes revisarlo en el <a href='https://juventud-viva.vercel.app/admin/solicitudes'>panel de administrador (Solicitudes)</a>.</p>"
      );

      // Notify via WhatsApp
      const { sendWhatsAppNotification } = await import('@/lib/whatsapp');
      await sendWhatsAppNotification(`⚠️ *Nueva Solicitud de Edición*\n\nUn administrador secundario ha solicitado permiso para editar o borrar un registro.\n\nEntra al sistema para revisar los detalles exactos\n\nRevisa el panel de administrador para aprobar o rechazar.`);


      return NextResponse.json({ success: true, message: 'Solicitud enviada', isRequest: true });
    }

    const actualizado = await prisma.mapPin.update({
      where: { id },
      data: {
        title,
        description,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        location,
        imageUrl,
        date: date ? new Date(date) : new Date()
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
        data: { userId: session.id, action: 'DELETE', modelName: 'MapPin', recordId: id, proposedData: null }
      });

      // Send email notification
      const { sendEmailNotification } = await import('@/lib/email');
      await sendEmailNotification(
        "Nueva Solicitud de Edición - Juventud ViVa",
        "Un editor ha solicitado un cambio. Revisa el portal de administrador.",
        "<p>Un editor ha solicitado un cambio que requiere tu aprobación.</p><p>Puedes revisarlo en el <a href='https://juventud-viva.vercel.app/admin/solicitudes'>panel de administrador (Solicitudes)</a>.</p>"
      );

      // Notify via WhatsApp
      const { sendWhatsAppNotification } = await import('@/lib/whatsapp');
      await sendWhatsAppNotification(`⚠️ *Nueva Solicitud de Edición*\n\nUn administrador secundario ha solicitado permiso para editar o borrar un registro.\n\nEntra al sistema para revisar los detalles exactos\n\nRevisa el panel de administrador para aprobar o rechazar.`);


      return NextResponse.json({ success: true, message: 'Solicitud enviada', isRequest: true });
    }

    await prisma.mapPin.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}
