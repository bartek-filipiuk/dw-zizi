"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TimelineStep {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

interface TimelineRevealProps {
  steps: TimelineStep[];
  className?: string;
}

export default function TimelineReveal({
  steps,
  className = "",
}: TimelineRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setRevealed(true);
      line.style.height = "100%";
      return;
    }

    // Animate the line drawing
    gsap.fromTo(
      line,
      { height: "0%" },
      {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top 60%",
          end: "bottom 40%",
          scrub: 1,
        },
      }
    );

    // Animate each step
    const stepElements = container.querySelectorAll(".timeline-step");
    stepElements.forEach((step, i) => {
      gsap.fromTo(
        step,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: step,
            start: "top 80%",
            once: true,
          },
          onStart: () => setRevealed(true),
        }
      );
    });

    const timer = setTimeout(() => setRevealed(true), 2000);
    return () => clearTimeout(timer);
  }, [steps]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Vertical line - left on mobile, center on desktop */}
      <div className="absolute left-4 top-0 h-full w-[2px] md:left-1/2 md:-translate-x-1/2">
        <div
          ref={lineRef}
          className="w-full bg-gradient-to-b from-oak-400 via-oak-500 to-oak-600"
          style={{ height: "0%" }}
        />
      </div>

      {/* Steps */}
      <div className="relative space-y-16 md:space-y-24">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`timeline-step ${revealed ? "" : "opacity-0"}`}
          >
            {/* Mobile: stacked layout */}
            <div className="md:hidden">
              {/* Dot */}
              <div className="absolute left-[10px] z-10">
                <div className="h-4 w-4 rounded-full border-2 border-oak-400 bg-charcoal-950" />
              </div>

              <div className="pl-12 space-y-4">
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={step.image}
                    alt={step.imageAlt}
                    className="aspect-video w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-serif text-xl text-cream-50">
                  {step.title}
                </h3>
                <p className="text-sm text-cream-300/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Desktop: alternating layout */}
            <div
              className={`hidden md:flex items-center gap-8 ${
                i % 2 === 0 ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div className="w-1/2">
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={step.image}
                    alt={step.imageAlt}
                    className="aspect-video w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="relative z-10 flex h-4 w-4 flex-shrink-0 items-center justify-center">
                <div className="h-4 w-4 rounded-full border-2 border-oak-400 bg-charcoal-950" />
              </div>
              <div className="w-1/2">
                <h3 className="mb-3 font-serif text-2xl md:text-3xl text-cream-50">
                  {step.title}
                </h3>
                <p className="text-cream-300/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
