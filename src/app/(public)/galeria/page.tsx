import { prisma } from "@/lib/prisma";
import GaleriaClient from "./GaleriaClient";

export const revalidate = 60; // ISR cache every 60 seconds

export default async function GaleriaPage() {
  const items = await prisma.gallery.findMany({
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' }
    ]
  });

  return <GaleriaClient initialItems={items} />;
}
