"use client"

import { useEffect, useState, useMemo } from "react";
import { loadSlim } from "@tsparticles/slim";
import { tsParticles } from "@tsparticles/engine";
import { getCurrentTheme, ThemeName } from "@/lib/themeSelector";
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function HolidayThemer({ themeOverride }: { themeOverride?: string | null }) {
  const [theme, setTheme] = useState<ThemeName>('default');
  const { width, height } = useWindowSize();

  useEffect(() => {
    // Check theme on mount and when override changes
    setTheme(getCurrentTheme(themeOverride).id);
  }, [themeOverride]);

  const isConfettiTheme = ['colombia', 'cumpleanos', 'aniversario', 'dia-nino'].includes(theme);

  const getConfettiColors = () => {
    if (theme === 'colombia') return ['#fde047', '#3b82f6', '#ef4444']; // Yellow, Blue, Red
    return ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']; // Rainbow
  };

  const config: any = useMemo(() => {
    if (isConfettiTheme) return null; // We use react-confetti for these

    switch (theme) {
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
            size: { value: 5, random: true },
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

      case 'dia-mujer':
        return {
          fullScreen: { enable: true, zIndex: 9999 },
          particles: {
            number: { value: 40 },
            color: { value: ["#a855f7", "#d946ef", "#c084fc"] }, // Purple/Pink variations
            shape: { type: "circle" },
            opacity: { value: 0.5 },
            size: { value: 4, random: true },
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
            size: { value: 3, random: true },
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
            size: { value: 5, random: true },
            move: { enable: true, speed: 1.5, direction: "bottom", outModes: "out" }
          }
        };

      default:
        return null;
    }
  }, [theme, isConfettiTheme]);

  useEffect(() => {
    if (theme === 'default' || !config || isConfettiTheme) return;

    let container: any;
    
    // Initialize tsParticles with the slim preset safely
    loadSlim(tsParticles).then(() => {
      // Load the specific options for the theme
      tsParticles.load({ id: `tsparticles-${theme}`, options: config }).then((c) => {
        container = c;
      });
    }).catch(console.error);

    return () => {
      if (container) {
        container.destroy();
      }
    };
  }, [theme, config, isConfettiTheme]);

  if (theme === 'default') {
    return null;
  }

  if (isConfettiTheme) {
    return (
      <div className="pointer-events-none fixed inset-0 z-[9999]">
        <Confetti 
          width={width} 
          height={height} 
          colors={getConfettiColors()} 
          numberOfPieces={150}
          gravity={0.15}
        />
      </div>
    );
  }

  return (
    <div 
      id={`tsparticles-${theme}`} 
      className="pointer-events-none fixed inset-0 z-[9999]"
    />
  );
}
