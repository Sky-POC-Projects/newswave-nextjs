'use client';

import { useSubscriptions } from '@/hooks/useSubscriptions';
import PublisherCard from '@/components/PublisherCard';
import { Loader2, Rss } from 'lucide-react';

export default function SubscriptionManagementPage() {
  const { allPublishers, subscribedPublisherIds, subscribe, unsubscribe, isLoading } = useSubscriptions();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading publishers...</p>
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
      </div>

      {allPublishers.length === 0 ? (
         <div className="text-center py-12 border-2 border-dashed border-border rounded-lg bg-card">
          <Rss className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Publishers Available</h2>
          <p className="text-muted-foreground">Check back later for new publishers to follow.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fadeIn">
          {allPublishers.map((publisher) => (
            <PublisherCard
              key={publisher.id}
              publisher={publisher}
              isSubscribed={subscribedPublisherIds.includes(publisher.id)}
              onSubscribe={subscribe}
              onUnsubscribe={unsubscribe}
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
