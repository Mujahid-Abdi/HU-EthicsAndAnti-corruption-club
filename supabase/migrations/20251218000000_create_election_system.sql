-- Create election positions enum
CREATE TYPE public.election_position AS ENUM ('president', 'vice_president', 'secretary');

-- Create election status enum
CREATE TYPE public.election_status AS ENUM ('draft', 'open', 'closed');

-- Create elections table
CREATE TABLE public.elections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status election_status NOT NULL DEFAULT 'draft',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  results_public BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create candidates table
CREATE TABLE public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  position election_position NOT NULL,
  photo_url TEXT,
  department TEXT NOT NULL,
  batch TEXT NOT NULL,
  manifesto TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create votes table
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  voter_full_name TEXT NOT NULL,
  voter_student_id TEXT NOT NULL,
  voter_department TEXT NOT NULL,
  voter_batch TEXT NOT NULL,
  president_candidate_id UUID REFERENCES public.candidates(id),
  vice_president_candidate_id UUID REFERENCES public.candidates(id),
  secretary_candidate_id UUID REFERENCES public.candidates(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (election_id, user_id) -- Prevent duplicate voting
);

-- Enable RLS
ALTER TABLE public.elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for elections
CREATE POLICY "Anyone can view open elections" ON public.elections
  FOR SELECT USING (status = 'open' OR status = 'closed');

CREATE POLICY "Admins can manage elections" ON public.elections
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for candidates
CREATE POLICY "Anyone can view candidates for open elections" ON public.candidates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.elections 
      WHERE id = candidates.election_id 
      AND (status = 'open' OR status = 'closed')
    )
  );

CREATE POLICY "Admins can manage candidates" ON public.candidates
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for votes
CREATE POLICY "Users can view their own votes" ON public.votes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Approved members can vote" ON public.votes
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_approved = true) AND
    EXISTS (SELECT 1 FROM public.elections WHERE id = votes.election_id AND status = 'open')
  );

CREATE POLICY "Admins can view all votes" ON public.votes
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_elections_updated_at
  BEFORE UPDATE ON public.elections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON public.candidates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get election results (admin only)
CREATE OR REPLACE FUNCTION public.get_election_results(election_uuid UUID)
RETURNS TABLE (
  position election_position,
  candidate_id UUID,
  candidate_name TEXT,
  vote_count BIGINT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $
  SELECT 
    c.position,
    c.id as candidate_id,
    c.full_name as candidate_name,
    CASE 
      WHEN c.position = 'president' THEN 
        (SELECT COUNT(*) FROM votes v WHERE v.president_candidate_id = c.id AND v.election_id = election_uuid)
      WHEN c.position = 'vice_president' THEN 
        (SELECT COUNT(*) FROM votes v WHERE v.vice_president_candidate_id = c.id AND v.election_id = election_uuid)
      WHEN c.position = 'secretary' THEN 
        (SELECT COUNT(*) FROM votes v WHERE v.secretary_candidate_id = c.id AND v.election_id = election_uuid)
    END as vote_count
  FROM candidates c
  WHERE c.election_id = election_uuid
  ORDER BY c.position, vote_count DESC;
$;

-- Function to check if user has voted
CREATE OR REPLACE FUNCTION public.has_user_voted(election_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $
  SELECT EXISTS (
    SELECT 1 FROM votes 
    WHERE election_id = election_uuid AND user_id = user_uuid
  );
$;

-- Insert sample election data
INSERT INTO public.elections (title, description, status) VALUES
  ('Club Executive Elections 2025', 'Annual elections for club executive positions', 'draft');