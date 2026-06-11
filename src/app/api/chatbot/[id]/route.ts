import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const faq = await prisma.chatbotFaq.update({
      where: { id },
      data: {
        question: data.question,
        answer: data.answer,
        order: parseInt(data.order) || 0
      }
    });
    return NextResponse.json(faq);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating FAQ' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.chatbotFaq.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting FAQ' }, { status: 500 });
  }
}
