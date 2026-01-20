'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Card Skeleton */}
        <Card className="animate-fade-in shadow-xl">
          <CardHeader className="text-center">
            <Skeleton className="w-24 h-24 rounded-full mx-auto animate-fade-in stagger-1" />
            <Skeleton className="h-6 w-32 mx-auto mt-4 animate-fade-in stagger-2" />
            <Skeleton className="h-4 w-24 mx-auto mt-2 animate-fade-in stagger-2" />
          </CardHeader>
          <CardContent className="space-y-4 animate-fade-in stagger-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-8" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-8" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 animate-fade-in stagger-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-28" />
          </CardFooter>
        </Card>

        <Separator className="animate-fade-in stagger-4" />

        {/* Danger Zone Skeleton */}
        <Card className="animate-fade-in stagger-5 shadow-lg">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
