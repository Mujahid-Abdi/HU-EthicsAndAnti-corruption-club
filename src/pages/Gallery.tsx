import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2, Image as ImageIcon, X } from 'lucide-react';
import { format } from 'date-fns';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  published: boolean | null;
  created_at: string | null;
}

export default function Gallery() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [filteredGallery, setFilteredGallery] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetchPublishedGallery();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredGallery(gallery);
    } else {
      setFilteredGallery(gallery.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, gallery]);

  const fetchPublishedGallery = async () => {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setGallery(data);
      setFilteredGallery(data);
    }
    setIsLoading(false);
  };

  const categories = ['All', ...Array.from(new Set(gallery.map(item => item.category).filter(Boolean)))];

  if (isLoading) {
    return (
      <>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Gallery Section */}
      <section className="pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
              <ImageIcon className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                Photo Gallery
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Gallery
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore moments from our events, campaigns, and activities promoting ethics and integrity.
            </p>
          </div>
          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}

          {filteredGallery.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="py-16 text-center">
                <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Photos Yet</h3>
                <p className="text-muted-foreground">
                  Check back soon for photos from our events and activities.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredGallery.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300"
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-1 mb-1">
                      {item.title}
                    </h3>
                    {item.category && (
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0">
          {selectedImage && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <div className="p-6 bg-background">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-2xl font-display font-bold">
                    {selectedImage.title}
                  </h2>
                  {selectedImage.category && (
                    <Badge variant="outline">{selectedImage.category}</Badge>
                  )}
                </div>
                {selectedImage.description && (
                  <p className="text-muted-foreground mb-2">
                    {selectedImage.description}
                  </p>
                )}
                {selectedImage.created_at && (
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedImage.created_at), 'MMMM d, yyyy')}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
