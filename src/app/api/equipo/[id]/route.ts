import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, context: any) {
  try {
    const params = await context.params;
    const data = await request.json();
    const updatedMember = await prisma.teamMember.update({
      where: { id: params.id },
      data: {
        name: data.name,
        role: data.role,
        bio: data.bio || null,
        imageUrl: data.imageUrl || null,
        order: data.order ? parseInt(data.order) : 0,
      },
    });
    return NextResponse.json(updatedMember);
  } catch (error) {
    return NextResponse.json({ error: "Error updating team member" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const params = await context.params;
    await prisma.teamMember.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting team member" }, { status: 500 });
  }
}
