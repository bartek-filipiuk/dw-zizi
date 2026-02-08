"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen items-center justify-center bg-charcoal-950">
      <div className="text-center">
        <h2 className="mb-4 font-serif text-2xl text-cream-50">
          Something went wrong
        </h2>
        <p className="mb-6 text-sm text-charcoal-400">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={reset}
          className="border border-oak-400/60 px-6 py-2 text-sm text-cream-50 transition-colors hover:bg-oak-500/10"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
