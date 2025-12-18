import { useState, useEffect } from 'react';
import { VoteLayout } from '@/components/layout/VoteLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Vote as VoteIcon, 
  User, 
  CheckCircle, 
  AlertTriangle, 
  Lock,
  Clock,
  Users
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Navigate } from 'react-router-dom';

interface Election {
  id: string;
  title: string;
  description: string | null;
  status: 'draft' | 'open' | 'closed';
  start_date: string | null;
  end_date: string | null;
}

interface Candidate {
  id: string;
  full_name: string;
  position: 'president' | 'vice_president' | 'secretary';
  photo_url: string | null;
  department: string;
  batch: string;
  manifesto: string | null;
}

interface VoteForm {
  voter_full_name: string;
  voter_student_id: string;
  voter_department: string;
  voter_batch: string;
  president_candidate_id: string;
  vice_president_candidate_id: string;
  secretary_candidate_id: string;
}

export default function VotePage() {
  const { user } = useAuth();
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [voteForm, setVoteForm] = useState<VoteForm>({
    voter_full_name: '',
    voter_student_id: '',
    voter_department: '',
    voter_batch: '',
    president_candidate_id: '',
    vice_president_candidate_id: '',
    secretary_candidate_id: '',
  });

  useScrollAnimation();

  useEffect(() => {
    if (user) {
      fetchCurrentElection();
    }
  }, [user]);

  const fetchCurrentElection = async () => {
    setLoading(true);
    
    // Get current open election
    const { data: electionData, error: electionError } = await supabase
      .from('elections')
      .select('*')
      .eq('status', 'open')
      .single();

    if (electionError || !electionData) {
      setElection(null);
      setLoading(false);
      return;
    }

    setElection(electionData);

    // Get candidates for this election
    const { data: candidatesData, error: candidatesError } = await supabase
      .from('candidates')
      .select('*')
      .eq('election_id', electionData.id)
      .order('position', { ascending: true });

    if (candidatesError) {
      toast({
        title: 'Error',
        description: 'Failed to load candidates: ' + candidatesError.message,
        variant: 'destructive',
      });
    } else {
      setCandidates(candidatesData || []);
    }

    // Check if user has already voted
    const { data: hasVotedData } = await supabase.rpc('has_user_voted', {
      election_uuid: electionData.id,
      user_uuid: user?.id
    });

    setHasVoted(hasVotedData || false);
    setLoading(false);
  };

  const handleCandidateSelect = (position: 'president' | 'vice_president' | 'secretary', candidateId: string) => {
    setVoteForm(prev => ({
      ...prev,
      [`${position}_candidate_id`]: candidateId
    }));
  };

  const handleSubmitVote = async () => {
    // Validate form
    if (!voteForm.voter_full_name || !voteForm.voter_student_id || !voteForm.voter_department || !voteForm.voter_batch) {
      toast({
        title: 'Error',
        description: 'Please fill in all voter details',
        variant: 'destructive',
      });
      return;
    }

    if (!voteForm.president_candidate_id || !voteForm.vice_president_candidate_id || !voteForm.secretary_candidate_id) {
      toast({
        title: 'Error',
        description: 'Please select a candidate for each position',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from('votes')
      .insert([{
        election_id: election!.id,
        user_id: user!.id,
        ...voteForm,
      }]);

    if (error) {
      toast({
        title: 'Error',
        description: error.message.includes('duplicate') 
          ? 'You have already voted in this election'
          : 'Failed to submit vote. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Your vote has been submitted successfully!',
      });
      setHasVoted(true);
    }

    setSubmitting(false);
  };

  const getPositionLabel = (position: string) => {
    switch (position) {
      case 'president': return 'President';
      case 'vice_president': return 'Vice President';
      case 'secretary': return 'Secretary';
      default: return position;
    }
  };

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <VoteLayout>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading election...</p>
          </div>
        </div>
      </VoteLayout>
    );
  }

  return (
    <VoteLayout>
      {/* Hero Section */}
      <section className="relative min-h-[30vh] flex items-center overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/70 to-gray-900/60 dark:from-gray-950/90 dark:via-gray-950/80 dark:to-gray-950/70 z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=1920')] bg-cover bg-center opacity-30 dark:opacity-20" />
        </div>

        <div className="container mx-auto px-4 py-16 relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <VoteIcon className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-medium">
                Club Elections
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Cast Your <span className="text-primary">Vote</span>
            </h1>

            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Exercise your democratic right and help choose the next leaders of our ethics club.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {!election ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Active Election</h3>
              <p className="text-muted-foreground">
                There are currently no open elections. Check back later or contact the admin for more information.
              </p>
            </CardContent>
          </Card>
        ) : hasVoted ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Vote Submitted</h3>
              <p className="text-muted-foreground">
                Thank you for participating in the election. Your vote has been recorded successfully.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Election Info */}
            <Card className="scroll-fade-up">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{election.title}</CardTitle>
                    {election.description && (
                      <p className="text-muted-foreground mt-2">{election.description}</p>
                    )}
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Open
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Voter Information */}
            <Card className="scroll-fade-up-delay">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Voter Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Please provide accurate information. This will be used to verify your eligibility to vote.
                  </AlertDescription>
                </Alert>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <Input
                      value={voteForm.voter_full_name}
                      onChange={(e) => setVoteForm(prev => ({ ...prev, voter_full_name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Student ID *</label>
                    <Input
                      value={voteForm.voter_student_id}
                      onChange={(e) => setVoteForm(prev => ({ ...prev, voter_student_id: e.target.value }))}
                      placeholder="Enter your student ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Department *</label>
                    <Input
                      value={voteForm.voter_department}
                      onChange={(e) => setVoteForm(prev => ({ ...prev, voter_department: e.target.value }))}
                      placeholder="Enter your department"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Batch *</label>
                    <Input
                      value={voteForm.voter_batch}
                      onChange={(e) => setVoteForm(prev => ({ ...prev, voter_batch: e.target.value }))}
                      placeholder="Enter your batch year"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voting Sections */}
            {['president', 'vice_president', 'secretary'].map((position) => {
              const positionCandidates = candidates.filter(c => c.position === position);
              const selectedCandidate = voteForm[`${position}_candidate_id` as keyof VoteForm];

              return (
                <Card key={position} className="scroll-fade-up">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <VoteIcon className="w-5 h-5" />
                      Vote for {getPositionLabel(position)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {positionCandidates.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No candidates available for this position.
                      </p>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        {positionCandidates.map((candidate) => (
                          <div
                            key={candidate.id}
                            onClick={() => handleCandidateSelect(position as any, candidate.id)}
                            className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                              selectedCandidate === candidate.id
                                ? 'border-primary bg-primary/5 shadow-md'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-start gap-3 mb-4">
                              {candidate.photo_url ? (
                                <img
                                  src={candidate.photo_url}
                                  alt={candidate.full_name}
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="w-8 h-8 text-primary" />
                                </div>
                              )}
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground mb-1">{candidate.full_name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {candidate.department} • {candidate.batch}
                                </p>
                                {selectedCandidate === candidate.id && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <CheckCircle className="w-4 h-4 text-primary" />
                                    <span className="text-sm text-primary font-medium">Selected</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            {candidate.manifesto && (
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {candidate.manifesto}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {/* Submit Vote */}
            <Card className="scroll-fade-up">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">Your vote is secure and anonymous</span>
                  </div>
                  
                  <Button
                    onClick={handleSubmitVote}
                    disabled={submitting}
                    size="lg"
                    className="gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting Vote...
                      </>
                    ) : (
                      <>
                        <VoteIcon className="w-5 h-5" />
                        Submit Vote
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    By submitting your vote, you confirm that the information provided is accurate and that you are eligible to vote in this election.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </VoteLayout>
  );
}