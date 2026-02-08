"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import Image from "next/image";
import AnimatedText from "./AnimatedText";

interface GalleryItemImage {
  id: string;
  url: string;
  alt?: string | null;
  type: string;
}

interface GalleryItemProps {
  name: string;
  description?: string | null;
  woodType?: string | null;
  dimensions?: string | null;
  images: GalleryItemImage[];
  index: number;
}

export default function GalleryItem({
  name,
  description,
  woodType,
  dimensions,
  images,
  index,
}: GalleryItemProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = imageRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(el, {
      rotateY: x * 10,
      rotateX: -y * 10,
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    const el = imageRef.current;
    if (!el) return;

    gsap.to(el, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const primaryImage = images[0];

  return (
    <>
      <div
        ref={cardRef}
        className="group flex h-full w-[80vw] flex-shrink-0 flex-col gap-5 px-3 md:w-[60vw] md:gap-6 md:px-4 lg:w-[45vw]"
        style={{ perspective: "1000px" }}
      >
        {/* Image */}
        <div
          ref={imageRef}
          className="relative cursor-pointer overflow-hidden"
          style={{ transformStyle: "preserve-3d" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            setLightboxIndex(0);
            setLightboxOpen(true);
          }}
        >
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || name}
              width={1200}
              height={800}
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Image count badge */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 rounded-full bg-charcoal-950/70 px-3 py-1 text-xs text-cream-200 backdrop-blur-sm">
              {images.length} photos
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-3">
          <AnimatedText
            as="h3"
            className="font-serif text-3xl text-cream-50 md:text-4xl lg:text-5xl"
            splitBy="chars"
            stagger={0.02}
          >
            {name}
          </AnimatedText>

          <div className="flex gap-4 text-xs tracking-[0.15em] text-oak-400 uppercase">
            {woodType && <span>{woodType}</span>}
            {dimensions && (
              <>
                <span className="text-charcoal-600">|</span>
                <span>{dimensions}</span>
              </>
            )}
          </div>

          {description && (
            <p className="max-w-lg text-sm text-cream-300/70 leading-relaxed line-clamp-3">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Lightbox — portaled to body to escape GSAP transform containing block */}
      {lightboxOpen && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-950/95 backdrop-blur-md"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-6 right-6 text-cream-200 hover:text-cream-50 text-2xl z-10"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close lightbox"
          >
            ✕
          </button>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-200 hover:text-cream-50 text-4xl z-10 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
                }}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-cream-200 hover:text-cream-50 text-4xl z-10 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev + 1) % images.length);
                }}
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

          <div
            className="max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt || name}
              width={1800}
              height={1200}
              className="max-h-[85vh] w-auto object-contain"
              unoptimized
            />
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  className={`h-12 w-16 overflow-hidden border-2 transition-all ${
                    i === lightboxIndex
                      ? "border-oak-400 opacity-100"
                      : "border-transparent opacity-50 hover:opacity-75"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(i);
                  }}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || ""}
                    width={80}
                    height={60}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  );
}
