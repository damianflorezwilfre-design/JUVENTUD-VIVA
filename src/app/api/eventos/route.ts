export const revalidate = 60;
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getSession } from '@/lib/auth';
import { cookies } from 'next/headers';

async function isAuthenticated() {
  const session = (await cookies()).get('session')?.value;
  if (!session) return false;
  return await verifyToken(session) !== null;
}

export async function GET() {
  try {
    const eventos = await prisma.event.findMany({
      orderBy: { date: 'asc' }
    });
    return NextResponse.json(eventos);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener eventos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
          recordId: 'new',
          proposedData: JSON.stringify({ title, description, date: new Date(date).toISOString(), location, imageUrl })
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

    const nuevoEvento = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        imageUrl: imageUrl || null
      }
    });

    return NextResponse.json(nuevoEvento, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear evento' }, { status: 500 });
  }
}
