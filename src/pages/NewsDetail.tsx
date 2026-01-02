import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, ArrowLeft, Newspaper } from 'lucide-react';
import { format } from 'date-fns';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  published: boolean | null;
  created_at: string | null;
}

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
  }, [id]);

  const fetchArticle = async (articleId: string) => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', articleId)
      .eq('published', true)
      .single();

    if (error || !data) {
      setNotFound(true);
    } else {
      setArticle(data);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  if (notFound || !article) {
    return (
      <>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Article Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/news">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to News
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <article className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="max-w-4xl mx-auto mb-8">
            <Link to="/news">
              <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Back to News
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <header className="max-w-4xl mx-auto mb-8">
            {article.created_at && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="w-4 h-4" />
                {format(new Date(article.created_at), 'MMMM d, yyyy')}
              </div>
            )}
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </header>

          {/* Featured Image */}
          {article.image_url && (
            <div className="max-w-4xl mx-auto mb-10">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {article.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="text-foreground leading-relaxed mb-4">
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-border">
            <Link to="/news">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to All News
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
