import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function AdminUsersSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-9 w-full sm:max-w-xs" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        {/* Table skeleton */}
        <div className="rounded-md border">
          <div className="border-b bg-muted/30">
            <div className="flex p-3">
              {[220, 200, 110, 140, 90, 150, 130, 50].map((width, i) => (
                <div key={i} className="px-2" style={{ minWidth: width }}>
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
          <div>
            {Array.from({ length: 10 }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex border-b last:border-0 p-3">
                {[220, 200, 110, 140, 90, 150, 130, 50].map((width, colIndex) => (
                  <div key={colIndex} className="px-2" style={{ minWidth: width }}>
                    {colIndex === 0 ? (
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    ) : (
                      <Skeleton className="h-4 w-2/3" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
