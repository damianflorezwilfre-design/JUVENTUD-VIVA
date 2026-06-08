import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const data = await req.json();
    const { title, name, parentId, order } = data;
    
    const node = await prisma.orgNode.update({
      where: { id: params.id },
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
    return NextResponse.json({ error: "Failed to update org node" }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    await prisma.orgNode.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete org node" }, { status: 500 });
  }
}
