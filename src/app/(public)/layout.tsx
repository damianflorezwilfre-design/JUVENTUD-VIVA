export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import MobileBottomNav from "@/components/MobileBottomNav";
import { prisma } from "@/lib/prisma";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const institution = await prisma.institution.findUnique({
    where: { id: "singleton" }
  });
  
  const bgImage = institution?.publicBackground || null;

  return (
    <>
      {bgImage && (
        <div 
          className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      <CustomCursor />
      <MobileBottomNav />
      <Navbar />
      <SmoothScroll>
        <main className="flex-grow pt-20">
          {children}
        </main>
      </SmoothScroll>
      <Footer />
    </>
  );
}
