export type UserRole = 'publisher' | 'subscriber';

export interface Article {
  id: string;
  title: string;
  content: string;
  summary?: string;
  authorId: string;
  authorName: string;
  publishDate: string; // ISO string
  imageUrl?: string;
}

export interface Publisher {
  id: string;
  name: string;
  avatarUrl?: string;
}
