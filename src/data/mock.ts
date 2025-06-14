import type { Article, Publisher } from '@/types';

// IDs are now numbers to align with API potential if these were to be mapped or pre-existing.
// For the purpose of *listing* available publishers where no API endpoint exists,
// these numeric IDs are conceptual. When subscribing, the actual numeric ID from the API for these
// publishers would be used if they were created via the API.
export const mockPublishers: Publisher[] = [
  { id: 1, name: 'Global News Network', avatarUrl: 'https://placehold.co/100x100.png?text=GNN', description: 'Leading global news coverage.' },
  { id: 2, name: 'Tech Chronicle', avatarUrl: 'https://placehold.co/100x100.png?text=TC', description: 'The latest in technology.' },
  { id: 3, name: 'Eco Watch Today', avatarUrl: 'https://placehold.co/100x100.png?text=EWT', description: 'Environmental news and analysis.' },
  { id: 4, name: 'Local Dispatch Herald', avatarUrl: 'https://placehold.co/100x100.png?text=LDH', description: 'Your source for local news.' },
];

export let mockArticles: Article[] = [
  {
    id: 101, // Numeric ID
    title: 'The Future of Renewable Energy Solutions',
    content: 'Renewable energy is pivotal for a sustainable future. This article explores various sources like solar, wind, and geothermal power, discussing their potential and challenges. Technological advancements are making renewables more efficient and affordable, paving the way for a global shift from fossil fuels. Governments and corporations are increasingly investing in green energy projects, recognizing both the environmental benefits and economic opportunities. However, issues like intermittency and energy storage still need innovative solutions. Public awareness and policy support are crucial for accelerating this transition towards a cleaner energy landscape.',
    authorId: 1, // Numeric authorId
    authorName: 'Global News Network',
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    imageUrl: 'https://placehold.co/600x400.png',
    summary: 'A look into renewable energy sources, their advancements, and the path towards a sustainable energy future, highlighting challenges and opportunities.'
  },
  {
    id: 102, // Numeric ID
    title: 'AI Breakthroughs Revolutionizing Modern Healthcare',
    content: 'Artificial intelligence is revolutionizing healthcare, from diagnostics to drug discovery. Machine learning algorithms can analyze medical images with remarkable accuracy, often surpassing human capabilities. AI-powered tools are also streamlining administrative tasks, allowing healthcare professionals to focus more on patient care. Personalized medicine, tailored to individual genetic profiles, is becoming a reality thanks to AI. Despite the immense potential, ethical considerations and data privacy remain significant concerns that need careful navigation. The integration of AI promises a more efficient, effective, and equitable healthcare system for all.',
    authorId: 2, // Numeric authorId
    authorName: 'Tech Chronicle',
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    imageUrl: 'https://placehold.co/600x400.png',
    summary: 'Exploring the transformative impact of AI in healthcare, from enhanced diagnostics and streamlined administration to personalized medicine and ethical considerations.'
  },
  {
    id: 103, // Numeric ID
    title: 'The Critical Importance of Biodiversity Conservation',
    content: 'Biodiversity is essential for the health of our planet. This article delves into why a rich variety of species is crucial for ecosystem stability, pollination, and climate regulation. Human activities, such as deforestation and pollution, are leading to an unprecedented loss of biodiversity, threatening not only wildlife but also human well-being. Conservation efforts, including habitat restoration and sustainable practices, are vital to protect endangered species and maintain ecological balance. Understanding the interconnectedness of life underscores the urgency of preserving biodiversity for future generations to thrive.',
    authorId: 3, // Numeric authorId
    authorName: 'Eco Watch Today',
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    imageUrl: 'https://placehold.co/600x400.png',
    summary: 'An examination of why biodiversity is critical for planetary health, the human impact leading to its loss, and the conservation efforts needed to protect it.'
  },
  // Generate some more mock articles with numeric IDs
  ...Array.from({ length: 15 }, (_, i) => {
    const publisher = mockPublishers[i % mockPublishers.length];
    return {
      id: 200 + i, // Unique numeric ID
      title: `Insights from ${publisher.name}: Edition ${i + 1}`,
      content: `This is the detailed content for article ${200+i} from ${publisher.name}. It discusses various interesting topics and provides in-depth analysis. The content is long enough to require a summary. This article explores various sources like solar, wind, and geothermal power, discussing their potential and challenges. Technological advancements are making renewables more efficient and affordable, paving the way for a global shift from fossil fuels. Governments and corporations are increasingly investing in green energy projects, recognizing both the environmental benefits and economic opportunities. However, issues like intermittency and energy storage still need innovative solutions. Public awareness and policy support are crucial for accelerating this transition towards a greener planet.`,
      authorId: publisher.id, // Numeric authorId
      authorName: publisher.name,
      publishDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i + 3)).toISOString(),
      imageUrl: 'https://placehold.co/600x400.png',
      summary: `A concise summary for article ${200+i} by ${publisher.name}, covering key points and insights.`
    };
  }),
];

// This function might be deprecated or changed if all article additions go through the API.
// For now, if it's used by any mock-only feature, it needs to handle numeric IDs.
export const addArticle = (article: Article) => {
  // Ensure article has a numeric ID, if not, generate one (though API should provide)
  const newArticle = { ...article, id: article.id || Math.floor(Math.random() * 100000) };
  mockArticles.unshift(newArticle);
};
