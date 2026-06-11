import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const event = await prisma.timelineEvent.update({
      where: { id },
      data: {
        year: data.year,
        title: data.title,
        description: data.description,
        order: parseInt(data.order) || 0
      }
    });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating timeline event' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.timelineEvent.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting timeline event' }, { status: 500 });
  }
}
