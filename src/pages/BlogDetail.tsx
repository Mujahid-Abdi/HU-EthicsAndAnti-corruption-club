import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FirestoreService } from '@/lib/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Calendar, 
  User, 
  ArrowLeft, 
  FileText,
  Tag
} from 'lucide-react';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  published: boolean;
  createdAt: any;
  tags: string[];
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBlog(id);
    }
  }, [id]);

  const fetchBlog = async (blogId: string) => {
    try {
      setIsLoading(true);
      const data = await FirestoreService.get('blogs', blogId);
      
      if (data && data.published) {
        setBlog({
          ...data,
          imageUrl: data.imageUrl || data.image_url,
          createdAt: data.createdAt || data.created_at,
          tags: data.tags || [],
        } as BlogPost);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setNotFound(true);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="py-16 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Blog Post Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/news">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to News
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="pt-24 pb-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link to="/news" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to News
            </Link>
            
            {blog.imageUrl && (
              <div className="aspect-video rounded-xl overflow-hidden mb-8">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {format(
                    blog.createdAt?.seconds 
                      ? new Date(blog.createdAt.seconds * 1000) 
                      : new Date(blog.createdAt), 
                    'MMMM d, yyyy'
                  )}
                </div>
                {blog.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {blog.author}
                  </div>
                )}
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {blog.title}
              </h1>

              {blog.excerpt && (
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {blog.excerpt}
                </p>
              )}

              {blog.tags && blog.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  {blog.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none">
                  {blog.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Back to News */}
            <div className="mt-12 text-center">
              <Link to="/news">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to News & Blogs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}