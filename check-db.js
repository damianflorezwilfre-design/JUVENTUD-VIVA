const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const items = await prisma.gallery.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log(items.map(i => ({
    id: i.id,
    title: i.title,
    type: i.type,
    album: i.album,
    urlLength: i.url.length,
    urlPrefix: i.url.substring(0, 50)
  })));
}

main().catch(console.error).finally(() => prisma.$disconnect());
