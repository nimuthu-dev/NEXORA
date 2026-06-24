'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'hovered' | 'text'>('default');

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Outer ring springs
  const ringX = useSpring(mouseX, { stiffness: 250, damping: 28 });
  const ringY = useSpring(mouseY, { stiffness: 250, damping: 28 });

  useEffect(() => {
    setMounted(true);

    // Disable cursor on mobile / touch devices
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    document.body.classList.add('cursor-none');

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.getAttribute('role') === 'button';

      const isInputField = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.closest('input') || 
        target.closest('textarea');

      if (isClickable) {
        setCursorType('hovered');
      } else if (isInputField) {
        setCursorType('text');
      } else {
        setCursorType('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.body.classList.remove('cursor-none');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!mounted || !isVisible) return null;

  return (
    <>
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-primary pointer-events-none z-[9999] mix-blend-screen"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: cursorType === 'hovered' ? 1.5 : cursorType === 'text' ? 0.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      />
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-primary/40 pointer-events-none z-[9998]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: cursorType === 'hovered' ? 48 : cursorType === 'text' ? 12 : 24,
          height: cursorType === 'hovered' ? 48 : cursorType === 'text' ? 36 : 24,
          backgroundColor: cursorType === 'hovered' ? 'rgba(41, 141, 255, 0.08)' : 'rgba(41, 141, 255, 0)',
          borderColor: cursorType === 'hovered' ? 'rgba(41, 141, 255, 0.8)' : cursorType === 'text' ? 'rgba(41, 141, 255, 0.3)' : 'rgba(41, 141, 255, 0.4)',
          borderRadius: cursorType === 'text' ? '2px' : '50%',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      />
    </>
  );
}
