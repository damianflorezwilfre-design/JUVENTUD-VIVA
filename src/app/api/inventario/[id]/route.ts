import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const item = await prisma.inventoryItem.update({
      where: { id: params.id },
      data: {
        quantity: parseInt(data.quantity),
      }
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar artículo" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.inventoryItem.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ message: "Eliminado con éxito" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar artículo" }, { status: 500 });
  }
}
