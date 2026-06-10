import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.inventoryItem.findMany({
      orderBy: { category: "asc" }
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener inventario" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const item = await prisma.inventoryItem.create({
      data: {
        name: data.name,
        category: data.category,
        quantity: parseInt(data.quantity) || 0,
        unit: data.unit,
        description: data.description || null,
      }
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Error al crear artículo" }, { status: 500 });
  }
}
