-- Create gallery table
CREATE TABLE public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  category text,
  published boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view published gallery items
CREATE POLICY "Anyone can view published gallery" 
ON public.gallery 
FOR SELECT 
USING (published = true);

-- Allow admins to manage all gallery items
CREATE POLICY "Admins can manage gallery" 
ON public.gallery 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));