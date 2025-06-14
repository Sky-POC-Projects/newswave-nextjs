// src/hooks/useSubscriptions.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import type { Publisher } from '@/types';
import { mockPublishers } from '@/data/mock'; // Still using mock for listing all publishers
import { subscribeToPublisher, unsubscribeFromPublisher } from '@/services/apiService';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

// We'll manage subscribed IDs locally since there's no API to fetch them.
// This state is not perfectly persistent across sessions if not explicitly fetched/stored.
// For a robust solution, an API endpoint GET /api/Subscribers/{subscriberId}/subscriptions would be needed.

export function useSubscriptions() {
  const { userId: subscriberId, role } = useAuth();
  const { toast } = useToast();
  
  // This will store NUMERIC publisher IDs the user is subscribed to, based on successful API calls.
  const [subscribedPublisherApiIds, setSubscribedPublisherApiIds] = useState<number[]>([]);
  
  // All available publishers for listing still comes from mock data, now with numeric IDs.
  const [allPublishers] = useState<Publisher[]>(mockPublishers); 
  const [isLoading, setIsLoading] = useState(true); // For initial load or operations

  // Effect to load initial subscriptions from a hypothetical source or just start empty
  useEffect(() => {
    // In a real app with an API to fetch subscriptions, call it here.
    // For now, we start with an empty list and rely on user actions.
    // If we stored API IDs locally (e.g. localStorage), load here. For now, it's transient.
    setSubscribedPublisherApiIds([]); 
    setIsLoading(false);
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
    subscribedPublisherIds: subscribedPublisherApiIds, // These are numeric API IDs
    allPublishers, // These are mock publishers with numeric IDs
    subscribe,
    unsubscribe,
    isSubscribed,
    isLoading,
  };
}
