import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const faqs = await prisma.chatbotFaq.findMany({
      orderBy: { order: 'asc' }
    });
    
    // Seed default if empty
    if (faqs.length === 0) {
      await prisma.chatbotFaq.createMany({
        data: [
          { question: "¿Cómo puedo donar?", answer: "Para donar, visita la sección de 'Donaciones' o haz clic en el botón superior derecho 'Donar'. Aceptamos transferencias y Nequi.", order: 1 },
          { question: "¿Cómo me inscribo como voluntario?", answer: "¡Nos encanta la iniciativa! Ve a la sección 'Nosotros' > 'Voluntariado' y llena el formulario de inscripción.", order: 2 },
          { question: "¿Dónde están ubicados?", answer: "Nuestra base principal se encuentra en Villanueva, La Guajira.", order: 3 },
          { question: "¿Qué programas tienen?", answer: "Tenemos programas como Juventud en Marcha, Líderes del Futuro y Manos Solidarias. Míralos todos en la sección 'Programas'.", order: 4 }
        ]
      });
      return NextResponse.json(await prisma.chatbotFaq.findMany({ orderBy: { order: 'asc' } }));
    }
    
    return NextResponse.json(faqs);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching FAQs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const faq = await prisma.chatbotFaq.create({ 
      data: {
        question: data.question,
        answer: data.answer,
        order: parseInt(data.order) || 0
      }
    });
    return NextResponse.json(faq);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating FAQ' }, { status: 500 });
  }
}
