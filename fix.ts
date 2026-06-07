import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.updateMany({
    where: { username: 'admin' },
    data: { role: 'SUPER_ADMIN', modules: '' }
  });
  console.log(`Updated ${result.count} admin user(s) to SUPER_ADMIN`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
