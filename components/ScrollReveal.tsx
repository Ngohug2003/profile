"use client";

import React from "react";
import { motion } from "motion/react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay in seconds or ms
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 28,
  duration = 0.65,
  threshold = 0.08,
  once = true,
}: ScrollRevealProps) {
  // Compute initial transform offsets
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: distance, x: 0 };
      case "down":
        return { y: -distance, x: 0 };
      case "left":
        return { x: distance, y: 0 };
      case "right":
        return { x: -distance, y: 0 };
      case "none":
        return { x: 0, y: 0 };
    }
  };

  const initialPos = getInitialPosition();

  // Normalized delay (if passed in ms, convert to s)
  const delaySec = delay > 5 ? delay / 1000 : delay;

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        ...initialPos,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{
        once,
        amount: threshold,
        margin: "0px 0px -40px 0px",
      }}
      transition={{
        duration,
        delay: delaySec,
        ease: [0.16, 1, 0.3, 1], // Apple-smooth easing curve
      }}
    >
      {children}
    </motion.div>
  );
}
