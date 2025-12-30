import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Newspaper, Calendar, ArrowRight, Bell, Mail } from 'lucide-react';
import { format } from 'date-fns';

// Static news articles data
const staticNewsArticles = [
  {
    id: 'static-1',
    title: "Student Survey Reveals Strong Support for Anti-Corruption Initiatives",
    excerpt: "A recent campus-wide survey shows that 87% of students support stronger measures to combat corruption and promote integrity in academic settings.",
    category: "Research",
    created_at: "2024-09-28",
  },
  {
    id: 'static-2',
    title: "Monthly Integrity Workshops Announced",
    excerpt: "Starting in November, we will host monthly workshops covering various aspects of ethical conduct, transparency, and anti-corruption strategies.",
    category: "Announcement",
    created_at: "2024-10-15",
  },
  {
    id: 'static-3',
    title: "Club Recognized at National Student Leadership Conference",
    excerpt: "Our club received recognition at the National Student Leadership Conference for outstanding contributions promoting academic integrity.",
    category: "Achievement",
    created_at: "2024-10-30",
  },
  {
    id: 'static-4',
    title: "Ethics Training Program Launch",
    excerpt: "A new comprehensive training program has been developed to equip student leaders with ethical leadership skills and integrity tools.",
    category: "Program Launch",
    created_at: "2024-11-15",
  },
  {
    id: 'static-5',
    title: "New Partnership with National Anti-Corruption Body",
    excerpt: "The club has formalized a partnership with the Federal Ethics and Anti-Corruption Commission to enhance our educational programs and reporting mechanisms.",
    category: "Announcement",
    created_at: "2024-11-25",
  },
  {
    id: 'static-6',
    title: "Club Successfully Hosts First Annual Integrity Forum",
    excerpt: "Over 300 students and faculty members participated in our inaugural Integrity Forum, featuring keynote speeches and breakout sessions on ethical leadership.",
    category: "Event Recap",
    created_at: "2024-12-10",
  },
];

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
  const [email, setEmail] = useState("");
  const { toast } = useToast();

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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive updates about our latest news.",
      });
      setEmail("");
    }
  };

  // Combine database news with static articles
  const allNews = [...news, ...staticNewsArticles].sort((a, b) => 
    new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
  );

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
      {/* News Grid */}
      <section className="pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
              <Newspaper className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                Latest Updates
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              News & Announcements
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay informed about our latest activities, events, and initiatives in promoting ethics and fighting corruption.
            </p>
          </div>
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
