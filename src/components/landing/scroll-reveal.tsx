'use client';

import React from 'react';
import { motion, Variants, useInView } from 'framer-motion';
import { useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
  staggerChildren?: number;
  once?: boolean; // set to true to only animate once (default: false = reverses on scroll up)
}

export function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.7,
  distance = 45,
  staggerChildren = 0,
  once = false, // default: animate both ways
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    margin: '-80px 0px -80px 0px',
  });

  const directions = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  };

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...directions[direction],
      scale: 0.97,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: staggerChildren > 0 ? staggerChildren : undefined,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      animate={isInView ? 'visible' : 'hidden'}
      initial="hidden"
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface TextRevealProps {
  text: string;
  className?: string;
  once?: boolean;
}

export function TextReveal({ text, className = '', once = false }: TextRevealProps) {
  const words = text.split(' ');
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, {
    once,
    margin: '-80px 0px -80px 0px',
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: (custom: number = 0) => ({
      opacity: 1,
      transition: { 
        staggerChildren: 0.07, 
        delayChildren: custom * 0.1 
      }
    })
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 22,
      transition: { type: 'spring', damping: 15, stiffness: 100 }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 15, stiffness: 100 }
    }
  };

  return (
    <motion.h1
      ref={ref}
      className={`flex flex-wrap justify-center ${className}`}
      variants={containerVariants}
      animate={isInView ? 'visible' : 'hidden'}
      initial="hidden"
    >
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden mr-[0.25em] py-1">
          <motion.span
            variants={wordVariants}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}
