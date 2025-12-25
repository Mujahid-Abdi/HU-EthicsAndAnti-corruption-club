import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Newspaper, Calendar, ArrowRight } from 'lucide-react';
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

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPublishedNews();
  }, []);

  const fetchPublishedNews = async () => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setNews(data);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[25vh] flex items-center overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/70 to-gray-900/60 dark:from-gray-950/90 dark:via-gray-950/80 dark:to-gray-950/70 z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920')] bg-cover bg-center opacity-30 dark:opacity-20" />
        </div>

        <div className="container mx-auto px-4 pt-16 pb-16 relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Newspaper className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-medium">Latest Updates</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
              News & Announcements
            </h1>
            <p className="text-base md:text-lg text-white/90">
              Stay informed about our latest activities, events, and initiatives in promoting ethics and fighting corruption.
            </p>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {news.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="py-16 text-center">
                <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No News Yet</h3>
                <p className="text-muted-foreground">
                  Check back soon for updates and announcements from our club.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item) => (
                <Link key={item.id} to={`/news/${item.id}`}>
                  <Card className="h-full overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border">
                    {item.image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className={`p-6 ${!item.image_url ? 'pt-8' : ''}`}>
                      {item.created_at && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(item.created_at), 'MMMM d, yyyy')}
                        </div>
                      )}
                      <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      {item.excerpt && (
                        <p className="text-muted-foreground line-clamp-3 mb-4">
                          {item.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-primary text-sm font-medium">
                        Read More
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
