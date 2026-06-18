"use client"

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { getCurrentTheme, ThemeName } from "@/lib/themeSelector";

export default function HolidayThemer() {
  const [init, setInit] = useState(false);
  const [theme, setTheme] = useState<ThemeName>('default');

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
    
    // Check theme on mount
    setTheme(getCurrentTheme().id);
  }, []);

  if (!init || theme === 'default') {
    return null;
  }

  const getParticlesConfig = (themeName: ThemeName): any => {
    switch (themeName) {
      case 'navidad':
        return {
          fullScreen: { enable: true, zIndex: 9999 },
          particles: {
            number: { value: 50, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            move: {
              enable: true,
              speed: 1,
              direction: "bottom",
              straight: false,
              outModes: { default: "out" },
            }
          },
          interactivity: { events: { onHover: { enable: false }, onClick: { enable: false } } }
        };
        
      case 'amor-amistad':
        return {
          fullScreen: { enable: true, zIndex: 9999 },
          particles: {
            number: { value: 30 },
            color: { value: ["#ec4899", "#f43f5e", "#fb7185"] },
            shape: { type: "circle" }, // Slim engine doesn't have heart shape by default, we use pink/red circles
            opacity: { value: 0.6, random: true },
            size: { value: { min: 3, max: 6 }, random: true },
            move: {
              enable: true,
              speed: 1.5,
              direction: "top",
              straight: false,
              outModes: { default: "out" },
            }
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
            move: {
              enable: true,
              speed: 0.8,
              direction: "none",
              random: true,
              straight: false,
              outModes: { default: "out" },
            }
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
            move: {
              enable: true,
              speed: 3,
              direction: "bottom",
              straight: false,
              outModes: { default: "out" },
            }
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
