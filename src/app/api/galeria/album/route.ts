import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const { oldAlbum, newAlbum } = await req.json();

    if (!oldAlbum || !newAlbum) {
      return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
    }

    const updated = await prisma.gallery.updateMany({
      where: { album: oldAlbum },
      data: { album: newAlbum },
    });

    return NextResponse.json({ success: true, count: updated.count });
  } catch (error) {
    console.error("Error renaming album:", error);
    return NextResponse.json({ error: "Error al renombrar el álbum" }, { status: 500 });
  }
}
