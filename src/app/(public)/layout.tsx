export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import MobileBottomNav from "@/components/MobileBottomNav";
import HolidayThemerWrapper from "@/components/HolidayThemerWrapper";
import { prisma } from "@/lib/prisma";

import { unstable_cache } from 'next/cache';

const getCachedInstitution = unstable_cache(
  async () => {
    return prisma.institution.findUnique({
      where: { id: "singleton" }
    });
  },
  ['institution-singleton'],
  { revalidate: 60 }
);

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const institution = await getCachedInstitution();
  
  const bgImage = institution?.publicBackground || null;
  const themeOverride = institution?.themeOverride || "auto";

  return (
    <>
      {bgImage && (
        <div 
          className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      <HolidayThemerWrapper themeOverride={themeOverride} />
      <Navbar themeOverride={themeOverride} />
      <SmoothScroll>
        <main className="flex-grow pt-20">
          {children}
        </main>
      </SmoothScroll>
      <Footer />
    </>
  );
}
