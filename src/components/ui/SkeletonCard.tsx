export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-white/5 border border-white/8 animate-pulse ${className}`} />
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/3">
      <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
      <div className="h-4 w-16 bg-white/5 rounded animate-pulse ml-auto" />
      <div className="h-4 w-16 bg-white/5 rounded animate-pulse" />
    </div>
  );
}
