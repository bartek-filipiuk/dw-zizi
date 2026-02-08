"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(ScrollTrigger);

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const fields = fieldsRef.current;
    if (!fields) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setRevealed(true);
      return;
    }

    const inputs = fields.querySelectorAll(".form-field");
    gsap.fromTo(
      inputs,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: fields,
          start: "top 85%",
          once: true,
        },
        onStart: () => setRevealed(true),
      }
    );

    // Fallback: always reveal after 2s
    const timer = setTimeout(() => setRevealed(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(formRef.current!);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to send message");
      }

      setIsSuccess(true);
      formRef.current?.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-xl border border-oak-500/20 bg-charcoal-950/50 p-12 text-center backdrop-blur-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-oak-400/30 bg-oak-500/10">
          <span className="text-2xl text-oak-400">✦</span>
        </div>
        <h3 className="mb-2 font-serif text-2xl text-cream-50">Thank You</h3>
        <p className="text-cream-300/70">
          We&apos;ve received your message and will be in touch soon.
        </p>
      </div>
    );
  }

  const inputClasses =
    "w-full border border-charcoal-700/50 rounded-lg bg-charcoal-800/50 px-4 py-3.5 text-sm text-cream-50 placeholder-charcoal-500 outline-none transition-all duration-300 focus:border-oak-400/60 focus:bg-charcoal-800/80 focus:ring-1 focus:ring-oak-400/20";

  return (
    <div className="rounded-xl border border-charcoal-700/30 bg-charcoal-950/40 p-8 backdrop-blur-sm md:p-10">
      <form ref={formRef} onSubmit={handleSubmit}>
        <div ref={fieldsRef} className="space-y-5">
          <div className={`form-field ${revealed ? "" : "opacity-0"}`}>
            <label
              htmlFor="name"
              className="mb-2.5 block text-[11px] font-medium tracking-[0.2em] text-cream-200/60 uppercase"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              minLength={2}
              className={inputClasses}
              placeholder="Your full name"
            />
          </div>

          <div className={`form-field ${revealed ? "" : "opacity-0"}`}>
            <label
              htmlFor="email"
              className="mb-2.5 block text-[11px] font-medium tracking-[0.2em] text-cream-200/60 uppercase"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className={inputClasses}
              placeholder="your@email.com"
            />
          </div>

          <div className={`form-field ${revealed ? "" : "opacity-0"}`}>
            <label
              htmlFor="phone"
              className="mb-2.5 block text-[11px] font-medium tracking-[0.2em] text-cream-200/60 uppercase"
            >
              Phone{" "}
              <span className="text-charcoal-500 normal-case tracking-normal">
                (optional)
              </span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={inputClasses}
              placeholder="+48 123 456 789"
            />
          </div>

          <div className={`form-field ${revealed ? "" : "opacity-0"}`}>
            <label
              htmlFor="message"
              className="mb-2.5 block text-[11px] font-medium tracking-[0.2em] text-cream-200/60 uppercase"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              minLength={10}
              rows={5}
              className={`${inputClasses} resize-none`}
              placeholder="Tell us about your dream table..."
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="mt-8">
          <MagneticButton
            className="w-full rounded-lg border border-oak-400/40 bg-gradient-to-r from-oak-600/80 to-oak-500/80 py-4 text-sm font-medium tracking-[0.15em] text-cream-50 uppercase shadow-lg shadow-oak-900/30 transition-all duration-300 hover:border-oak-400/70 hover:from-oak-600 hover:to-oak-500 hover:shadow-oak-800/40 disabled:opacity-50"
            onClick={() => formRef.current?.requestSubmit()}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </MagneticButton>
        </div>
      </form>
    </div>
  );
}
