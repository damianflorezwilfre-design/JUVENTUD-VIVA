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

  const plainItems = items.map(item => ({
    ...item,
    createdAt: item.createdAt.toISOString()
  }));

  return <GaleriaClient initialItems={plainItems} />;
}
