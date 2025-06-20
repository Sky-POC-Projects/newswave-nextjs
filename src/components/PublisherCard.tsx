'use client';

import Image from 'next/image';
import type { Publisher } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, PlusCircle } from 'lucide-react';

interface PublisherCardProps {
  publisher: Publisher; // publisher.id is now number
  isSubscribed: boolean;
  onSubscribe: (publisherId: number) => void; // Expects numeric ID
  onUnsubscribe: (publisherId: number) => void; // Expects numeric ID
}

export default function PublisherCard({ publisher, isSubscribed, onSubscribe, onUnsubscribe }: PublisherCardProps) {
  const avatarFallbackText = publisher.name ? publisher.name.substring(0, 2).toUpperCase() : "P";
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <CardHeader className="items-center text-center p-6">
        <Avatar className="h-24 w-24 mb-4 border-2 border-primary p-1">
          {/* publisher.avatarUrl is optional and might not come from API */}
          <AvatarImage src={publisher.avatarUrl || `https://placehold.co/100x100.png?text=${avatarFallbackText}`} alt={publisher.name} data-ai-hint="publisher logo" />
          <AvatarFallback className="text-3xl bg-secondary text-secondary-foreground">
            {avatarFallbackText}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="font-headline text-xl">{publisher.name}</CardTitle>
        <CardDescription>{publisher.description || 'Stay updated with their latest news.'}</CardDescription>
      </CardHeader>
      <CardFooter className="p-6 pt-0">
        {isSubscribed ? (
          <Button variant="outline" onClick={() => onUnsubscribe(publisher.id)} className="w-full border-destructive text-destructive hover:bg-destructive/10">
            <CheckCircle className="mr-2 h-4 w-4" />
            Subscribed
          </Button>
        ) : (
          <Button onClick={() => onSubscribe(publisher.id)} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="mr-2 h-4 w-4" />
            Subscribe
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
