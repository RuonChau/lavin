import { GlassCard } from "@/shared/components/GlassCard";


export function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <GlassCard key={index} className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <div className="h-10 w-10 animate-pulse rounded-2xl bg-white/60" />
              <div className="h-6 w-16 animate-pulse rounded-full bg-white/60" />
            </div>
            <div className="h-3 w-28 animate-pulse rounded-full bg-white/60" />
            <div className="mt-3 h-8 w-36 animate-pulse rounded-full bg-white/60" />
          </GlassCard>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <GlassCard className="h-80 p-6 lg:col-span-2">
          <div className="h-full animate-pulse rounded-2xl bg-white/45" />
        </GlassCard>
        <GlassCard className="h-80 p-6">
          <div className="h-full animate-pulse rounded-2xl bg-white/45" />
        </GlassCard>
      </div>
    </>
  );
}
