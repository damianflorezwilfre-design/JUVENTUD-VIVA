const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users:", users);
  
  const reqs = await prisma.editRequest.findMany();
  console.log("EditRequests:", reqs);
}

main().catch(console.error).finally(() => prisma.$disconnect());
