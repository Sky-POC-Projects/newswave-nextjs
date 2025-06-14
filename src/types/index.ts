export type UserRole = 'publisher' | 'subscriber';

// Corresponds to NewsItem from the API for feed
export interface Article {
  id: number; // Changed from string to number
  title: string;
  content: string; // Maps to 'body' from API's NewsItem
  summary?: string; // Might be generated client-side or be part of content
  authorId?: number; // Changed from string to number. Optional as feed API doesn't provide it.
  authorName?: string; // Optional as feed API doesn't provide it.
  publishDate: string; // ISO string. Feed API doesn't provide, will need to be handled.
  imageUrl?: string; // Optional as feed API doesn't provide it.
}

export interface Publisher {
  id: number; // Changed from string to number
  name: string;
  description?: string; // Added from API capability
  avatarUrl?: string; // Kept for display, though API doesn't provide
}

// API specific types based on Swagger for clarity
export interface ApiNewsItem {
  id: number;
  title: string | null;
  body: string | null;
}

export interface ApiPublisherCreateRequest {
  name: string | null;
  description: string | null;
}

export interface ApiSubscriberCreateRequest {
  name: string | null;
}

export interface ApiPublishRequest {
  title: string | null;
  body: string | null;
}
