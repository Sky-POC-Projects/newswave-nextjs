// src/services/apiService.ts
'use server'; // For use in server actions, though parts might be callable from client with care

import type { ApiNewsItem, ApiPublishRequest, ApiPublisherCreateRequest, ApiSubscriberCreateRequest, Publisher, Article } from '@/types';

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
export async function createPublisher(request: ApiPublisherCreateRequest): Promise<{ id: number, name: string | null, description: string | null }> {
  // API POST /api/Publishers returns 200 OK, assuming it returns the created publisher with ID
  // This is an assumption as swagger doesn't specify POST response body. A common pattern is returning the created resource.
  // If it just returns 200 OK, we might not get the ID back directly this way.
  // For now, let's assume it returns something like {id: 123, name: "...", description: "..."}
  // The swagger for POST /api/Publishers doesn't define a response body, just "200 OK".
  // This is a problem. We need the ID. Let's *assume* it's returned.
  // If not, this flow is broken.
  // For now, we'll try to parse JSON. If it's empty, we are in trouble for ID.
  // **Update:** The API test shows it returns the ID in the response body, e.g. `123` (just the ID as int).
  // So the return type should be Promise<number>
   const publisherId = await apiFetch<number>(`/api/Publishers`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return { id: publisherId, name: request.name, description: request.description };
}

export async function getPublisher(id: number): Promise<Publisher> {
  // GET /api/Publishers/{id} - swagger doesn't specify response schema.
  // Assuming it returns something like { id: number, name: string, description?: string }
  // Let's assume it matches our Publisher type more or less.
  const response =  await apiFetch<Publisher>(`/api/Publishers/${id}`, { method: 'GET' });
  return response; // This might need mapping if the API response is different.
}


export async function publishArticleApi(publisherId: number, request: ApiPublishRequest): Promise<void> {
  return apiFetch<void>(`/api/Publishers/${publisherId}/publish`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

// --- Subscriber Endpoints ---
export async function createSubscriber(request: ApiSubscriberCreateRequest): Promise<{ id: number, name: string | null }> {
  // Similar to createPublisher, POST /api/Subscribers. Assuming it returns ID.
  // API test shows it returns the ID in the response body, e.g. `123` (just the ID as int).
  const subscriberId = await apiFetch<number>(`/api/Subscribers`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return { id: subscriberId, name: request.name };
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
  return apiFetch<ApiNewsItem[]>(`/api/Subscribers/${subscriberId}/feed?count=${count}`, {
    method: 'GET',
  });
}

// Helper function to map ApiNewsItem to our app's Article type
export async function mapApiNewsItemToArticle(newsItem: ApiNewsItem, publishers: Publisher[]): Promise<Article> {
  // The feed from API doesn't contain authorId, authorName, publishDate, or imageUrl.
  // We'll have to use placeholders or derive them if possible.
  // For now, author info is missing. This is a limitation.
  return {
    id: newsItem.id,
    title: newsItem.title || 'Untitled Article',
    content: newsItem.body || '',
    // summary: newsItem.body ? (newsItem.body.length > 100 ? newsItem.body.substring(0, 100) + '...' : newsItem.body) : '', // Basic summary
    publishDate: new Date().toISOString(), // Placeholder publish date
    imageUrl: `https://placehold.co/600x400.png?text=Article+${newsItem.id}`, // Placeholder image
    // authorId and authorName are missing from this API endpoint
  };
}
