"use client"

import { useEffect, useState } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { tsParticles } from "@tsparticles/engine";
import { getCurrentTheme, ThemeName } from "@/lib/themeSelector";

export default function HolidayThemer({ themeOverride }: { themeOverride?: string | null }) {
  const [init, setInit] = useState(false);
  const [theme, setTheme] = useState<ThemeName>('default');

  useEffect(() => {
    loadSlim(tsParticles).then(() => {
      setInit(true);
    });
    
    // Check theme on mount
    setTheme(getCurrentTheme(themeOverride).id);
  }, [themeOverride]);

  if (!init || theme === 'default') {
    return null;
  }

  const getParticlesConfig = (themeName: ThemeName): any => {
    switch (themeName) {
      case 'navidad':
        return {
          fullScreen: { enable: true, zIndex: 9999 },
          particles: {
            number: { value: 50 },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            move: { enable: true, speed: 1, direction: "bottom", outModes: "out" }
          }
        };
        
      case 'amor-amistad':
        return {
          fullScreen: { enable: true, zIndex: 9999 },
          particles: {
            number: { value: 30 },
            color: { value: ["#ec4899", "#f43f5e", "#fb7185"] },
            shape: { type: "circle" },
            opacity: { value: 0.6, random: true },
            size: { value: { min: 3, max: 6 }, random: true },
            move: { enable: true, speed: 1.5, direction: "top", outModes: "out" }
          }
        };

      case 'halloween':
        return {
          fullScreen: { enable: true, zIndex: 9999 },
          particles: {
            number: { value: 40 },
            color: { value: ["#f97316", "#a855f7"] },
            shape: { type: "circle" },
            opacity: { value: 0.4 },
            size: { value: 2 },
            move: { enable: true, speed: 0.8, direction: "none", random: true, outModes: "out" }
          }
        };

      case 'colombia':
        return {
          fullScreen: { enable: true, zIndex: 9999 },
          particles: {
            number: { value: 60 },
            color: { value: ["#fde047", "#3b82f6", "#ef4444"] }, // Yellow, Blue, Red
            shape: { type: ["circle", "square"] },
            opacity: { value: 0.7 },
            size: { value: 4 },
            move: { enable: true, speed: 3, direction: "bottom", outModes: "out" }
          }
        };

      case 'cumpleanos':
      case 'aniversario':
      case 'dia-nino':
        return {
          fullScreen: { enable: true, zIndex: 9999 },
          particles: {
            number: { value: 70 },
            color: { value: ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"] }, // Rainbow
            shape: { type: ["circle", "square"] },
            opacity: { value: 0.8 },
            size: { value: { min: 3, max: 7 } },
            move: { enable: true, speed: 4, direction: "bottom", random: true, outModes: "out" }
          }
        };

      case 'dia-mujer':
        return {
          fullScreen: { enable: true, zIndex: 9999 },
          particles: {
            number: { value: 40 },
            color: { value: ["#a855f7", "#d946ef", "#c084fc"] }, // Purple/Pink variations
            shape: { type: "circle" },
            opacity: { value: 0.5 },
            size: { value: { min: 2, max: 5 } },
            move: { enable: true, speed: 1.2, direction: "top", outModes: "out" }
          }
        };

      case 'dia-juventud':
        return {
          fullScreen: { enable: true, zIndex: 9999 },
          particles: {
            number: { value: 50 },
            color: { value: ["#10b981", "#34d399", "#fbbf24"] }, // Emerald and Amber
            shape: { type: "circle" },
            opacity: { value: 0.6 },
            size: { value: { min: 2, max: 4 } },
            move: { enable: true, speed: 2, direction: "none", random: true, outModes: "bounce" }
          }
        };

      case 'dia-padre':
        return {
          fullScreen: { enable: true, zIndex: 9999 },
          particles: {
            number: { value: 30 },
            color: { value: ["#3b82f6", "#1d4ed8", "#60a5fa", "#ffffff"] }, // Blue variations
            shape: { type: "square" },
            opacity: { value: 0.6 },
            size: { value: { min: 3, max: 6 } },
            move: { enable: true, speed: 1.5, direction: "bottom", outModes: "out" }
          }
        };

      default:
        return null;
    }
  };

  const config = getParticlesConfig(theme);
  if (!config) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <Particles id="tsparticles-holiday" options={config} />
    </div>
  );
}
