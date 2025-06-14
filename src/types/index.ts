export type UserRole = 'publisher' | 'subscriber';

// Corresponds to NewsItem from the API for feed
export interface Article {
  id: number; 
  title: string;
  content: string; 
  summary?: string; 
  authorId?: number; 
  authorName?: string; 
  publishDate: string; // ISO string. API provides publishedAt
  imageUrl?: string; 
}

export interface Publisher {
  id: number; 
  name: string;
  description?: string; 
  avatarUrl?: string; // Not provided by /api/Publishers, PublisherCard handles missing.
}

export interface Subscriber {
  id: number; 
  name: string;
  subscribedPublishers: Publisher[];
}

// API specific types based on Swagger for clarity
export interface ApiNewsItem {
  id: number;
  title: string;
  body: string | null;
  publishedAt: string; // This field is present in the feed API response
  publisherId: number; // This field is present in the feed API response
  publisherName: string; // This field is present in the feed API response
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

// Represents the response from GET /api/Publishers/{id}
export interface ApiPublisherDetailsResponse {
  id: number;
  name: string;
  newsFeed: ApiNewsItem[] | null; // newsFeed can be null if no articles
  // description is not in this specific API endpoint's response
}
