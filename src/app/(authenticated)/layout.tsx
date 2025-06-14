'use client';
import AppHeader from '@/components/AppHeader';
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarInset, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { LayoutDashboard, Newspaper as NewspaperIcon, PlusSquare, Users, Settings, LogOut, UserCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockPublishers } from '@/data/mock';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, userId, logout } = useAuth();
  const pathname = usePathname();

  const publisher = role === 'publisher' && userId ? mockPublishers.find(p => p.id === userId) : null;

  const publisherNavItems = [
    { href: '/publisher', label: 'My Articles', icon: LayoutDashboard },
    { href: '/publisher/post', label: 'Post New Article', icon: PlusSquare },
  ];

  const subscriberNavItems = [
    { href: '/subscriber', label: 'News Feed', icon: NewspaperIcon },
    { href: '/subscriber/subscriptions', label: 'Manage Subscriptions', icon: Users },
    // Future: { href: '/subscriber/settings', label: 'Feed Settings', icon: Settings },
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
           {role === 'publisher' && publisher ? (
            <>
              <Avatar className="h-16 w-16 mb-2">
                <AvatarImage src={publisher.avatarUrl} alt={publisher.name} data-ai-hint="logo publisher" />
                <AvatarFallback>{publisher.name.substring(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <p className="font-semibold text-sm">{publisher.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{role}</p>
            </>
           ) : (
            <>
              <UserCircle className="h-16 w-16 mb-2 text-primary"/>
              <p className="font-semibold text-sm capitalize">{role}</p>
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
