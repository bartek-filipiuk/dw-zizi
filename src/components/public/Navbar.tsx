"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface NavbarProps {
  menuItems: { id: string; label: string; href: string }[];
  siteName: string;
}

export default function Navbar({ menuItems, siteName }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);

    // Track active section
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveSection(section.id),
        onEnterBack: () => setActiveSection(section.id),
      });
    });

    // Initial fade-in
    gsap.fromTo(
      navRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: 2.5, ease: "power3.out" }
    );

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 opacity-0 ${
        isScrolled
          ? "bg-charcoal-950/80 backdrop-blur-xl border-b border-oak-800/20 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 md:px-12 lg:px-6">
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="font-serif text-xl tracking-[0.3em] text-cream-50 uppercase"
        >
          {siteName}
        </a>

        {/* Desktop menu */}
        <div className="hidden items-center gap-8 md:flex">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="group relative py-2 text-sm tracking-[0.15em] text-cream-200 uppercase transition-colors hover:text-cream-50"
            >
              {item.label}
              <span
                className={`absolute bottom-0 left-0 h-[1px] bg-oak-400 transition-all duration-300 ${
                  activeSection === item.href.replace("#", "")
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              />
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-[1px] w-6 bg-cream-100 transition-all duration-300 ${
              isMobileOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[1px] w-6 bg-cream-100 transition-all duration-300 ${
              isMobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-[1px] w-6 bg-cream-100 transition-all duration-300 ${
              isMobileOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-500 md:hidden ${
          isMobileOpen ? "max-h-80" : "max-h-0"
        }`}
      >
        <div className="flex flex-col items-center gap-6 bg-charcoal-950/95 backdrop-blur-xl py-8">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-sm tracking-[0.2em] text-cream-200 uppercase transition-colors hover:text-cream-50"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
