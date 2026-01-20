import { Suspense } from 'react';
import { LoginView } from '@/modules/login/view/login.view';

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageSkeleton />}>
      <LoginView />
    </Suspense>
  );
}

function LoginPageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="h-9 w-48 bg-gray-200 rounded animate-pulse mx-auto" />
          <div className="h-5 w-64 bg-gray-200 rounded animate-pulse mx-auto mt-2" />
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md space-y-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
