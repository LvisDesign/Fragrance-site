"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

export default function SpotlightGrid() {
  const mouseX = useMotionValue(-1000); // Start off-screen
  const mouseY = useMotionValue(-1000);

  // Smooth springs for cursor spotlight movement
  const springConfig = { damping: 50, stiffness: 300, mass: 0.5 };
  const spotlightX = useSpring(mouseX, springConfig);
  const spotlightY = useSpring(mouseY, springConfig);

  // Motion template to dynamically update the background gradient at 120 FPS
  const backgroundStyle = useMotionTemplate`radial-gradient(550px circle at ${spotlightX}px ${spotlightY}px, rgba(197, 160, 89, 0.12), transparent 75%)`;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FAF9F5]">
      {/* Dynamic Cursor Spotlight Layer */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: backgroundStyle,
        }}
      />

      {/* Modern CSS Dot-Grid Pattern Layer */}
      <div className="absolute inset-0 dot-grid-pattern opacity-25 pointer-events-none" />

      {/* Subtle organic light leakage animations in corners */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[130px] glow-animation" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/8 blur-[130px] glow-animation" style={{ animationDelay: "-3s" }} />
    </div>
  );
}
