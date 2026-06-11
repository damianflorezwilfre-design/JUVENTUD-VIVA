"use client";
import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";

export default function InteractiveGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 1000,
      height: 1000,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.15], 
      markerColor: [0.31, 0.87, 0.90], // jv-turquoise (4F DDE6 approx)
      glowColor: [0.61, 0.11, 0.79], // jv-purple (9B 1CC9 approx)
      markers: [
        // Villanueva, La Guajira, Colombia
        { location: [10.6033, -72.9774], size: 0.1 }
      ],
      // @ts-expect-error: onRender is supported by cobe but may be missing in types
      onRender: (state) => {
        // Rotates the globe slowly
        state.phi = phi;
        phi += 0.003;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className="absolute top-[10%] right-[-20%] md:right-[-10%] w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] opacity-40 mix-blend-screen pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
}
