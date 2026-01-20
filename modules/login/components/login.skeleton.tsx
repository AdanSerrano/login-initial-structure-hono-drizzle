'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function LoginSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md animate-fade-in shadow-xl">
        <CardHeader className="space-y-2">
          <Skeleton className="h-8 w-32 mx-auto animate-fade-in stagger-1" />
          <Skeleton className="h-4 w-48 mx-auto animate-fade-in stagger-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 animate-fade-in stagger-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2 animate-fade-in stagger-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-4 w-40 animate-fade-in stagger-3" />
        </CardContent>
        <CardFooter className="flex flex-col gap-4 animate-fade-in stagger-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </CardFooter>
      </Card>
    </div>
  );
}
