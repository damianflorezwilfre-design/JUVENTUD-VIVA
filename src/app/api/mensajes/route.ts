export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const session = (await cookies()).get('session')?.value;
    if (!session || await verifyToken(session) === null) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener mensajes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // PUBLIC ENDPOINT - NO AUTH REQUIRED
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    const nuevoMensaje = await prisma.message.create({
      data: {
        name,
        email,
        message
      }
    });

    // Notify via WhatsApp
    const { sendWhatsAppNotification } = await import('@/lib/whatsapp');
    await sendWhatsAppNotification(`📩 *Nuevo Mensaje de Contacto*\n\n*Nombre:* ${name}\n*Correo:* ${email}\n*Mensaje:* ${message}`);

    // Send email notification
    const { sendEmailNotification } = await import('@/lib/email');
    await sendEmailNotification(
      "Nuevo Mensaje de Contacto - Juventud ViVa",
      `Has recibido un nuevo mensaje de ${name} (${email}):\n\n${message}`,
      `<p>Has recibido un nuevo mensaje de contacto en el portal público de <strong>Juventud ViVa</strong>.</p>
       <p><strong>Nombre:</strong> ${name}</p>
       <p><strong>Correo:</strong> ${email}</p>
       <p><strong>Mensaje:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
       <p>Puedes revisarlo en el <a href="https://juventud-viva.vercel.app/admin/mensajes">panel de administrador</a>.</p>`
    );

    // Notify via WhatsApp
    const { sendWhatsAppNotification } = await import('@/lib/whatsapp');
    await sendWhatsAppNotification(`📬 *Nuevo Mensaje de Contacto*\n\n*De:* ${name}\n*Mensaje:* ${message}`);

    return NextResponse.json(nuevoMensaje, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al enviar mensaje' }, { status: 500 });
  }
}
