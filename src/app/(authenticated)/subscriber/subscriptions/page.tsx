// src/app/(authenticated)/subscriber/subscriptions/page.tsx
'use client';

import { useSubscriptions } from '@/hooks/useSubscriptions';
import PublisherCard from '@/components/PublisherCard';
import { Loader2, Rss } from 'lucide-react';
import { mockPublishers } from '@/data/mock'; // Import mockPublishers directly
import type { Publisher } from '@/types'; // Ensure Publisher type is available

export default function SubscriptionManagementPage() {
  // isLoading from useSubscriptions now primarily reflects ongoing API call status for sub/unsub
  const { subscribedPublisherIds, subscribe, unsubscribe, isLoading: isSubscriptionOperationLoading } = useSubscriptions();
  
  // Get the list of all available publishers directly from mock data
  const allPublishers: Publisher[] = mockPublishers;

  // The main page loader for "Loading publishers..." is removed because `allPublishers` is now synchronous.
  // `isSubscriptionOperationLoading` can be used to show loading states on individual cards or disable buttons if needed.

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-headline font-bold text-primary mb-2">Manage Subscriptions</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Discover and subscribe to publishers to personalize your news feed. Unsubscribe anytime.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          (Note: Publisher list is from local data. Subscriptions are managed via API. Initial subscriptions are not loaded from API due to its limitations.)
        </p>
      </div>

      {allPublishers.length === 0 ? (
         <div className="text-center py-12 border-2 border-dashed border-border rounded-lg bg-card">
          <Rss className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Publishers Available</h2>
          <p className="text-muted-foreground">There are currently no publishers listed in the mock data. Check back later or update the mock data.</p>
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
