'use client';
import AppHeader from '@/components/AppHeader';
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { LayoutDashboard, Newspaper as NewspaperIcon, PlusSquare, Users, LogOut, UserCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockPublishers } from '@/data/mock'; // Still used for publisher avatar if needed, based on ID.

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, userId, userName, logout } = useAuth(); // userId is numeric, userName available
  const pathname = usePathname();

  // Find publisher details from mock data for avatar, using numeric userId
  // This assumes mockPublishers contains a publisher with the logged-in userId for avatar purposes.
  // In a real scenario, publisher details (like avatar) would come from an API or be part of useAuth state.
  const publisherDetails = role === 'publisher' && userId 
    ? mockPublishers.find(p => p.id === userId) 
    : null;

  const publisherNavItems = [
    { href: '/publisher', label: 'My Articles', icon: LayoutDashboard },
    { href: '/publisher/post', label: 'Post New Article', icon: PlusSquare },
  ];

  const subscriberNavItems = [
    { href: '/subscriber', label: 'News Feed', icon: NewspaperIcon },
    { href: '/subscriber/subscriptions', label: 'Manage Subscriptions', icon: Users },
  ];

  const navItems = role === 'publisher' ? publisherNavItems : subscriberNavItems;

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar 
        side="left" 
        collapsible="icon" 
        variant="sidebar" 
        className="border-r bg-card shadow-md"
      >
        <SidebarHeader className="p-4 flex flex-col items-center group-data-[collapsible=icon]:hidden">
           {role === 'publisher' ? (
            <>
              <Avatar className="h-16 w-16 mb-2">
                {/* Use publisherDetails from mock for avatar, or a fallback */}
                <AvatarImage src={publisherDetails?.avatarUrl || `https://placehold.co/100x100.png?text=${userName ? userName.substring(0,2).toUpperCase() : 'P'}`} alt={userName || 'Publisher'} data-ai-hint="logo publisher" />
                <AvatarFallback>{userName ? userName.substring(0,2).toUpperCase() : "P"}</AvatarFallback>
              </Avatar>
              <p className="font-semibold text-sm">{userName || 'Publisher'}</p>
              <p className="text-xs text-muted-foreground capitalize">{role}</p>
            </>
           ) : ( // Subscriber
            <>
              <UserCircle className="h-16 w-16 mb-2 text-primary"/>
              <p className="font-semibold text-sm capitalize">{userName || role}</p>
            </>
           )}
        </SidebarHeader>
        <SidebarContent className="p-2 flex-grow">
          <SidebarMenu>
            {navItems.map(item => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton 
                    isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))} 
                    tooltip={{children: item.label, side: 'right', align: 'center'}}
                    className="hover:bg-primary/10 data-[active=true]:bg-primary/20 data-[active=true]:text-primary"
                  >
                    <item.icon className="group-data-[collapsible=icon]:text-primary" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2 border-t group-data-[collapsible=icon]:hidden">
          <Button variant="ghost" onClick={logout} className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive">
            <LogOut size={16} />
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>
      
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
