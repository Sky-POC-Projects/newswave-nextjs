// src/app/(authenticated)/publisher/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { mockArticles } from '@/data/mock'; // Still using mockArticles
import type { Article } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2, AlertTriangle } from 'lucide-react';

export default function PublisherDashboardPage() {
  const { userId: publisherApiId, isLoading: authLoading, role } = useAuth(); // userId is numeric publisher ID
  const [publisherArticles, setPublisherArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && publisherApiId && role === 'publisher') {
      // API Limitation: No endpoint to fetch articles by publisher ID.
      // Continue filtering mockArticles. Ensure mockArticles.authorId is numeric.
      const articles = mockArticles.filter(article => article.authorId === publisherApiId)
                                   .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
      setPublisherArticles(articles);
      setIsLoading(false);
    } else if (!authLoading && (role !== 'publisher' || !publisherApiId)) {
      setIsLoading(false);
    }
  }, [publisherApiId, authLoading, role]);

  if (isLoading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading your articles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">My Published Articles</h1>
          <p className="text-sm text-muted-foreground">(Displaying from local mock data due to API limitations)</p>
        </div>
        <Link href="/publisher/post" legacyBehavior passHref>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="mr-2 h-5 w-5" />
            Post New Article
          </Button>
        </Link>
      </div>

      {publisherArticles.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg bg-card">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Articles Yet (in mock data for this publisher)</h2>
          <p className="text-muted-foreground mb-6">You haven't published any articles, or they are not in the local mock data for your ID. Start by creating your first one!</p>
          <Link href="/publisher/post" legacyBehavior passHref>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Your First Article
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {publisherArticles.map((article) => (
            // ArticleCard expects article.id to be number, which mockArticles now provide
            <ArticleCard key={article.id} article={article} />
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
