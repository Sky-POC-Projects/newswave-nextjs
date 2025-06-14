'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArticleSchema, type ArticleFormData } from '@/lib/validators';
import { generateSummaryAction, postArticleAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function PostArticleForm() {
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();
  const { userId: publisherId } = useAuth();
  const router = useRouter();

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: {
      title: '',
      content: '',
      imageUrl: '',
    },
  });

  const handleGenerateSummary = async () => {
    const content = form.getValues('content');
    if (!content || content.length < 50) {
      form.setError('content', { type: 'manual', message: 'Content must be at least 50 characters to generate a summary.' });
      return;
    }
    form.clearErrors('content');

    setIsLoadingSummary(true);
    setGeneratedSummary(null);
    try {
      const result = await generateSummaryAction({ articleContent: content });
      if (result.summary) {
        setGeneratedSummary(result.summary);
        toast({
          title: "Summary Generated",
          description: "AI-powered summary is ready for review.",
          variant: "default",
          action: <CheckCircle className="text-green-500" />,
        });
      } else if (result.error) {
        toast({
          title: "Error Generating Summary",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const onSubmit = async (data: ArticleFormData) => {
    if (!generatedSummary) {
      toast({
        title: "Summary Required",
        description: "Please generate and review the summary before posting.",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmPost = async () => {
    if (!publisherId) {
      toast({ title: "Authentication Error", description: "Publisher ID not found.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const values = form.getValues();
    try {
      const result = await postArticleAction(values.title, values.content, generatedSummary!, values.imageUrl, publisherId);
      if (result.success) {
        toast({
          title: "Article Posted!",
          description: `"${values.title}" has been successfully posted.`,
          variant: "default",
          action: <CheckCircle className="text-green-500" />,
        });
        form.reset();
        setGeneratedSummary(null);
        setShowConfirmation(false);
        router.push('/publisher'); // Redirect to publisher dashboard
      } else {
        toast({
          title: "Posting Failed",
          description: result.error || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not post article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setShowConfirmation(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Create New Article</CardTitle>
              <CardDescription>Fill in the details below to publish your article. An AI-generated summary will be created for your review.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter article title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write your article content here..." {...field} rows={10} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 rounded-md border border-dashed border-primary/50 p-4 bg-primary/5">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold text-primary">AI Summary</Label>
                  <Button type="button" onClick={handleGenerateSummary} disabled={isLoadingSummary} variant="outline" size="sm">
                    {isLoadingSummary ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    Generate Summary
                  </Button>
                </div>
                {generatedSummary && (
                  <div className="prose prose-sm max-w-none rounded-md bg-background p-3 shadow">
                    <p className="text-foreground/80">{generatedSummary}</p>
                  </div>
                )}
                {isLoadingSummary && (
                   <div className="flex items-center text-sm text-muted-foreground">
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     <span>Generating summary, please wait...</span>
                   </div>
                )}
              </div>

            </CardContent>
            <CardFooter>
              <Button type="submit" className="bg-accent hover:bg-accent/80 text-accent-foreground" size="lg" disabled={isSubmitting || isLoadingSummary || !generatedSummary}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Review & Post Article
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline">Confirm Article Post</AlertDialogTitle>
            <AlertDialogDescription>
              Please review the article details and the AI-generated summary.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-96 overflow-y-auto space-y-4 p-1">
            <h3 className="font-semibold">Title:</h3>
            <p className="text-sm text-muted-foreground">{form.getValues('title')}</p>
            <h3 className="font-semibold">Summary:</h3>
            <p className="text-sm text-muted-foreground">{generatedSummary}</p>
            {form.getValues('imageUrl') && (
              <>
                <h3 className="font-semibold">Image URL:</h3>
                <p className="text-sm text-muted-foreground break-all">{form.getValues('imageUrl')}</p>
              </>
            )}
             <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 text-sm flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                <span>Ensure the AI-generated summary accurately reflects your article's content before proceeding.</span>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <Button onClick={handleConfirmPost} disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm & Post
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
