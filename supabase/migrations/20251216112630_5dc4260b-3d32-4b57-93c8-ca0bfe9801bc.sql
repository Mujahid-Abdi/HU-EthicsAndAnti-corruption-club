-- Create anonymous reports table
CREATE TABLE public.anonymous_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_type TEXT NOT NULL,
  incident_date DATE,
  location TEXT,
  description TEXT NOT NULL,
  evidence_urls TEXT[],
  contact_method TEXT,
  contact_info TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.anonymous_reports ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert reports (anonymous submissions)
CREATE POLICY "Anyone can submit anonymous reports"
ON public.anonymous_reports
FOR INSERT
WITH CHECK (true);

-- Only authenticated admins can view reports (we'll add admin system later)
-- For now, no one can read reports from the client
CREATE POLICY "Reports are not publicly readable"
ON public.anonymous_reports
FOR SELECT
USING (false);

-- Create storage bucket for evidence files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('evidence', 'evidence', false);

-- Allow anonymous uploads to evidence bucket
CREATE POLICY "Anyone can upload evidence"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'evidence');

-- Evidence files are not publicly readable
CREATE POLICY "Evidence is not publicly readable"
ON storage.objects
FOR SELECT
USING (false);