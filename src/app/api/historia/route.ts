import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const events = await prisma.timelineEvent.findMany({
      orderBy: { order: 'asc' }
    });
    
    // Seed default if empty
    if (events.length === 0) {
      await prisma.timelineEvent.createMany({
        data: [
          { year: "2018", title: "Los Inicios", description: "Iniciamos como un pequeño grupo de jóvenes preocupados por la falta de oportunidades en nuestra comunidad.", order: 1 },
          { year: "2020", title: "Primera Gran Campaña", description: "Durante la pandemia, organizamos nuestra primera recolección de mercados, ayudando a más de 200 familias.", order: 2 },
          { year: "2022", title: "Fundación Oficial", description: "Nos constituimos legalmente como JUVENTUD VIVA y lanzamos nuestro primer programa educativo estructurado.", order: 3 },
          { year: "2024", title: "Expansión Regional", description: "Abrimos nuestras puertas a voluntarios de toda La Guajira, alcanzando un récord de 1000 jóvenes impactados.", order: 4 }
        ]
      });
      return NextResponse.json(await prisma.timelineEvent.findMany({ orderBy: { order: 'asc' } }));
    }
    
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching timeline events' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const event = await prisma.timelineEvent.create({ 
      data: {
        year: data.year,
        title: data.title,
        description: data.description,
        order: parseInt(data.order) || 0
      }
    });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating timeline event' }, { status: 500 });
  }
}
