"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedTextProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  splitBy?: "chars" | "words" | "lines";
  stagger?: number;
  duration?: number;
  delay?: number;
  trigger?: boolean; // if true, use ScrollTrigger
  y?: number;
}

export default function AnimatedText({
  children,
  as: Tag = "p",
  className = "",
  splitBy = "chars",
  stagger = 0.03,
  duration = 0.6,
  delay = 0,
  trigger = true,
  y = 30,
}: AnimatedTextProps) {
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      el.style.opacity = "1";
      return;
    }

    const split = new SplitType(el, { types: splitBy });
    const targets =
      splitBy === "chars"
        ? split.chars
        : splitBy === "words"
          ? split.words
          : split.lines;

    if (!targets) return;

    gsap.set(targets, { opacity: 0, y });

    const animation = gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      delay,
      ease: "power3.out",
      scrollTrigger: trigger
        ? {
            trigger: el,
            start: "top 85%",
            once: true,
          }
        : undefined,
    });

    return () => {
      animation.kill();
      split.revert();
    };
  }, [children, splitBy, stagger, duration, delay, trigger, y]);

  return (
    <Tag ref={textRef as React.RefObject<HTMLElement & HTMLParagraphElement & HTMLHeadingElement & HTMLSpanElement>} className={className} style={{ opacity: 0 }}>
      {children}
    </Tag>
  );
}
