import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const team = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(team);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching team members" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newMember = await prisma.teamMember.create({
      data: {
        name: data.name,
        role: data.role,
        bio: data.bio || null,
        imageUrl: data.imageUrl || null,
        order: data.order ? parseInt(data.order) : 0,
      },
    });
    return NextResponse.json(newMember);
  } catch (error) {
    return NextResponse.json({ error: "Error creating team member" }, { status: 500 });
  }
}
