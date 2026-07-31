"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  /** Delay before this element starts revealing, in seconds. */
  delay?: number;
  /** How far to rise from, in pixels. */
  distance?: number;
  className?: string;
};

/**
 * Fades + rises content in as it scrolls into view. Use this instead of
 * writing one-off scroll animations per page — every section, card, and
 * grid item across the site should go through this same component so the
 * motion language stays consistent.
 *
 * Respects prefers-reduced-motion: if set, content just appears, no motion.
 */
export function ScrollReveal({
  children,
  delay = 0,
  distance = 24,
  className,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = shouldReduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: distance },
        visible: { opacity: 1, y: 0 },
      };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

type ScrollRevealGroupProps = {
  children: ReactNode;
  /** Delay between each direct child revealing, in seconds. */
  stagger?: number;
  className?: string;
};

/**
 * Wraps a set of children (e.g. a grid) and staggers each one's reveal.
 * Direct children should be ScrollReveal-unaware — this component drives
 * the same hidden/visible variants down through Framer Motion's context,
 * so a grid of plain motion-less items still staggers correctly as long
 * as each item is wrapped in a plain motion.div using the same variants
 * (see ScrollRevealItem below).
 */
export function ScrollRevealGroup({
  children,
  stagger = 0.08,
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
      viewport={{ once: true, margin: "-80px" }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}

/** Use inside a ScrollRevealGroup — inherits stagger timing from the parent. */
export function ScrollRevealItem({
  children,
  distance = 20,
  className,
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  const itemVariants: Variants = shouldReduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        },
      };

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}