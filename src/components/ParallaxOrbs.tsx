"use client";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxOrbs() {
  const { scrollY } = useScroll();
  
  // Parallax effects for deep background objects
  const y1 = useTransform(scrollY, [0, 2000], [0, -500]);
  const y2 = useTransform(scrollY, [0, 2000], [0, -200]);
  const y3 = useTransform(scrollY, [0, 3000], [0, -800]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden">
      {/* Orb 1: Purple (Moves fast) */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-jv-purple/20 rounded-full blur-[150px]"
      />
      {/* Orb 2: Turquoise (Moves slowly) */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[40%] right-[5%] w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] bg-jv-turquoise/20 rounded-full blur-[120px]"
      />
      {/* Orb 3: Another Purple (Moves very fast) */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-[80%] left-[30%] w-[25vw] h-[25vw] max-w-[400px] max-h-[400px] bg-jv-purple/10 rounded-full blur-[100px]"
      />
    </div>
  );
}
