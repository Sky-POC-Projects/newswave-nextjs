'use server';
import { summarizeArticle as summarizeArticleFlow, type SummarizeArticleInput, type SummarizeArticleOutput } from '@/ai/flows/summarize-article';
import type { Article } from '@/types';
import { mockArticles, addArticle as saveArticleToMock, mockPublishers } from '@/data/mock';
import { generateId } from '@/lib/utils';
import { revalidatePath } from 'next/cache';


export async function generateSummaryAction(input: SummarizeArticleInput): Promise<{ summary?: string; error?: string }> {
  try {
    console.log("Generating summary for content:", input.articleContent.substring(0,100) + "...");
    const result = await summarizeArticleFlow(input);
    console.log("Summary generated:", result.summary);
    return { summary: result.summary };
  } catch (error) {
    console.error("Error generating summary via action:", error);
    // Check if error is an object and has a message property
    const message = error instanceof Error ? error.message : String(error);
    return { error: `Failed to generate summary: ${message}. Please try again.` };
  }
}

export async function postArticleAction(
  title: string,
  content: string,
  summary: string,
  imageUrl: string | undefined,
  publisherId: string
): Promise<{ success: boolean; articleId?: string; error?: string }> {
  try {
    const publisher = mockPublishers.find(p => p.id === publisherId);
    if (!publisher) {
      return { success: false, error: "Invalid publisher." };
    }

    const newArticle: Article = {
      id: generateId('art'),
      title,
      content,
      summary,
      imageUrl: imageUrl || undefined, // Ensure empty string becomes undefined
      authorId: publisher.id,
      authorName: publisher.name,
      publishDate: new Date().toISOString(),
    };

    saveArticleToMock(newArticle);
    
    // Revalidate the path where articles are displayed
    revalidatePath('/publisher');
    revalidatePath('/subscriber');


    return { success: true, articleId: newArticle.id };
  } catch (error) {
    console.error("Error posting article:", error);
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: `Failed to post article: ${message}` };
  }
}
