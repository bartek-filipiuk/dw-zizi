"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PageLoaderProps {
  onComplete: () => void;
}

export default function PageLoader({ onComplete }: PageLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const curtainLeftRef = useRef<HTMLDivElement>(null);
  const curtainRightRef = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsDone(true);
      onComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setIsDone(true);
        onComplete();
      },
    });

    // Phase 1: Draw golden line across center
    tl.fromTo(
      lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: "power2.inOut" }
    );

    // Phase 2: Line expands vertically, curtains open
    tl.to(lineRef.current, {
      scaleY: 50,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
    });

    tl.to(
      curtainLeftRef.current,
      { xPercent: -100, duration: 1.2, ease: "power3.inOut" },
      "-=0.2"
    );

    tl.to(
      curtainRightRef.current,
      { xPercent: 100, duration: 1.2, ease: "power3.inOut" },
      "<"
    );

    // Phase 3: Fade out entire loader
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center"
    >
      {/* Left curtain */}
      <div
        ref={curtainLeftRef}
        className="absolute inset-y-0 left-0 w-1/2 bg-charcoal-950"
      />
      {/* Right curtain */}
      <div
        ref={curtainRightRef}
        className="absolute inset-y-0 right-0 w-1/2 bg-charcoal-950"
      />
      {/* Golden line */}
      <div
        ref={lineRef}
        className="absolute z-10 h-[2px] w-[60%] origin-center bg-gradient-to-r from-transparent via-oak-400 to-transparent"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
