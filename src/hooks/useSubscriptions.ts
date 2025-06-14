'use client';
import { useState, useEffect, useCallback } from 'react';
import type { Publisher } from '@/types';
import { mockPublishers } from '@/data/mock';

const SUBSCRIPTIONS_KEY = 'newsWaveSubscriptions';

const getStoredSubscriptions = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(SUBSCRIPTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error parsing subscriptions from localStorage", error);
    return [];
  }
};

const storeSubscriptions = (subscriptions: string[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
  } catch (error) {
    console.error("Error storing subscriptions to localStorage", error);
  }
};

export function useSubscriptions() {
  const [subscribedPublisherIds, setSubscribedPublisherIds] = useState<string[]>([]);
  const [allPublishers] = useState<Publisher[]>(mockPublishers); // In a real app, fetch this
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSubscribedPublisherIds(getStoredSubscriptions());
    setIsLoading(false);
  }, []);

  const subscribe = useCallback((publisherId: string) => {
    setSubscribedPublisherIds(prev => {
      const newSubs = Array.from(new Set([...prev, publisherId]));
      storeSubscriptions(newSubs);
      return newSubs;
    });
  }, []);

  const unsubscribe = useCallback((publisherId: string) => {
    setSubscribedPublisherIds(prev => {
      const newSubs = prev.filter(id => id !== publisherId);
      storeSubscriptions(newSubs);
      return newSubs;
    });
  }, []);

  const isSubscribed = useCallback((publisherId: string) => {
    return subscribedPublisherIds.includes(publisherId);
  }, [subscribedPublisherIds]);

  return {
    subscribedPublisherIds,
    allPublishers,
    subscribe,
    unsubscribe,
    isSubscribed,
    isLoading,
  };
}
