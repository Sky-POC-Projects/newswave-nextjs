// src/services/apiService.ts
'use server'; // For use in server actions, though parts might be callable from client with care

import type { ApiNewsItem, ApiPublishRequest, ApiPublisherCreateRequest, ApiSubscriberCreateRequest, Publisher, Article, Subscriber, ApiPublisherDetailsResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApiError {
  message: string;
  details?: any;
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // Add any other default headers like Authorization if needed
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      console.error(`API Error (${response.status}) for ${options.method || 'GET'} ${url}:`, errorData);
      throw { message: `API request failed: ${response.statusText}`, details: errorData } as ApiError;
    }

    // For 204 No Content or other non-JSON success responses
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as T; 
    }
    if (response.headers.get('content-type')?.includes('application/json')) {
      return response.json() as Promise<T>;
    }
    // Handle plain text response for some endpoints if necessary, though API spec says OK for most
    return response.text() as unknown as Promise<T>;


  } catch (error) {
    console.error(`Network or other error for ${options.method || 'GET'} ${url}:`, error);
    // Ensure a consistent error object structure
    if (typeof error === 'object' && error !== null && 'message' in error) {
        throw error as ApiError;
    }
    throw { message: 'An unexpected network error occurred.', details: String(error) } as ApiError;
  }
}

// --- Publisher Endpoints ---
export async function getAllPublishers(): Promise<Publisher[]> {
  // GET /api/Publishers - returns an array of publishers.
  // API response example: [{"id": 1, "name": "Akash", "newsFeed": null}]
  // Our Publisher type expects id, name, optional description, optional avatarUrl.
  // We'll map the API response, providing defaults/placeholders if necessary.
  const apiPublishers = await apiFetch<Array<{id: number, name: string, description?: string | null, newsFeed?: any}>>(`/api/Publishers`, { method: 'GET' });
  return apiPublishers.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description || undefined, // Use undefined if null or missing
    avatarUrl: undefined, // API doesn't provide this, PublisherCard will use placeholder
  }));
}

export async function createPublisher(request: ApiPublisherCreateRequest): Promise<{ id: number, name: string | null, description: string | null }> {
  // API POST /api/Publishers returns 200 OK, and the created publisher object (including ID).
   const publisher = await apiFetch<Publisher>(`/api/Publishers`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return { id: publisher.id, name: publisher.name, description: publisher.description || null };
}

export async function getPublisherDetails(id: number): Promise<ApiPublisherDetailsResponse> {
  // GET /api/Publishers/{id} - returns publisher details with their newsFeed
  // Response includes: { id, name, newsFeed: ApiNewsItem[] | null }
  return apiFetch<ApiPublisherDetailsResponse>(`/api/Publishers/${id}`, { method: 'GET' });
}


export async function publishArticleApi(publisherId: number, request: ApiPublishRequest): Promise<void> {
  return apiFetch<void>(`/api/Publishers/${publisherId}/publish`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

// --- Subscriber Endpoints ---
export async function createSubscriber(request: ApiSubscriberCreateRequest): Promise<{ id: number, name: string }> {
  // API test shows it returns the ID in the response body as part of subscriber object.
  const subscriber = await apiFetch<Subscriber>(`/api/Subscribers`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return { id: subscriber.id, name: subscriber.name };
}

// GET /api/Subscribers/{id} - swagger doesn't specify response, assuming {id, name}
export async function getSubscriber(id: number): Promise<{ id: number, name: string }> {
   return apiFetch<{id: number, name: string}>(`/api/Subscribers/${id}`, { method: 'GET' });
}

export async function subscribeToPublisher(subscriberId: number, publisherId: number): Promise<void> {
  return apiFetch<void>(`/api/Subscribers/${subscriberId}/subscribe/${publisherId}`, {
    method: 'POST',
  });
}

export async function unsubscribeFromPublisher(subscriberId: number, publisherId: number): Promise<void> {
  return apiFetch<void>(`/api/Subscribers/${subscriberId}/subscribe/${publisherId}`, {
    method: 'DELETE',
  });
}

export async function getSubscriberFeed(subscriberId: number, count: number = 10): Promise<ApiNewsItem[]> {
   // The API returns additional fields publisherId and publisherName in NewsItem
   const apiResponse = await apiFetch<Array<ApiNewsItem & { publisherId: number; publisherName: string }>>(`/api/Subscribers/${subscriberId}/feed?count=${count}`, {
    method: 'GET',
  });
  // Ensure the response items match the expected ApiNewsItem structure for mapping
  return apiResponse.map(item => ({
    id: item.id,
    title: item.title,
    body: item.body,
    publishedAt: item.publishedAt, // publishedAt is a string, not in our simple NewsItem from swagger before
    publisherId: item.publisherId,
    publisherName: item.publisherName,
  }));
}


// Helper function to map ApiNewsItem to our app's Article type
// This function is used in subscriber feed page AND publisher dashboard page.
export async function mapApiNewsItemToArticle(newsItem: ApiNewsItem): Promise<Article> {
  // The feed from API (and publisher's newsFeed) includes publisherId, publisherName, and publishedAt.
  return {
    id: newsItem.id,
    title: newsItem.title || 'Untitled Article',
    content: newsItem.body || '', // 'body' from API is the content for our Article
    publishDate: newsItem.publishedAt || new Date().toISOString(), // Use API's publishedAt
    imageUrl: `https://placehold.co/600x400.png?text=News`, // Placeholder image, API doesn't provide this
    authorId: newsItem.publisherId, 
    authorName: newsItem.publisherName,
    // summary is not directly available from ApiNewsItem, ArticleCard handles basic truncation if summary is missing
  };
}
