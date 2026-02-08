"use client";

import TimelineReveal from "./TimelineReveal";

interface SectionImage {
  url: string;
  alt?: string | null;
  role: string;
}

interface CraftsmanshipSectionProps {
  body?: string | null;
  images: SectionImage[];
}

export default function CraftsmanshipSection({
  images,
}: CraftsmanshipSectionProps) {
  const featureImages = images.filter((img) => img.role === "feature");

  const steps = [
    {
      title: "Sourcing the Oak",
      description:
        "We journey to ancient forests, seeking oak with extraordinary character. Each tree is selected for its dramatic grain patterns, natural splits, and the kind of beauty that centuries of growth create. Only the most exceptional specimens become our raw material.",
      image: featureImages[0]?.url || "",
      imageAlt: featureImages[0]?.alt || "Sourcing oak wood",
    },
    {
      title: "Shaping the Form",
      description:
        "With respect for the wood's natural curves, our artisans carefully shape each slab. The live edge is preserved in its raw glory — every undulation, every bark impression tells a story. The natural voids are filled with hand-poured resin in jewel tones that catch the light.",
      image: featureImages[1]?.url || "",
      imageAlt: featureImages[1]?.alt || "Shaping the wood",
    },
    {
      title: "The Final Touch",
      description:
        "Multiple layers of hand-rubbed oil bring the grain to life, creating a surface that's warm to the touch and deep with character. Each table is finished with our signature satin sheen — protective enough for daily use, beautiful enough for a gallery.",
      image: featureImages[2]?.url || "",
      imageAlt: featureImages[2]?.alt || "Finishing process",
    },
  ];

  return (
    <section
      id="craftsmanship"
      className="relative overflow-hidden bg-charcoal-950 py-20 md:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        {/* Header */}
        <div className="mb-8 text-center md:mb-12">
          <span className="inline-block text-xl md:text-2xl tracking-[0.3em] text-oak-400 uppercase">
            Craftsmanship
          </span>
        </div>

        {/* Timeline */}
        <TimelineReveal steps={steps} />
      </div>
    </section>
  );
}
