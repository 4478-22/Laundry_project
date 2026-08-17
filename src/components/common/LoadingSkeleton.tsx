import type { ReactNode } from "react";

export function SkeletonCard() {
  return (
    <div className="card animate-pulse p-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-neutral-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded bg-neutral-200" />
          <div className="h-3 w-32 rounded bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export function SkeletonSection({ title: _title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="h-4 w-20 rounded bg-neutral-200" />
      {children}
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="space-y-4 px-5">
      <div className="card animate-pulse p-5">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 rounded-2xl bg-neutral-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-28 rounded bg-neutral-200" />
            <div className="h-3 w-36 rounded bg-neutral-100" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="card h-24 animate-pulse p-4" />
        <div className="card h-24 animate-pulse p-4" />
      </div>
      <div className="card animate-pulse p-4">
        <div className="h-3 w-24 rounded bg-neutral-200" />
        <div className="mt-3 h-3 w-full rounded bg-neutral-100" />
        <div className="mt-2 h-3 w-3/4 rounded bg-neutral-100" />
      </div>
    </div>
  );
}
