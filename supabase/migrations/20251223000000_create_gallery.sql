-- Create gallery table
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gallery
CREATE POLICY "Anyone can view published gallery items" ON public.gallery
  FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage gallery" ON public.gallery
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to update updated_at
CREATE TRIGGER update_gallery_updated_at
  BEFORE UPDATE ON public.gallery
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_gallery_published ON public.gallery(published, created_at DESC);
CREATE INDEX idx_gallery_category ON public.gallery(category);
