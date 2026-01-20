'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { VerifyMagicLinkView } from '@/modules/magic-link/view/verify-magic-link.view';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

function VerifyMagicLinkContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return <VerifyMagicLinkView token={token} />;
}

function VerifyMagicLinkSkeleton() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
        <CardTitle>Cargando...</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default function VerifyMagicLinkPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense fallback={<VerifyMagicLinkSkeleton />}>
        <VerifyMagicLinkContent />
      </Suspense>
    </div>
  );
}
