"use client";

import HorizontalScroll from "./HorizontalScroll";
import GalleryItem from "./GalleryItem";

interface GalleryImage {
  id: string;
  url: string;
  alt?: string | null;
  type: string;
}

interface GalleryItemData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  woodType?: string | null;
  dimensions?: string | null;
  images: GalleryImage[];
}

interface GallerySectionProps {
  items: GalleryItemData[];
}

export default function GallerySection({
  items,
}: GallerySectionProps) {
  return (
    <section id="gallery" className="relative bg-charcoal-900 py-20 md:py-32 lg:py-40">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 mb-8 md:mb-12">
        <div className="text-center">
          <span className="text-xl md:text-2xl tracking-[0.3em] text-oak-400 uppercase">
            The Collection
          </span>
        </div>
      </div>

      {/* Horizontal scroll gallery */}
      <HorizontalScroll>
        {/* Left spacer */}
        <div className="w-[10vw] flex-shrink-0" />

        {items.map((item, i) => (
          <GalleryItem
            key={item.id}
            name={item.name}
            description={item.description}
            woodType={item.woodType}
            dimensions={item.dimensions}
            images={item.images}
            index={i}
          />
        ))}

        {/* Right spacer */}
        <div className="w-[10vw] flex-shrink-0" />
      </HorizontalScroll>
    </section>
  );
}
