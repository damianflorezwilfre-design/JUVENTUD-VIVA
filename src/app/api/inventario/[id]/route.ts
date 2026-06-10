import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const item = await prisma.inventoryItem.update({
      where: { id },
      data: {
        quantity: parseInt(data.quantity),
      }
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar artículo" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.inventoryItem.delete({
      where: { id }
    });
    return NextResponse.json({ message: "Eliminado con éxito" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar artículo" }, { status: 500 });
  }
}
