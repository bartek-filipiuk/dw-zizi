"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedText from "./AnimatedText";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText?: string | null;
  ctaLink?: string | null;
  backgroundImage?: string;
}

export default function HeroSection({
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundImage,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const content = contentRef.current;

    if (!section || !image) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    // Ken Burns slow zoom
    gsap.fromTo(
      image,
      { scale: 1.15 },
      {
        scale: 1.0,
        duration: 20,
        ease: "none",
        repeat: -1,
        yoyo: true,
      }
    );

    // Parallax on scroll
    gsap.to(image, {
      y: "30%",
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    if (content) {
      gsap.to(content, {
        y: "20%",
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "60% top",
          scrub: true,
        },
      });
    }

    // Subtitle fade in
    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 2.2, ease: "power3.out" }
      );
    }

    // CTA slide up
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, delay: 2.5, ease: "power3.out" }
      );
    }
  }, []);

  const handleCtaClick = () => {
    if (ctaLink) {
      const target = document.querySelector(ctaLink);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex h-screen items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        ref={imageRef}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          willChange: "transform",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-charcoal-950/60 via-charcoal-950/40 to-charcoal-950" />

      {/* Content */}
      <div ref={contentRef} className="relative z-10 mx-auto max-w-4xl px-8 text-center md:px-12">
        <AnimatedText
          as="h1"
          className="mb-6 font-serif text-5xl font-bold leading-tight text-cream-50 md:text-7xl lg:text-8xl"
          splitBy="chars"
          stagger={0.03}
          trigger={false}
          delay={1.5}
        >
          {title}
        </AnimatedText>

        <p
          ref={subtitleRef}
          className="mx-auto mb-10 max-w-2xl text-lg text-cream-200/80 opacity-0 md:text-xl"
        >
          {subtitle}
        </p>

        {ctaText && ctaLink && (
          <div ref={ctaRef} className="opacity-0">
            <MagneticButton
              as="a"
              href={ctaLink}
              onClick={handleCtaClick}
              className="inline-block border border-oak-400/60 bg-oak-500/10 px-10 py-4 text-sm tracking-[0.2em] text-cream-50 uppercase backdrop-blur-sm transition-all hover:border-oak-400 hover:bg-oak-500/20"
            >
              {ctaText}
            </MagneticButton>
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs tracking-[0.3em] text-cream-300/50 uppercase">
            Scroll
          </span>
          <div className="h-12 w-[1px] animate-pulse bg-gradient-to-b from-oak-400/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
