import { useState, useEffect } from 'react';
import { VoteLayout } from '@/components/layout/VoteLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useAuth } from '@/hooks/useAuth';
import { FirestoreService, Collections } from '@/lib/firestore';
import { where, query, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Vote as VoteIcon, 
  User, 
  CheckCircle, 
  AlertTriangle, 
  Lock,
  Clock,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';

interface Election {
  id: string;
  title: string;
  description: string | null;
  status: 'draft' | 'open' | 'closed';
  startDate: any;
  endDate: any;
}

interface Candidate {
  id: string;
  fullName: string;
  position: 'president' | 'vice_president' | 'secretary';
  photoUrl: string | null;
  department: string;
  batch: string;
  manifesto: string | null;
}

interface VoteForm {
  voterFullName: string;
  voterStudentId: string;
  voterDepartment: string;
  voterBatch: string;
  presidentCandidateId: string;
  vicePresidentCandidateId: string;
  secretaryCandidateId: string;
}

export default function VotePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  console.log('🔍 Vote Page State:', { user: !!user, authLoading, loading, election: !!election, candidatesCount: candidates.length });
  const [voteForm, setVoteForm] = useState<VoteForm>({
    voterFullName: '',
    voterStudentId: '',
    voterDepartment: '',
    voterBatch: '',
    presidentCandidateId: '',
    vicePresidentCandidateId: '',
    secretaryCandidateId: '',
  });

  useScrollAnimation();

  useEffect(() => {
    fetchCurrentElection();
  }, [user]);

  const fetchCurrentElection = async () => {
    setLoading(true);
    
    try {
      console.log('🔍 Fetching elections...');
      
      // Get current open election
      const elections = await FirestoreService.getAll(Collections.ELECTIONS, [
        where('status', '==', 'open')
      ]);

      console.log('📊 Elections found:', elections);

      if (!elections || elections.length === 0) {
        console.log('❌ No open elections found');
        setElection(null);
        setLoading(false);
        return;
      }

      const currentElection = elections[0] as Election;
      console.log('✅ Current election:', currentElection);
      setElection(currentElection);

      // Get candidates for this election
      console.log('🔍 Fetching candidates for election:', currentElection.id);
      const candidatesData = await FirestoreService.getAll(Collections.CANDIDATES, [
        where('electionId', '==', currentElection.id)
      ]);

      console.log('👥 Candidates found:', candidatesData);
      setCandidates(candidatesData as Candidate[]);

      // Check if user has already voted
      if (user?.uid) {
        console.log('🔍 Checking if user has voted:', user.uid);
        const votesQuery = query(
          collection(db, Collections.VOTES),
          where('electionId', '==', currentElection.id),
          where('userId', '==', user.uid)
        );
        const votesSnapshot = await getDocs(votesQuery);
        const hasVotedResult = !votesSnapshot.empty;
        console.log('🗳️ User has voted:', hasVotedResult);
        setHasVoted(hasVotedResult);
      }

    } catch (error) {
      console.error('❌ Error fetching election data:', error);
      toast.error('Failed to load election data: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateSelect = (position: 'president' | 'vice_president' | 'secretary', candidateId: string) => {
    const fieldName = position === 'president' ? 'presidentCandidateId' : 
                     position === 'vice_president' ? 'vicePresidentCandidateId' : 
                     'secretaryCandidateId';
    
    setVoteForm(prev => ({
      ...prev,
      [fieldName]: candidateId
    }));
  };

  const handleSubmitVote = async () => {
    // Validate form
    if (!voteForm.voterFullName || !voteForm.voterStudentId || !voteForm.voterDepartment || !voteForm.voterBatch) {
      toast.error('Please fill in all voter details');
      return;
    }

    if (!voteForm.presidentCandidateId || !voteForm.vicePresidentCandidateId || !voteForm.secretaryCandidateId) {
      toast.error('Please select a candidate for each position');
      return;
    }

    setSubmitting(true);

    try {
      await FirestoreService.create(Collections.VOTES, {
        electionId: election!.id,
        userId: user!.uid,
        voterFullName: voteForm.voterFullName,
        voterStudentId: voteForm.voterStudentId,
        voterDepartment: voteForm.voterDepartment,
        voterBatch: voteForm.voterBatch,
        presidentCandidateId: voteForm.presidentCandidateId,
        vicePresidentCandidateId: voteForm.vicePresidentCandidateId,
        secretaryCandidateId: voteForm.secretaryCandidateId,
      });

      toast.success('Your vote has been submitted successfully!');
      setHasVoted(true);
    } catch (error: any) {
      console.error('Error submitting vote:', error);
      if (error.message?.includes('duplicate') || error.code === 'permission-denied') {
        toast.error('You have already voted in this election');
      } else {
        toast.error('Failed to submit vote. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getPositionLabel = (position: string) => {
    switch (position) {
      case 'president': return 'President';
      case 'vice_president': return 'Vice President';
      case 'secretary': return 'Secretary';
      default: return position;
    }
  };

  // Redirect if not logged in and auth is not loading
  // Temporarily disabled for debugging
  // if (!authLoading && !user) {
  //   return <Navigate to="/auth" replace />;
  // }

  if (loading || authLoading) {
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
      {/* Debug Info */}
      <div className="container mx-auto px-4 py-4 bg-yellow-100 dark:bg-yellow-900/20">
        <p className="text-sm">
          Debug: User: {user ? '✅' : '❌'} | Auth Loading: {authLoading ? '⏳' : '✅'} | 
          Data Loading: {loading ? '⏳' : '✅'} | Election: {election ? '✅' : '❌'} | 
          Candidates: {candidates.length}
        </p>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[25vh] flex items-center overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/70 to-gray-900/60 dark:from-gray-950/90 dark:via-gray-950/80 dark:to-gray-950/70 z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=1920')] bg-cover bg-center opacity-30 dark:opacity-20" />
        </div>

        <div className="container mx-auto px-4 pt-16 pb-16 relative z-20">
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
                      value={voteForm.voterFullName}
                      onChange={(e) => setVoteForm(prev => ({ ...prev, voterFullName: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Student ID *</label>
                    <Input
                      value={voteForm.voterStudentId}
                      onChange={(e) => setVoteForm(prev => ({ ...prev, voterStudentId: e.target.value }))}
                      placeholder="Enter your student ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Department *</label>
                    <Input
                      value={voteForm.voterDepartment}
                      onChange={(e) => setVoteForm(prev => ({ ...prev, voterDepartment: e.target.value }))}
                      placeholder="Enter your department"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Batch *</label>
                    <Input
                      value={voteForm.voterBatch}
                      onChange={(e) => setVoteForm(prev => ({ ...prev, voterBatch: e.target.value }))}
                      placeholder="Enter your batch year"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voting Sections */}
            {['president', 'vice_president', 'secretary'].map((position) => {
              const positionCandidates = candidates.filter(c => c.position === position);
              const fieldName = position === 'president' ? 'presidentCandidateId' : 
                               position === 'vice_president' ? 'vicePresidentCandidateId' : 
                               'secretaryCandidateId';
              const selectedCandidate = voteForm[fieldName as keyof VoteForm];

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
                              {candidate.photoUrl ? (
                                <img
                                  src={candidate.photoUrl}
                                  alt={candidate.fullName}
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="w-8 h-8 text-primary" />
                                </div>
                              )}
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground mb-1">{candidate.fullName}</h4>
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