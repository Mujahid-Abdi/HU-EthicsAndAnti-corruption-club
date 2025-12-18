-- Create executive members table
CREATE TABLE public.executive_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  position TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  bio TEXT,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.executive_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active executive members" ON public.executive_members
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage executive members" ON public.executive_members
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to update updated_at
CREATE TRIGGER update_executive_members_updated_at
  BEFORE UPDATE ON public.executive_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default executive members
INSERT INTO public.executive_members (full_name, position, display_order) VALUES
  ('To Be Announced', 'President', 1),
  ('To Be Announced', 'Vice President', 2),
  ('To Be Announced', 'Secretary', 3),
  ('To Be Announced', 'Treasurer', 4),
  ('To Be Announced', 'Public Relations Officer', 5),
  ('To Be Announced', 'Events Coordinator', 6),
  ('To Be Announced', 'Faculty Advisor', 7);
