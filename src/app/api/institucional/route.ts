export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    let institution = await prisma.institution.findUnique({
      where: { id: "singleton" }
    });

    if (!institution) {
      institution = await prisma.institution.create({
        data: {
          id: "singleton",
          aboutUs: "",
          mission: "",
          vision: "",
          phone: "+57 3245083402"
        }
      });
    } else if (!institution.phone) {
      institution.phone = "+57 3245083402";
    }

    return NextResponse.json(institution);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener información institucional' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session: any = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { 
      aboutUs, mission, vision, address, phone, email, facebook, instagram, twitter, 
      feature1Title, feature1Desc, feature2Title, feature2Desc, feature3Title, feature3Desc, publicBackground,
      donationLink, bankInfo, stat1Value, stat1Label, stat2Value, stat2Label, stat3Value, stat3Label,
      transparency1Title, transparency1Desc, transparency2Title, transparency2Desc, transparency3Title, transparency3Desc,
      calcKitCost, calcMealCost, calcMarketCost, calcSuppliesCost, whatsappApiKey, whatsappGroupPhone
    } = await request.json();

    if (session.role !== 'SUPER_ADMIN') {
      await prisma.editRequest.create({
        data: {
          userId: session.id,
          action: 'EDIT',
          modelName: 'Institution',
          recordId: 'singleton',
          proposedData: JSON.stringify({ 
            aboutUs, mission, vision, address, phone, email, facebook, instagram, twitter, 
            feature1Title, feature1Desc, feature2Title, feature2Desc, feature3Title, feature3Desc, publicBackground,
            donationLink, bankInfo, stat1Value, stat1Label, stat2Value, stat2Label, stat3Value, stat3Label,
            transparency1Title, transparency1Desc, transparency2Title, transparency2Desc, transparency3Title, transparency3Desc,
            calcKitCost: calcKitCost ? parseFloat(calcKitCost) : null,
            calcMealCost: calcMealCost ? parseFloat(calcMealCost) : null,
            calcMarketCost: calcMarketCost ? parseFloat(calcMarketCost) : null,
            calcSuppliesCost: calcSuppliesCost ? parseFloat(calcSuppliesCost) : null,
            whatsappApiKey, whatsappGroupPhone
          })
        }
      });

      // Send email notification
      const { sendEmailNotification } = await import('@/lib/email');
      await sendEmailNotification(
        "Nueva Solicitud de Edición - Juventud ViVa",
        "Un editor ha solicitado un cambio. Revisa el portal de administrador.",
        "<p>Un editor ha solicitado un cambio que requiere tu aprobación.</p><p>Puedes revisarlo en el <a href='https://juventud-viva.vercel.app/admin/solicitudes'>panel de administrador (Solicitudes)</a>.</p>"
      );

      // Notify via WhatsApp
      const { sendWhatsAppNotification } = await import('@/lib/whatsapp');
      await sendWhatsAppNotification(`⚠️ *Nueva Solicitud de Edición*\n\nUn administrador secundario ha solicitado permiso para editar o borrar un registro.\n\nEntra al sistema para revisar los detalles exactos\n\nRevisa el panel de administrador para aprobar o rechazar.`);


      return NextResponse.json({ success: true, message: 'Solicitud de edición enviada', isRequest: true });
    }

    const updated = await prisma.institution.upsert({
      where: { id: "singleton" },
      update: {
        aboutUs, mission, vision, address, phone, email, facebook, instagram, twitter,
        feature1Title, feature1Desc, feature2Title, feature2Desc, feature3Title, feature3Desc, publicBackground,
        donationLink, bankInfo, stat1Value, stat1Label, stat2Value, stat2Label, stat3Value, stat3Label,
        transparency1Title, transparency1Desc, transparency2Title, transparency2Desc, transparency3Title, transparency3Desc,
        calcKitCost: calcKitCost ? parseFloat(calcKitCost) : 50000, 
        calcMealCost: calcMealCost ? parseFloat(calcMealCost) : 15000,
        calcMarketCost: calcMarketCost ? parseFloat(calcMarketCost) : 100000,
        calcSuppliesCost: calcSuppliesCost ? parseFloat(calcSuppliesCost) : 30000,
        whatsappApiKey, whatsappGroupPhone
      },
      create: {
        id: "singleton",
        aboutUs, mission, vision, address, phone, email, facebook, instagram, twitter,
        feature1Title, feature1Desc, feature2Title, feature2Desc, feature3Title, feature3Desc, publicBackground,
        donationLink, bankInfo, stat1Value, stat1Label, stat2Value, stat2Label, stat3Value, stat3Label,
        transparency1Title, transparency1Desc, transparency2Title, transparency2Desc, transparency3Title, transparency3Desc,
        calcKitCost: calcKitCost ? parseFloat(calcKitCost) : 50000, 
        calcMealCost: calcMealCost ? parseFloat(calcMealCost) : 15000,
        calcMarketCost: calcMarketCost ? parseFloat(calcMarketCost) : 100000,
        calcSuppliesCost: calcSuppliesCost ? parseFloat(calcSuppliesCost) : 30000,
        whatsappApiKey, whatsappGroupPhone
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error in PUT /api/institucional:", error);
    return NextResponse.json({ error: 'Error al actualizar información institucional', details: String(error) }, { status: 500 });
  }
}
