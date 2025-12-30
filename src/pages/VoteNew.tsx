import { useState, useEffect } from 'react';
import { VoteLayout } from '@/components/layout/VoteLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useSystemSettings } from '@/hooks/useSystemSettings';
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
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { Navigate, useNavigate } from 'react-router-dom';

interface Election {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'open' | 'closed';
}

interface Candidate {
  id: string;
  fullName: string;
  position: 'president' | 'vice_president' | 'secretary';
  department: string;
  batch: string;
  manifesto: string;
  photoUrl?: string;
}

export default function VoteNew() {
  const { user, isLoading: authLoading } = useAuth();
  const { votingEnabled, electionOpen } = useSystemSettings();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const [voteForm, setVoteForm] = useState({
    voterFullName: '',
    voterStudentId: '',
    voterDepartment: '',
    voterBatch: '',
    selectedCandidates: {
      president: '',
      vice_president: '',
      secretary: ''
    }
  });

  // Firebase data loading
  useEffect(() => {
    if (user) {
      fetchElectionData();
    }
  }, [user]);

  const fetchElectionData = async () => {
    setLoading(true);
    
    try {
      console.log('🔍 Fetching election data...');
      
      // Get open elections
      const elections = await FirestoreService.getAll(Collections.ELECTIONS, [
        where('status', '==', 'open')
      ]);

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
      const candidatesData = await FirestoreService.getAll(Collections.CANDIDATES, [
        where('electionId', '==', currentElection.id)
      ]);

      console.log('👥 Candidates found:', candidatesData);
      
      // Sort candidates by position in JavaScript
      const sortedCandidates = (candidatesData as Candidate[]).sort((a, b) => {
        const positionOrder = { 'president': 1, 'vice_president': 2, 'secretary': 3 };
        return positionOrder[a.position] - positionOrder[b.position];
      });
      
      setCandidates(sortedCandidates);

      // Check if user has already voted
      if (user?.uid) {
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
      toast.error('Failed to load election data');
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateSelect = (position: 'president' | 'vice_president' | 'secretary', candidateId: string) => {
    setVoteForm(prev => ({
      ...prev,
      selectedCandidates: {
        ...prev.selectedCandidates,
        [position]: candidateId
      }
    }));
  };

  const validateForm = () => {
    if (!voteForm.voterFullName || !voteForm.voterStudentId || !voteForm.voterDepartment || !voteForm.voterBatch) {
      toast.error('Please fill in all voter details');
      return false;
    }

    if (!voteForm.selectedCandidates.president || !voteForm.selectedCandidates.vice_president || !voteForm.selectedCandidates.secretary) {
      toast.error('Please select a candidate for each position');
      return false;
    }

    return true;
  };

  const handleSubmitVote = () => {
    if (!validateForm()) return;
    setShowConfirmDialog(true);
  };

  const confirmVote = async () => {
    setSubmitting(true);
    setShowConfirmDialog(false);

    try {
      await FirestoreService.create(Collections.VOTES, {
        electionId: election!.id,
        userId: user!.uid,
        voterFullName: voteForm.voterFullName,
        voterStudentId: voteForm.voterStudentId,
        voterDepartment: voteForm.voterDepartment,
        voterBatch: voteForm.voterBatch,
        presidentCandidateId: voteForm.selectedCandidates.president,
        vicePresidentCandidateId: voteForm.selectedCandidates.vice_president,
        secretaryCandidateId: voteForm.selectedCandidates.secretary,
      });

      toast.success('Your vote has been submitted successfully!');
      setHasVoted(true);
    } catch (error: any) {
      console.error('Error submitting vote:', error);
      toast.error('Failed to submit vote. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getSelectedCandidateName = (position: 'president' | 'vice_president' | 'secretary') => {
    const candidateId = voteForm.selectedCandidates[position];
    const candidate = candidates.find(c => c.id === candidateId);
    return candidate?.fullName || 'None selected';
  };

  const getPositionLabel = (position: string) => {
    switch (position) {
      case 'president': return 'President';
      case 'vice_president': return 'Vice President';
      case 'secretary': return 'Secretary';
      default: return position;
    }
  };

  // Check if voting is disabled or user has voted
  if (!votingEnabled || !electionOpen) {
    return (
      <VoteLayout>
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Voting Closed</h3>
              <p className="text-muted-foreground">
                Voting is currently disabled. Please check back later or contact the admin for more information.
              </p>
            </CardContent>
          </Card>
        </div>
      </VoteLayout>
    );
  }

  if (hasVoted) {
    return (
      <VoteLayout>
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Vote Submitted</h3>
              <p className="text-muted-foreground">
                Thank you for participating in the election. Your vote has been recorded successfully.
              </p>
            </CardContent>
          </Card>
        </div>
      </VoteLayout>
    );
  }

  // Redirect if not logged in
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

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

            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4 leading-tight text-gradient-hero">
              Cast Your <span className="text-gradient-primary">Vote</span>
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
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Election Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{election.title}</CardTitle>
                    <p className="text-muted-foreground mt-2">{election.description}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Open
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Voter Information */}
            <Card>
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
                      placeholder="Enter your full name" 
                      value={voteForm.voterFullName}
                      onChange={(e) => setVoteForm(prev => ({ ...prev, voterFullName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Student ID *</label>
                    <Input 
                      placeholder="Enter your student ID" 
                      value={voteForm.voterStudentId}
                      onChange={(e) => setVoteForm(prev => ({ ...prev, voterStudentId: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Department *</label>
                    <Input 
                      placeholder="Enter your department" 
                      value={voteForm.voterDepartment}
                      onChange={(e) => setVoteForm(prev => ({ ...prev, voterDepartment: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Batch *</label>
                    <Input 
                      placeholder="Enter your batch year" 
                      value={voteForm.voterBatch}
                      onChange={(e) => setVoteForm(prev => ({ ...prev, voterBatch: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Candidates */}
            {['president', 'vice_president', 'secretary'].map((position) => {
              const positionCandidates = candidates.filter(c => c.position === position);
              const positionLabel = position === 'president' ? 'President' : 
                                   position === 'vice_president' ? 'Vice President' : 'Secretary';

              return (
                <Card key={position}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <VoteIcon className="w-5 h-5" />
                      Vote for {positionLabel}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {positionCandidates.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No candidates available for this position.
                      </p>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        {positionCandidates.map((candidate) => {
                          const isSelected = voteForm.selectedCandidates[position as keyof typeof voteForm.selectedCandidates] === candidate.id;
                          
                          return (
                            <div
                              key={candidate.id}
                              onClick={() => handleCandidateSelect(position as 'president' | 'vice_president' | 'secretary', candidate.id)}
                              className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                                isSelected 
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
                                  {isSelected && (
                                    <div className="flex items-center gap-1 mt-2">
                                      <CheckCircle className="w-4 h-4 text-primary" />
                                      <span className="text-sm text-primary font-medium">Selected</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {candidate.manifesto}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {/* Submit Vote */}
            <Card>
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

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Confirm Your Vote
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please review your selections before submitting. Once submitted, your vote cannot be changed.
            </p>
            
            <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
              <div>
                <span className="font-medium">President:</span>
                <p className="text-sm text-muted-foreground">{getSelectedCandidateName('president')}</p>
              </div>
              <div>
                <span className="font-medium">Vice President:</span>
                <p className="text-sm text-muted-foreground">{getSelectedCandidateName('vice_president')}</p>
              </div>
              <div>
                <span className="font-medium">Secretary:</span>
                <p className="text-sm text-muted-foreground">{getSelectedCandidateName('secretary')}</p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmVote} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Confirm Vote'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </VoteLayout>
  );
}