'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Newspaper, UserCircle } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
// mockPublishers is no longer the primary source for the logged-in publisher's name.
// We use userName from useAuth now.

export default function AppHeader() {
  const { logout, role, userName } = useAuth(); // userName is now directly from useAuth

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <SidebarTrigger className="mr-2 md:hidden text-foreground hover:text-primary" />
        <Link href={role === 'publisher' ? '/publisher' : '/subscriber'} className="flex items-center gap-2 mr-auto" aria-label="NewsWave Home">
          <Newspaper className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-headline font-bold text-primary">NewsWave</h1>
        </Link>
        <div className="flex items-center gap-4">
          {role && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserCircle className="h-5 w-5" />
              <span className="capitalize">
                {/* Display the role and the user's name from useAuth */}
                {role}: {userName || (role === 'publisher' ? 'Publisher' : 'Subscriber')}
              </span>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={logout} className="text-foreground hover:bg-secondary hover:text-secondary-foreground">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
