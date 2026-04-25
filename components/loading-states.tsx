import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4 shadow-sm">
          <Skeleton className="mb-2 h-6 w-3/4" />
          <Skeleton className="mb-1 h-4 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <div className="flex gap-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function ListSkeleton({ items = 4 }: { items?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-md border p-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <Skeleton className="mb-2 h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="mt-2 h-3 w-2/3" />
    </div>
  );
}

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-1">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-1/3" />
    </div>
  );
}

export function KanbanColumnSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3">
      <Skeleton className="h-6 w-1/2" />
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="rounded-md border bg-background p-3 shadow-sm">
          <Skeleton className="mb-2 h-5 w-3/4" />
          <Skeleton className="mb-1 h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
      <div className="flex gap-4">
        <Skeleton className="h-48 flex-1 rounded-lg" />
        <Skeleton className="h-48 flex-1 rounded-lg" />
      </div>
    </div>
  );
}
