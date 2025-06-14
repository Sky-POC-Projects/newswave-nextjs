'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { mockArticles } from '@/data/mock';
import type { Article } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import { Loader2, FileText, Rss } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function SubscriberFeedContent() {
  const searchParams = useSearchParams();
  const { subscribedPublisherIds, isLoading: subscriptionsLoading } = useSubscriptions();
  
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
    if (!subscriptionsLoading) {
      if (subscribedPublisherIds.length > 0) {
        const articles = mockArticles
          .filter(article => subscribedPublisherIds.includes(article.authorId))
          .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
          .slice(0, displayCount);
        setFeedArticles(articles);
      } else {
        setFeedArticles([]); // Clear articles if no subscriptions
      }
      setIsLoading(false);
    }
  }, [subscribedPublisherIds, subscriptionsLoading, displayCount]);

  if (isLoading || subscriptionsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading your news feed...</p>
      </div>
    );
  }
  
  if (subscribedPublisherIds.length === 0) {
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

  if (feedArticles.length === 0) {
     return (
      <div className="text-center py-12 border-2 border-dashed border-border rounded-lg bg-card">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">No Articles to Show</h2>
        <p className="text-muted-foreground">Your subscribed publishers haven't posted anything recently, or there are no articles matching your current settings.</p>
         <p className="text-xs text-muted-foreground mt-2">(Displaying {displayCount} articles)</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-headline font-bold text-primary">Your News Feed</h1>
        <p className="text-sm text-muted-foreground">Showing latest {feedArticles.length} of {displayCount} articles from your subscriptions.</p>
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
