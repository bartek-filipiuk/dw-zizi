"use client";

import { useState, useCallback } from "react";
import SmoothScroll from "./SmoothScroll";
import CustomCursor from "./CustomCursor";
import PageLoader from "./PageLoader";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import PhilosophySection from "./PhilosophySection";
import GallerySection from "./GallerySection";
import CraftsmanshipSection from "./CraftsmanshipSection";
import InvitationSection from "./InvitationSection";
import Footer from "./Footer";

interface SectionData {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  body?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  images: {
    id: string;
    url: string;
    alt?: string | null;
    role: string;
  }[];
}

interface GalleryItemData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  woodType?: string | null;
  dimensions?: string | null;
  images: {
    id: string;
    url: string;
    alt?: string | null;
    type: string;
  }[];
}

interface MenuItemData {
  id: string;
  label: string;
  href: string;
}

interface SettingData {
  key: string;
  value: string;
}

interface LandingPageProps {
  sections: SectionData[];
  galleryItems: GalleryItemData[];
  menuItems: MenuItemData[];
  settings: SettingData[];
}

export default function LandingPage({
  sections,
  galleryItems,
  menuItems,
  settings,
}: LandingPageProps) {
  const [loaderDone, setLoaderDone] = useState(false);

  const handleLoaderComplete = useCallback(() => {
    setLoaderDone(true);
  }, []);

  const getSection = (slug: string) =>
    sections.find((s) => s.slug === slug);

  const hero = getSection("hero");
  const philosophy = getSection("philosophy");
  const gallery = getSection("gallery");
  const craftsmanship = getSection("craftsmanship");
  const invitation = getSection("invitation");
  const footer = getSection("footer");

  const heroBackground = hero?.images.find((i) => i.role === "background");
  const philosophyFeature = philosophy?.images.find(
    (i) => i.role === "feature"
  );

  return (
    <SmoothScroll>
      <CustomCursor />
      <PageLoader onComplete={handleLoaderComplete} />

      <Navbar menuItems={menuItems} siteName="DW ZIZI" />

      <main>
        {hero && (
          <HeroSection
            title={hero.title}
            subtitle={hero.subtitle || ""}
            ctaText={hero.ctaText}
            ctaLink={hero.ctaLink}
            backgroundImage={heroBackground?.url}
          />
        )}

        {philosophy && (
          <PhilosophySection
            title={philosophy.title}
            subtitle={philosophy.subtitle}
            body={philosophy.body}
            featureImage={philosophyFeature?.url}
            featureImageAlt={philosophyFeature?.alt || undefined}
          />
        )}

        {gallery && (
          <GallerySection
            items={galleryItems}
          />
        )}

        {craftsmanship && (
          <CraftsmanshipSection
            images={craftsmanship.images}
          />
        )}

        {invitation && (
          <InvitationSection />
        )}
      </main>

      {footer && (
        <Footer
          siteName={footer.title}
          subtitle={footer.subtitle}
          body={footer.body}
          settings={settings}
        />
      )}
    </SmoothScroll>
  );
}
