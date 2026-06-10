import { prisma } from "./prisma";

export async function sendWhatsAppNotification(message: string) {
  try {
    const inst = await prisma.institution.findUnique({
      where: { id: "singleton" }
    });

    if (!inst || !inst.whatsappApiKey || !inst.whatsappGroupPhone) {
      console.log("No WhatsApp settings found. Skipping notification.");
      return;
    }

    const apikey = inst.whatsappApiKey;
    const groupPhone = inst.whatsappGroupPhone;

    // CallMeBot Group API
    const url = `https://api.callmebot.com/whatsapp.php?phone=${groupPhone}&text=${encodeURIComponent(message)}&apikey=${apikey}`;

    const res = await fetch(url, { method: "GET" });

    if (!res.ok) {
      console.error("Error sending WhatsApp notification:", await res.text());
    } else {
      console.log("WhatsApp notification sent successfully.");
    }
  } catch (error) {
    console.error("Failed to send WhatsApp notification:", error);
  }
}
