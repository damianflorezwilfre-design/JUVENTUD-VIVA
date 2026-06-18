import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MuroClient from "./MuroClient";

export const revalidate = 60;

export default function MuroPage() {
  return (
    <div className="min-h-screen bg-jv-dark text-white font-sans selection:bg-jv-purple/30 selection:text-white flex flex-col">
      <Navbar />
      <MuroClient />
      <Footer />
    </div>
  );
}
