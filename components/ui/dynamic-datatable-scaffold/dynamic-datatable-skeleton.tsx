import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { DataTableSkeletonProps } from "./types";

export function DynamicDataTableSkeleton({
  columns = 5,
  rows = 10,
  showPagination = true,
  showSearch = true,
  className,
}: DataTableSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {showSearch && (
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-9 w-full sm:max-w-xs" />
          <Skeleton className="h-9 w-24 hidden sm:block" />
        </div>
      )}

      <div className="rounded-md border">
        <div className="overflow-hidden">
          <div className="border-b bg-muted/30">
            <div className="flex">
              {Array.from({ length: columns }).map((_, i) => (
                <div
                  key={`header-${i}`}
                  className="flex-1 px-4 py-3"
                  style={{ minWidth: i === 0 ? 50 : 120 }}
                >
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>

          <div>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className={cn(
                  "flex border-b last:border-0",
                  rowIndex % 2 === 1 && "bg-muted/20"
                )}
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className="flex-1 px-4 py-3"
                    style={{ minWidth: colIndex === 0 ? 50 : 120 }}
                  >
                    <Skeleton
                      className={cn(
                        "h-4",
                        colIndex === 0 ? "w-8" : colIndex % 3 === 0 ? "w-full" : "w-2/3"
                      )}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showPagination && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-1 ml-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
