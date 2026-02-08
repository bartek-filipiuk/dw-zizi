"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface RevealImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  revealType?: "wipe-left" | "wipe-right" | "wipe-up" | "circle" | "inset";
  priority?: boolean;
}

export default function RevealImage({
  src,
  alt,
  width = 1200,
  height = 800,
  className = "",
  revealType = "inset",
  priority = false,
}: RevealImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      el.style.clipPath = "none";
      return;
    }

    let fromClip: string;
    let toClip: string;

    switch (revealType) {
      case "wipe-left":
        fromClip = "inset(0 100% 0 0)";
        toClip = "inset(0 0% 0 0)";
        break;
      case "wipe-right":
        fromClip = "inset(0 0 0 100%)";
        toClip = "inset(0 0 0 0%)";
        break;
      case "wipe-up":
        fromClip = "inset(100% 0 0 0)";
        toClip = "inset(0% 0 0 0)";
        break;
      case "circle":
        fromClip = "circle(0% at 50% 50%)";
        toClip = "circle(75% at 50% 50%)";
        break;
      case "inset":
      default:
        fromClip = "inset(0 100% 0 0)";
        toClip = "inset(0 0% 0 0)";
        break;
    }

    gsap.set(el, { clipPath: fromClip });

    const animation = gsap.to(el, {
      clipPath: toClip,
      duration: 1.2,
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        once: true,
      },
    });

    return () => {
      animation.kill();
    };
  }, [revealType]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-full w-full object-cover"
        priority={priority}
        unoptimized
      />
    </div>
  );
}
