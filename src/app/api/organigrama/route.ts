import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const nodes = await prisma.orgNode.findMany({
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(nodes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch org nodes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { title, name, parentId, order } = data;
    
    const node = await prisma.orgNode.create({
      data: {
        title,
        name,
        parentId: parentId || null,
        order: order || 0
      }
    });
    
    return NextResponse.json(node);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create org node" }, { status: 500 });
  }
}
