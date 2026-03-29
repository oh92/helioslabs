'use client';

import { useState, useEffect, useRef, type RefObject } from 'react';

interface CountUpOptions {
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export function useCountUp(
  target: number | null,
  options?: CountUpOptions,
  ref?: RefObject<HTMLElement | null>
): string {
  const { duration = 1500, decimals = 0, prefix = '', suffix = '' } = options ?? {};
  const [current, setCurrent] = useState<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const hasAnimatedRef = useRef(false);
  const isInViewRef = useRef(!ref); // If no ref provided, treat as always in view

  // Reset animation flag when target changes
  useEffect(() => {
    hasAnimatedRef.current = false;
  }, [target]);

  // IntersectionObserver to detect when the element enters the viewport
  useEffect(() => {
    if (!ref?.current) {
      isInViewRef.current = true;
      return;
    }

    const element = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isInViewRef.current = true;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  // Animation effect
  useEffect(() => {
    if (target === null) {
      setCurrent(null);
      return;
    }

    if (hasAnimatedRef.current) return;

    const startAnimation = () => {
      hasAnimatedRef.current = true;
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out: 1 - (1 - t)^3  (cubic ease-out)
        const eased = 1 - Math.pow(1 - progress, 3);

        setCurrent(eased * target);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setCurrent(target);
          rafRef.current = null;
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    };

    if (isInViewRef.current) {
      startAnimation();
    } else {
      // Poll until in view — the observer will flip the flag
      const checkInterval = setInterval(() => {
        if (isInViewRef.current) {
          clearInterval(checkInterval);
          startAnimation();
        }
      }, 50);

      return () => {
        clearInterval(checkInterval);
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      };
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [target, duration]);

  if (current === null) return '\u2014';

  return `${prefix}${current.toFixed(decimals)}${suffix}`;
}
