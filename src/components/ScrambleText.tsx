"use client";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const CHARS = "!<>-_\\/[]{}—=+*^?#________";

export default function ScrambleText({ text, className = "" }: { text: string, className?: string }) {
  const [displayText, setDisplayText] = useState("");
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (!inView) {
      setDisplayText("");
      return;
    }

    let iteration = 0;
    let animationFrameId: number;

    const maxIterations = 20;

    const animate = () => {
      setDisplayText((current) => {
        return text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("");
      });

      if (iteration >= text.length) {
        cancelAnimationFrame(animationFrameId);
        return;
      }

      iteration += 1 / 3; // speed of deciphering
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [text, inView]);

  return (
    <span ref={ref} className={className}>
      {displayText}
    </span>
  );
}
