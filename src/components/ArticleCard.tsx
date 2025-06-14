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
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col h-full">
      <CardHeader className="p-0">
        {article.imageUrl && (
          <div className="relative w-full h-48">
            <Image
              src={article.imageUrl}
              alt={article.title}
              layout="fill"
              objectFit="cover"
              data-ai-hint="news article illustration"
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
         <div className="p-6">
          <CardTitle className="font-headline text-xl lg:text-2xl leading-tight mb-2">{article.title}</CardTitle>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              <span>{article.authorName}</span>
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
          {article.summary || article.content}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Badge variant="secondary" className="font-normal">Read More (Not Implemented)</Badge>
      </CardFooter>
    </Card>
  );
}
