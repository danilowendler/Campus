import { cn } from "@/lib/utils";

function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn("rounded-lg animate-pulse", className)}
      style={{ background: "rgba(255,255,255,0.06)", ...style }}
      aria-hidden="true"
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div
      className="flex flex-col gap-4 p-5 rounded-[var(--radius-lg)]"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bone className="w-8 h-8 rounded-lg flex-shrink-0" />
          <Bone className="h-3 w-24" />
        </div>
        <Bone className="h-5 w-16 rounded-full" />
      </div>

      {/* Title + desc */}
      <div className="flex flex-col gap-2">
        <Bone className="h-4 w-3/4" />
        <Bone className="h-3 w-full" />
        <Bone className="h-3 w-5/6" />
      </div>

      {/* Skills */}
      <div className="flex gap-1.5">
        <Bone className="h-5 w-16 rounded-full" />
        <Bone className="h-5 w-20 rounded-full" />
        <Bone className="h-5 w-14 rounded-full" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <Bone key={i} className="w-7 h-7 rounded-full -ml-1 first:ml-0" />
          ))}
        </div>
        <Bone className="h-7 w-20 rounded-lg" />
      </div>
    </div>
  );
}

export function ProjectsFeedSkeleton() {
  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-10 sm:px-6">
      {/* Page header */}
      <div className="flex flex-col gap-1 mb-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Bone className="h-8 w-36" />
            <Bone className="h-3 w-48" />
          </div>
          <Bone className="h-9 w-32 rounded-xl mt-1" />
        </div>
        <Bone className="h-9 w-52 rounded-xl mt-6" />
      </div>

      {/* Grid */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))" }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <div className="w-full">
      {/* Cover */}
      <Bone className="w-full h-32 rounded-2xl" />

      {/* Info row */}
      <div className="flex items-end justify-between gap-4 px-1 -mt-7">
        <Bone className="w-16 h-16 rounded-full" style={{ flexShrink: 0 }} />
        <Bone className="h-8 w-28 rounded-xl mb-1" />
      </div>

      {/* Name / meta / bio */}
      <div className="mt-4 px-1 flex flex-col gap-2">
        <Bone className="h-7 w-48" />
        <div className="flex gap-2">
          <Bone className="h-5 w-36 rounded-full" />
          <Bone className="h-5 w-40 rounded-full" />
        </div>
        <Bone className="h-3 w-full max-w-sm mt-1" />
        <Bone className="h-3 w-4/5 max-w-sm" />
        {/* Skills */}
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {[80, 64, 96, 72, 88].map((w, i) => (
            <Bone key={i} className="h-5 rounded-full" style={{ width: w }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProfilePageSkeleton() {
  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-10 sm:px-6 flex flex-col gap-10">
      <ProfileHeaderSkeleton />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1.5 p-4 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}
          >
            <Bone className="h-7 w-10" />
            <Bone className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Projects section */}
      <div className="flex flex-col gap-4">
        <Bone className="h-5 w-36" />
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))" }}
        >
          {[0, 1, 2].map((i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
