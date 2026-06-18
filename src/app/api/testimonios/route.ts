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
    const testimonios = await prisma.testimonial.findMany({
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(testimonios);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener testimonios' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session: any = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { name, role, quote, imageUrl, order } = await request.json();

    if (!name || !quote) {
      return NextResponse.json({ error: 'Nombre y cita son requeridos' }, { status: 400 });
    }

    if (session.role !== 'SUPER_ADMIN') {
      await prisma.editRequest.create({
        data: {
          userId: session.id,
          action: 'EDIT',
          modelName: 'Testimonial',
          recordId: 'new',
          proposedData: JSON.stringify({ name, role, quote, imageUrl, order: Number(order) || 0 })
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

    const nuevoTestimonio = await prisma.testimonial.create({
      data: {
        name,
        role,
        quote,
        imageUrl: imageUrl || null,
        order: Number(order) || 0
      }
    });

    return NextResponse.json(nuevoTestimonio, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear testimonio' }, { status: 500 });
  }
}
