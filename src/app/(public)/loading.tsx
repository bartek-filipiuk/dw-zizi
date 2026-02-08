export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-charcoal-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-oak-400 border-t-transparent" />
        <p className="text-xs tracking-[0.2em] text-charcoal-400 uppercase">Loading</p>
      </div>
    </div>
  );
}
