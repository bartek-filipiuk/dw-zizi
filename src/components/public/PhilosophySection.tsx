"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedText from "./AnimatedText";
import RevealImage from "./RevealImage";

gsap.registerPlugin(ScrollTrigger);

interface PhilosophySectionProps {
  title: string;
  subtitle?: string | null;
  body?: string | null;
  featureImage?: string;
  featureImageAlt?: string;
}

export default function PhilosophySection({
  title,
  subtitle,
  body,
  featureImage,
  featureImageAlt = "Live edge oak detail",
}: PhilosophySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textLinesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const textContainer = textLinesRef.current;
    if (!section || !textContainer) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    // Animate body paragraphs with line-by-line reveal
    const paragraphs = textContainer.querySelectorAll("p");
    paragraphs.forEach((p, i) => {
      gsap.fromTo(
        p,
        { opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" },
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0% 0 0)",
          duration: 1,
          delay: i * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: p,
            start: "top 85%",
            once: true,
          },
        }
      );
    });
  }, [body]);

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="relative overflow-hidden bg-charcoal-950 py-20 md:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
          {/* Text side */}
          <div>
            <div className="mb-6 text-center lg:text-left">
              <span className="text-xl md:text-2xl tracking-[0.3em] text-oak-400 uppercase">
                Our Philosophy
              </span>
            </div>

            <AnimatedText
              as="h2"
              className="mb-6 text-center lg:text-left font-serif text-4xl font-bold text-cream-50 md:text-6xl lg:text-7xl"
              splitBy="words"
              stagger={0.05}
            >
              {title}
            </AnimatedText>

            {subtitle && (
              <AnimatedText
                as="p"
                className="mb-10 text-xl text-oak-300/80 italic"
                splitBy="words"
                stagger={0.02}
              >
                {subtitle}
              </AnimatedText>
            )}

            {body && (
              <div
                ref={textLinesRef}
                className="prose-luxury space-y-6 text-cream-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: body }}
              />
            )}
          </div>

          {/* Image side */}
          {featureImage && (
            <div className="relative">
              <RevealImage
                src={featureImage}
                alt={featureImageAlt}
                className="aspect-[3/4] rounded-sm"
                revealType="circle"
              />
              {/* Decorative border */}
              <div className="absolute -right-4 -bottom-4 -z-10 h-full w-full border border-oak-700/30 rounded-sm" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
