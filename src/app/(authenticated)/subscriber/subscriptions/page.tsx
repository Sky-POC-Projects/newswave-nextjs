// src/app/(authenticated)/subscriber/subscriptions/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import PublisherCard from '@/components/PublisherCard';
import { Loader2, Rss, ServerCrash } from 'lucide-react';
import type { Publisher } from '@/types';
import { getAllPublishers } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

export default function SubscriptionManagementPage() {
  const { subscribedPublisherIds, subscribe, unsubscribe, isLoading: isSubscriptionOperationLoading } = useSubscriptions();
  const { toast } = useToast();
  
  const [allPublishers, setAllPublishers] = useState<Publisher[]>([]);
  const [isLoadingPublishers, setIsLoadingPublishers] = useState(true);
  const [errorLoadingPublishers, setErrorLoadingPublishers] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPublishers() {
      try {
        setIsLoadingPublishers(true);
        setErrorLoadingPublishers(null);
        const publishers = await getAllPublishers();
        setAllPublishers(publishers);
      } catch (error) {
        console.error("Failed to fetch publishers:", error);
        setErrorLoadingPublishers("Could not load publishers. Please try again later.");
        toast({
          title: "Error Loading Publishers",
          description: "Failed to fetch the list of available publishers from the server.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingPublishers(false);
      }
    }
    fetchPublishers();
  }, [toast]);

  if (isLoadingPublishers) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading publishers...</p>
      </div>
    );
  }

  if (errorLoadingPublishers) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-destructive/50 rounded-lg bg-destructive/10">
        <ServerCrash className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold text-destructive mb-2">Failed to Load Publishers</h2>
        <p className="text-muted-foreground mb-6">{errorLoadingPublishers}</p>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-headline font-bold text-primary mb-2">Manage Subscriptions</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Discover and subscribe to publishers to personalize your news feed. Unsubscribe anytime.
        </p>
         <p className="text-xs text-muted-foreground mt-1">
          (Subscriptions are managed via API. Initial subscriptions are not pre-loaded from API due to its limitations.)
        </p>
      </div>

      {allPublishers.length === 0 ? (
         <div className="text-center py-12 border-2 border-dashed border-border rounded-lg bg-card">
          <Rss className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Publishers Available</h2>
          <p className="text-muted-foreground">There are currently no publishers listed. Check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fadeIn">
          {allPublishers.map((publisher) => (
            <PublisherCard
              key={publisher.id}
              publisher={publisher}
              isSubscribed={subscribedPublisherIds.includes(publisher.id)}
              onSubscribe={() => subscribe(publisher.id)}
              onUnsubscribe={() => unsubscribe(publisher.id)}
              // Optionally pass `isSubscriptionOperationLoading` to PublisherCard 
              // if you want to disable buttons or show loading state on the card itself.
              // For example: disabled={isSubscriptionOperationLoading} on buttons inside PublisherCard
            />
          ))}
        </div>
      )}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
