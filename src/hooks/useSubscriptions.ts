// src/hooks/useSubscriptions.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
// mockPublishers is no longer imported here
import { subscribeToPublisher, unsubscribeFromPublisher } from '@/services/apiService';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export function useSubscriptions() {
  const { userId: subscriberId, role } = useAuth();
  const { toast } = useToast();
  
  const [subscribedPublisherApiIds, setSubscribedPublisherApiIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true); //isLoading now primarily for ongoing API calls & initial setup

  useEffect(() => {
    // API doesn't provide an endpoint to fetch current subscriptions.
    // So, initialize as empty. Subscriptions are tracked based on user actions in this session.
    setSubscribedPublisherApiIds([]); 
    setIsLoading(false); // Initial setup complete
  }, [subscriberId]);


  const subscribe = useCallback(async (publisherApiId: number) => {
    if (!subscriberId || role !== 'subscriber') {
      toast({ title: "Error", description: "You must be logged in as a subscriber.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await subscribeToPublisher(subscriberId, publisherApiId);
      setSubscribedPublisherApiIds(prev => Array.from(new Set([...prev, publisherApiId])));
      toast({ title: "Subscribed!", description: `You are now subscribed to publisher ID ${publisherApiId}.`, variant: "default" });
    } catch (error: any) {
      console.error("Failed to subscribe:", error);
      toast({ title: "Subscription Failed", description: error?.message || "Could not subscribe.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [subscriberId, role, toast]);

  const unsubscribe = useCallback(async (publisherApiId: number) => {
    if (!subscriberId || role !== 'subscriber') {
      toast({ title: "Error", description: "You must be logged in as a subscriber.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await unsubscribeFromPublisher(subscriberId, publisherApiId);
      setSubscribedPublisherApiIds(prev => prev.filter(id => id !== publisherApiId));
      toast({ title: "Unsubscribed", description: `You have unsubscribed from publisher ID ${publisherApiId}.`, variant: "default" });
    } catch (error: any) {
      console.error("Failed to unsubscribe:", error);
      toast({ title: "Unsubscription Failed", description: error?.message || "Could not unsubscribe.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [subscriberId, role, toast]);

  const isSubscribed = useCallback((publisherApiId: number) => {
    return subscribedPublisherApiIds.includes(publisherApiId);
  }, [subscribedPublisherApiIds]);

  return {
    subscribedPublisherIds: subscribedPublisherApiIds,
    subscribe,
    unsubscribe,
    isSubscribed,
    isLoading, // This reflects if a subscribe/unsubscribe operation is in progress
  };
}
