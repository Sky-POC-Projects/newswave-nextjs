// src/app/actions.ts
'use server';
import { summarizeArticle as summarizeArticleFlow, type SummarizeArticleInput } from '@/ai/flows/summarize-article';
// Article type is now different, mockArticles use numeric IDs. addArticle may not be relevant.
// import { mockArticles, addArticle as saveArticleToMock } from '@/data/mock';
// import { generateId } from '@/lib/utils'; // Not for API IDs
import { publishArticleApi } from '@/services/apiService';
import { revalidatePath } from 'next/cache';


export async function generateSummaryAction(input: SummarizeArticleInput): Promise<{ summary?: string; error?: string }> {
  try {
    console.log("Generating summary for content:", input.articleContent.substring(0,100) + "...");
    const result = await summarizeArticleFlow(input);
    console.log("Summary generated:", result.summary);
    return { summary: result.summary };
  } catch (error) {
    console.error("Error generating summary via action:", error);
    const message = error instanceof Error ? error.message : String(error);
    return { error: `Failed to generate summary: ${message}. Please try again.` };
  }
}

export async function postArticleAction(
  title: string,
  content: string, // This is 'body' for the API
  // summary: string, // Summary is not part of the API publish request
  // imageUrl: string | undefined, // ImageUrl is not part of the API publish request
  publisherApiIdString: string // Publisher ID from useAuth (numeric, but passed as string from form/context)
): Promise<{ success: boolean; articleId?: number; error?: string }> { // articleId from API is not guaranteed/specified
  try {
    const publisherApiId = parseInt(publisherApiIdString, 10);
    if (isNaN(publisherApiId)) {
        return { success: false, error: "Invalid Publisher ID." };
    }

    // The API /api/Publishers/{id}/publish takes { title, body }
    // The current form includes `summary` (AI generated) and `imageUrl`. These are not sent to this specific API.
    await publishArticleApi(publisherApiId, { title, body: content });
    
    // Revalidate paths where articles might be displayed.
    // Note: /publisher page still uses mock data, so revalidation might not show API changes there.
    // /subscriber feed will show new articles if the user is subscribed to this publisher.
    revalidatePath('/publisher'); // Still revalidate in case it ever switches from mock
    revalidatePath('/subscriber');

    // The API for publishing doesn't return the new article's ID or details.
    return { success: true }; // Article ID is unknown from this API call
  } catch (error) {
    console.error("Error posting article via API:", error);
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: `Failed to post article: ${message}` };
  }
}
