"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  delay?: number;
  distance?: number;
  className?: string;
};

/**
 * CRISP CYBER REVEAL: Smooth fade and subtle brightness shift.
 * No scale or heavy blur to ensure text remains perfectly anti-aliased.
 * Re-triggers smoothly on scroll up and down.
 */
export function ScrollReveal({
  children,
  delay = 0,
  distance = 30, // Clean, standard travel distance
  className,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { 
          opacity: 0, 
          y: distance, 
          // Very subtle blur and slight over-exposure for the "decryption" feel
          filter: "blur(4px) brightness(1.2)" 
        },
        visible: { 
          opacity: 1, 
          y: 0, 
          filter: "blur(0px) brightness(1)" 
        },
      };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      // Triggers reliably when scrolling up or down
      viewport={{ once: false, amount: 0.15, margin: "0px 0px -10% 0px" }}
      variants={variants}
      transition={{ 
        duration: 0.6, 
        delay, 
        // Smooth, premium deceleration curve
        ease: [0.16, 1, 0.3, 1] 
      }}
    >
      {children}
    </motion.div>
  );
}

type ScrollRevealGroupProps = {
  children: ReactNode;
  stagger?: number;
  className?: string;
};

export function ScrollRevealGroup({
  children,
  stagger = 0.08, // Quick, snappy stagger
  className,
}: ScrollRevealGroupProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : stagger,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1, margin: "0px 0px -10% 0px" }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealItem({
  children,
  distance = 30,
  className,
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  const itemVariants: Variants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { 
          opacity: 0, 
          y: distance, 
          filter: "blur(4px) brightness(1.2)" 
        },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px) brightness(1)",
          transition: { 
            duration: 0.6, 
            ease: [0.16, 1, 0.3, 1] 
          },
        },
      };

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}