"use client";

import ContactForm from "./ContactForm";

export default function InvitationSection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-20 md:py-32 lg:py-40"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950 via-charcoal-900 to-charcoal-950" />

      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-oak-500/[0.03] blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-teal-500/[0.03] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        {/* Header */}
        <div className="mb-8 text-center md:mb-12">
          <span className="inline-block text-xl md:text-2xl font-medium tracking-[0.3em] text-oak-400/80 uppercase">
            Commission a Piece
          </span>
        </div>

        {/* Form */}
        <div className="mx-auto max-w-2xl">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
