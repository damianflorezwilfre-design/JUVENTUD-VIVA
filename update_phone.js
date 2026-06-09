require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.institution.upsert({
    where: { id: "singleton" },
    update: {
      phone: "+57 3245083402",
      publicBackground: ""
    },
    create: {
      id: "singleton",
      phone: "+57 3245083402",
      publicBackground: "",
      aboutUs: "",
      mission: "",
      vision: "",
      address: "",
      email: ""
    }
  });
  console.log("Institution updated with new phone number!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
