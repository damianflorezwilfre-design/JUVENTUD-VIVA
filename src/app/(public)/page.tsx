export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import HomePageClient from "./HomePageClient";

export async function generateMetadata() {
  const institution = await prisma.institution.findUnique({
    where: { id: "singleton" }
  });

  return {
    title: "JUVENTUD VIVA | Villanueva - La Guajira",
    description: institution?.aboutUs || "Impulsando el desarrollo y liderazgo de las nuevas generaciones. Juntos construimos un futuro vibrante.",
    openGraph: {
      title: "JUVENTUD VIVA | Villanueva - La Guajira",
      description: institution?.aboutUs || "Impulsando el desarrollo y liderazgo de las nuevas generaciones.",
      url: "https://juventud-viva-qbv9.vercel.app",
      siteName: "JUVENTUD VIVA",
      locale: "es_CO",
      type: "website",
    },
  };
}

export default async function Home() {
  let institution = await prisma.institution.findUnique({
    where: { id: "singleton" }
  });

  if (!institution) {
    institution = {
      id: "singleton",
      aboutUs: "",
      mission: "",
      vision: "",
      address: "",
      phone: "",
      email: "",
      facebook: "",
      instagram: "",
      twitter: "",
      feature1Title: "",
      feature1Desc: "",
      feature2Title: "",
      feature2Desc: "",
      feature3Title: "",
      feature3Desc: "",
      updatedAt: new Date()
    };
  }

  return <HomePageClient institution={institution} />;
}
