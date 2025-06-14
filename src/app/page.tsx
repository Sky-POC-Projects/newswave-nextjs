'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { role, userId, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (role === 'publisher' && userId) {
        router.replace('/publisher');
      } else if (role === 'subscriber') {
        router.replace('/subscriber');
      } else {
        router.replace('/login');
      }
    }
  }, [role, userId, isLoading, router]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-lg font-semibold text-foreground font-headline">Loading NewsWave</p>
      <p className="text-sm text-muted-foreground">Please wait while we direct you...</p>
    </div>
  );
}
