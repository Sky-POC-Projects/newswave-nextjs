'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSubscriptions } from '@/hooks/useSubscriptions'; // For context if needed, not directly for subscribed IDs here
import { useAuth } from '@/hooks/useAuth';
import { getSubscriberFeed, mapApiNewsItemToArticle } from '@/services/apiService';
import type { Article, Publisher } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import { Loader2, FileText, Rss } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { mockPublishers } // Using mockPublishers to potentially enrich article data if needed.
from '@/data/mock';


function SubscriberFeedContent() {
  const searchParams = useSearchParams();
  const { userId: subscriberId, isLoading: authLoading, role } = useAuth();
  const { subscribedPublisherIds, isLoading: subscriptionsLoading } = useSubscriptions(); // To check if there are any subscriptions at all for the empty state.

  const [feedArticles, setFeedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(10);

  useEffect(() => {
    const countParam = searchParams.get('count');
    if (countParam && !isNaN(parseInt(countParam))) {
      setDisplayCount(Math.max(1, parseInt(countParam)));
    } else {
      setDisplayCount(10); // Default count
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && subscriberId && role === 'subscriber') {
      setIsLoading(true);
      getSubscriberFeed(subscriberId, displayCount)
        .then(apiNewsItems => {
          // Pass mockPublishers for potential enrichment, though current mapApiNewsItemToArticle doesn't use it heavily.
          const articles = apiNewsItems.map(item => mapApiNewsItemToArticle(item, mockPublishers));
          setFeedArticles(articles);
        })
        .catch(error => {
          console.error("Failed to fetch subscriber feed:", error);
          setFeedArticles([]);
          // Optionally show a toast message for the error
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (!authLoading && (role !== 'subscriber' || !subscriberId)) {
        setFeedArticles([]);
        setIsLoading(false);
    }
  }, [subscriberId, authLoading, role, displayCount]);

  if (isLoading || authLoading || subscriptionsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading your news feed...</p>
      </div>
    );
  }
  
  // Check based on subscribedPublisherIds from useSubscriptions for a more accurate empty state
  if (subscribedPublisherIds.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-border rounded-lg bg-card">
        <Rss className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Your Feed is Empty</h2>
        <p className="text-muted-foreground mb-6">You are not subscribed to any publishers yet. Discover publishers to personalize your feed.</p>
        <Link href="/subscriber/subscriptions" legacyBehavior passHref>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Manage Subscriptions
          </Button>
        </Link>
      </div>
    );
  }

  if (feedArticles.length === 0 && !isLoading) {
     return (
      <div className="text-center py-12 border-2 border-dashed border-border rounded-lg bg-card">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">No Articles to Show</h2>
        <p className="text-muted-foreground">Your subscribed publishers haven't posted anything recently, or there are no articles matching your current settings.</p>
         <p className="text-xs text-muted-foreground mt-2">(Displaying up to {displayCount} articles)</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-headline font-bold text-primary">Your News Feed</h1>
        <p className="text-sm text-muted-foreground">Showing latest {feedArticles.length} of up to {displayCount} articles from your subscriptions.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
        {feedArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
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


export default function SubscriberFeedPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading...</p>
      </div>
    }>
      <SubscriberFeedContent />
    </Suspense>
  );
}
