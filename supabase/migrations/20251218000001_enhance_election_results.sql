-- Enhanced function to get election results with percentages and ranking
CREATE OR REPLACE FUNCTION public.get_election_results(election_uuid UUID)
RETURNS TABLE (
  position election_position,
  candidate_id UUID,
  candidate_name TEXT,
  vote_count BIGINT,
  percentage NUMERIC(5,2),
  rank INTEGER
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH vote_counts AS (
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
  ),
  position_totals AS (
    SELECT 
      position,
      SUM(vote_count) as total_votes
    FROM vote_counts
    GROUP BY position
  ),
  results_with_percentage AS (
    SELECT 
      vc.position,
      vc.candidate_id,
      vc.candidate_name,
      vc.vote_count,
      CASE 
        WHEN pt.total_votes > 0 THEN ROUND((vc.vote_count::NUMERIC / pt.total_votes::NUMERIC) * 100, 2)
        ELSE 0
      END as percentage
    FROM vote_counts vc
    JOIN position_totals pt ON vc.position = pt.position
  )
  SELECT 
    position,
    candidate_id,
    candidate_name,
    vote_count,
    percentage,
    ROW_NUMBER() OVER (PARTITION BY position ORDER BY vote_count DESC) as rank
  FROM results_with_percentage
  ORDER BY position, vote_count DESC;
$$;