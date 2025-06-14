// src/components/ArticleCard.tsx
'use client';

import Image from 'next/image';
import type { Article } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const displaySummary = article.summary || (article.content && article.content.length > 150 ? article.content.substring(0, 147) + '...' : article.content);
  const authorNameToDisplay = article.authorName || "Unknown Author";
  // API does not provide image URL for feed items, use placeholder
  const imageUrlToDisplay = article.imageUrl || `https://placehold.co/600x400.png?text=News`;


  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col h-full">
      <CardHeader className="p-0">
        {/* Always show placeholder if actual URL isn't there or use defined one */}
        <div className="relative w-full h-48">
          <Image
            src={imageUrlToDisplay}
            alt={article.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint="news article illustration"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
         <div className="p-6">
          <CardTitle className="font-headline text-xl lg:text-2xl leading-tight mb-2">{article.title || "Untitled Article"}</CardTitle>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              <span>{authorNameToDisplay}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="h-3 w-3 mr-1" />
              <time dateTime={article.publishDate}>{formatDate(article.publishDate)}</time>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 flex-grow">
        <CardDescription className="text-sm leading-relaxed text-foreground/80 line-clamp-4">
          {displaySummary}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        {/* Article ID is now a number */}
        <Badge variant="secondary" className="font-normal">Read More (ID: {article.id})</Badge>
      </CardFooter>
    </Card>
  );
}
