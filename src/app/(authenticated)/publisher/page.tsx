// src/app/(authenticated)/publisher/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getPublisherDetails, mapApiNewsItemToArticle } from '@/services/apiService';
import type { Article } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2, AlertTriangle, ServerCrash, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


export default function PublisherDashboardPage() {
  const { userId: publisherApiId, userName: authUserName, isLoading: authLoading, role } = useAuth();
  const { toast } = useToast();
  
  const [publisherArticles, setPublisherArticles] = useState<Article[]>([]);
  const [publisherName, setPublisherName] = useState<string | null>(authUserName); // Initialize with auth's userName
  const [isLoading, setIsLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && publisherApiId && role === 'publisher') {
      setIsLoading(true);
      setErrorLoading(null);
      getPublisherDetails(publisherApiId)
        .then(async (data) => {
          setPublisherName(data.name); // Update publisher name from API response
          if (data.newsFeed && data.newsFeed.length > 0) {
            const articlesPromises = data.newsFeed.map(item => mapApiNewsItemToArticle(item));
            const articles = await Promise.all(articlesPromises);
            // Sort articles by publishDate, newest first
            articles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
            setPublisherArticles(articles);
          } else {
            setPublisherArticles([]);
          }
        })
        .catch(err => {
          console.error("Failed to fetch publisher articles:", err);
          setErrorLoading("Could not load your articles. Please try again later.");
          toast({
            title: "Error Loading Articles",
            description: err.message || "Failed to fetch articles from the server.",
            variant: "destructive",
          });
          setPublisherArticles([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (!authLoading && (role !== 'publisher' || !publisherApiId)) {
      // Not a publisher or no ID, clear articles and stop loading
      setPublisherArticles([]);
      setPublisherName(null);
      setIsLoading(false);
    }
  }, [publisherApiId, authLoading, role, toast]);

  if (isLoading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading your articles...</p>
      </div>
    );
  }

  if (errorLoading) {
     return (
      <div className="text-center py-12 border-2 border-dashed border-destructive/50 rounded-lg bg-destructive/10">
        <ServerCrash className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold text-destructive mb-2">Failed to Load Articles</h2>
        <p className="text-muted-foreground mb-6">{errorLoading}</p>
         <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">{publisherName || 'My'} Published Articles</h1>
          <p className="text-sm text-muted-foreground">Articles published via NewsWave.</p>
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
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Articles Published Yet</h2>
          <p className="text-muted-foreground mb-6">You haven't published any articles. Start by creating your first one!</p>
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
