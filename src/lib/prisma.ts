import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined;
};

function createPrismaClient() {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({ adapter });
  
  return client.$extends({
    query: {
      editRequest: {
        async create({ args, query }) {
          const result = await query(args);
          
          // Send WhatsApp notification in the background
          import('./whatsapp').then(({ sendWhatsAppNotification }) => {
            sendWhatsAppNotification(`🔔 *Nueva Solicitud (EditRequest)*\n\nMódulo: ${result.modelName}\nAcción: ${result.action}\n\nRevisa el panel para aprobar o rechazar.`);
          }).catch(console.error);
          
          return result;
        }
      }
    }
  });
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
