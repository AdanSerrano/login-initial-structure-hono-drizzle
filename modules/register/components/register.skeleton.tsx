'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function RegisterSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md animate-fade-in shadow-xl">
        <CardHeader className="space-y-2">
          <Skeleton className="h-8 w-40 mx-auto animate-fade-in stagger-1" />
          <Skeleton className="h-4 w-56 mx-auto animate-fade-in stagger-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 animate-fade-in stagger-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2 animate-fade-in stagger-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2 animate-fade-in stagger-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2 animate-fade-in stagger-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2 animate-fade-in stagger-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 animate-fade-in stagger-5">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-40 mx-auto" />
        </CardFooter>
      </Card>
    </div>
  );
}
