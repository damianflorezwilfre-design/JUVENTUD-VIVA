export const revalidate = 60;
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session: any = await getSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const requests = await prisma.editRequest.findMany({
      include: {
        user: { select: { username: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener solicitudes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session: any = await getSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { requestId, action } = await request.json(); // action: "APPROVE" or "REJECT"

    const editReq = await prisma.editRequest.findUnique({ where: { id: requestId } });
    if (!editReq || editReq.status !== 'PENDING') {
      return NextResponse.json({ error: 'Solicitud no válida o ya procesada' }, { status: 400 });
    }

    if (action === 'REJECT') {
      await prisma.editRequest.update({ where: { id: requestId }, data: { status: 'REJECTED' } });
      return NextResponse.json({ success: true, message: 'Solicitud rechazada' });
    }

    if (action === 'APPROVE') {
      // Execute the requested change
      if (editReq.action === 'DELETE') {
        // Dynamic deletion based on modelName
        if (editReq.modelName === 'News') await prisma.news.delete({ where: { id: editReq.recordId } });
        else if (editReq.modelName === 'Program') await prisma.program.delete({ where: { id: editReq.recordId } });
        else if (editReq.modelName === 'Gallery') await prisma.gallery.delete({ where: { id: editReq.recordId } });
        else if (editReq.modelName === 'Document') await prisma.document.delete({ where: { id: editReq.recordId } });
        else if (editReq.modelName === 'Alliance') await prisma.alliance.delete({ where: { id: editReq.recordId } });
        else if (editReq.modelName === 'RoadmapAction') await prisma.roadmapAction.delete({ where: { id: editReq.recordId } });
      } else if (editReq.action === 'EDIT' && editReq.proposedData) {
        const data = JSON.parse(editReq.proposedData);
        if (editReq.modelName === 'News') await prisma.news.update({ where: { id: editReq.recordId }, data });
        else if (editReq.modelName === 'Program') await prisma.program.update({ where: { id: editReq.recordId }, data });
        else if (editReq.modelName === 'Gallery') await prisma.gallery.update({ where: { id: editReq.recordId }, data });
        else if (editReq.modelName === 'Document') await prisma.document.update({ where: { id: editReq.recordId }, data });
        else if (editReq.modelName === 'RoadmapAction') await prisma.roadmapAction.update({ where: { id: editReq.recordId }, data });
        else if (editReq.modelName === 'Institution') {
          // Singleton
          await prisma.institution.update({ where: { id: 'singleton' }, data });
        }
      }

      await prisma.editRequest.update({ where: { id: requestId }, data: { status: 'APPROVED' } });
      return NextResponse.json({ success: true, message: 'Solicitud aprobada y ejecutada' });
    }

    return NextResponse.json({ error: 'Acción inválida' }, { status: 400 });

  } catch (error) {
    console.error("Approve error", error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
