import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSystemSettings } from '@/hooks/useSystemSettings';
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
  Loader2,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

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
  const { user, isLoading: authLoading, isAdmin } = useAuth();
  const { isVotingEnabled, isElectionOpen } = useSystemSettings();
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  console.log('🔍 Vote Page State:', { 
    user: !!user, 
    authLoading, 
    loading, 
    election: !!election, 
    candidatesCount: candidates.length,
    isVotingEnabled,
    isElectionOpen,
    bothTogglesEnabled: isVotingEnabled && isElectionOpen
  });
  
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
      console.log('🔧 System settings:', { isVotingEnabled, isElectionOpen });
      console.log('🔧 Firebase config check:', { 
        hasDb: !!db, 
        projectId: db?.app?.options?.projectId 
      });
      
      // Get current open election
      console.log('📊 Querying elections with status = "open"...');
      const elections = await FirestoreService.getAll(Collections.ELECTIONS, [
        where('status', '==', 'open')
      ]);

      console.log('📊 Elections found:', elections);
      console.log('📊 Total elections count:', elections.length);
      console.log('📊 Elections data:', JSON.stringify(elections, null, 2));

      if (!elections || elections.length === 0) {
        console.log('❌ No open elections found');
        
        // Also check for all elections to debug
        console.log('🔍 Checking for elections with any status...');
        const allElections = await FirestoreService.getAll(Collections.ELECTIONS);
        console.log('📊 All elections (any status):', allElections);
        console.log('📊 All elections count:', allElections.length);
        
        if (allElections.length > 0) {
          console.log('⚠️ Found elections but none are "open". Election statuses:');
          allElections.forEach((election: any, index: number) => {
            console.log(`   ${index + 1}. "${election.title}" - Status: "${election.status}"`);
          });
        } else {
          console.log('❌ No elections found at all. Database might be empty.');
        }
        
        setElection(null);
        setLoading(false);
        return;
      }

      const currentElection = elections[0] as Election;
      console.log('✅ Current election:', currentElection);
      console.log('✅ Election details:', {
        id: currentElection.id,
        title: currentElection.title,
        status: currentElection.status,
        description: currentElection.description
      });
      setElection(currentElection);

      // Get candidates for this election
      console.log('🔍 Fetching candidates for election:', currentElection.id);
      const candidatesData = await FirestoreService.getAll(Collections.CANDIDATES, [
        where('electionId', '==', currentElection.id)
      ]);

      console.log('👥 Candidates found:', candidatesData);
      console.log('👥 Candidates count:', candidatesData.length);
      console.log('👥 Candidates data:', JSON.stringify(candidatesData, null, 2));
      
      if (candidatesData.length === 0) {
        console.log('⚠️ No candidates found for this election. Check if candidates were created with the correct electionId.');
      } else {
        console.log('✅ Candidates by position:');
        const positions = ['president', 'vice_president', 'secretary'];
        positions.forEach(position => {
          const positionCandidates = candidatesData.filter((c: any) => c.position === position);
          console.log(`   ${position}: ${positionCandidates.length} candidates`);
          positionCandidates.forEach((candidate: any, index: number) => {
            console.log(`     ${index + 1}. ${candidate.fullName} (${candidate.department})`);
          });
        });
      }
      
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
      console.error('❌ Error details:', {
        message: (error as Error).message,
        code: (error as any).code,
        stack: (error as Error).stack
      });
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

  if (loading || authLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading election...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <VoteIcon className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary font-medium">
            Club Elections
          </span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-4 text-foreground">
          Cast Your Vote
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Exercise your democratic right and help choose the next leaders of our ethics club.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/vote/progress">
            <Button variant="outline" className="gap-2 rounded-full px-6">
              <Activity className="w-4 h-4 text-primary" />
              View Live Progress
            </Button>
          </Link>
        </div>
      </div>

      {!isVotingEnabled ? (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-12">
            <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Voting System Disabled</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The club voting system is currently disabled by the administrator.
            </p>
            {isAdmin && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-left max-w-md mx-auto border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong className="font-bold">Admin Note:</strong> Go to <Link to="/admin" className="underline font-semibold">Admin Panel → Settings</Link> to enable the "Voting System" toggle.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : !isElectionOpen ? (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-12">
            <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Election Closed</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The voting system is active, but the current election period is closed or hasn't started yet.
            </p>
            {isAdmin && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-left max-w-md mx-auto border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong className="font-bold">Admin Note:</strong> Go to <Link to="/admin" className="underline font-semibold">Admin Panel → Settings</Link> to enable the "Election Status" toggle.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : !election ? (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <VoteIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Active Election</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              There are no elections currently marked as "Open". 
            </p>
            {isAdmin && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-left max-w-md mx-auto border border-blue-100 dark:border-blue-800 space-y-3">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong className="font-bold">Admin Note:</strong> You have added elections, but you must set the status of at least one election to <span className="font-bold">"Open"</span> in the Elections management tab.
                </p>
                <div className="flex justify-center pt-2">
                  <Link to="/admin">
                    <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Go to Election Management
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : hasVoted ? (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Thank you for participating in the election. Your vote has been recorded successfully.
            </p>
            <Link to="/vote/progress">
              <Button className="gap-2">
                <Activity className="w-4 h-4" />
                View Real-time Results
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Election Info */}
          <Card className="scroll-fade-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-gray-900 dark:text-white">{election.title}</CardTitle>
                  {election.description && (
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{election.description}</p>
                  )}
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Open
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Voter Information */}
          <Card className="scroll-fade-up-delay">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <User className="w-5 h-5" />
                Voter Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-gray-700 dark:text-gray-300">
                  Please provide accurate information. This will be used to verify your eligibility to vote.
                </AlertDescription>
              </Alert>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Full Name *</label>
                  <Input
                    value={voteForm.voterFullName}
                    onChange={(e) => setVoteForm(prev => ({ ...prev, voterFullName: e.target.value }))}
                    placeholder="Enter your full name"
                    className="text-gray-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Student ID *</label>
                  <Input
                    value={voteForm.voterStudentId}
                    onChange={(e) => setVoteForm(prev => ({ ...prev, voterStudentId: e.target.value }))}
                    placeholder="Enter your student ID"
                    className="text-gray-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Department *</label>
                  <Input
                    value={voteForm.voterDepartment}
                    onChange={(e) => setVoteForm(prev => ({ ...prev, voterDepartment: e.target.value }))}
                    placeholder="Enter your department"
                    className="text-gray-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Batch *</label>
                  <Input
                    value={voteForm.voterBatch}
                    onChange={(e) => setVoteForm(prev => ({ ...prev, voterBatch: e.target.value }))}
                    placeholder="Enter your batch year"
                    className="text-gray-900 dark:text-white font-medium"
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
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <VoteIcon className="w-5 h-5 text-primary" />
                    Vote for {getPositionLabel(position)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {positionCandidates.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-12 bg-muted/50 rounded-lg border border-dashed">
                      <User className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p>No candidates available for this position.</p>
                      {isAdmin && <p className="text-xs mt-1">Check the Admin Panel to add candidates for this position.</p>}
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {positionCandidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          onClick={() => handleCandidateSelect(position as any, candidate.id)}
                          className={`border rounded-xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            selectedCandidate === candidate.id
                              ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-md'
                              : 'border-gray-200 dark:border-gray-700 hover:border-primary/40'
                          }`}
                        >
                          <div className="flex items-start gap-4 mb-4">
                            <div className="relative">
                              {candidate.photoUrl ? (
                                <img
                                  src={candidate.photoUrl}
                                  alt={candidate.fullName}
                                  className="w-20 h-20 rounded-xl object-cover shadow-sm"
                                />
                              ) : (
                                <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center">
                                  <User className="w-10 h-10 text-primary" />
                                </div>
                              )}
                              {selectedCandidate === candidate.id && (
                                <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1 shadow-md">
                                  <CheckCircle className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 dark:text-white text-lg truncate mb-1">{candidate.fullName}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                {candidate.department}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Batch of {candidate.batch}
                              </p>
                            </div>
                          </div>
                          {candidate.manifesto && (
                            <div className="bg-muted/30 rounded-lg p-3">
                              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-4 italic">
                                "{candidate.manifesto}"
                              </p>
                            </div>
                          )}
                          <Button 
                            variant={selectedCandidate === candidate.id ? "default" : "outline"} 
                            className="w-full mt-4"
                            size="sm"
                          >
                            {selectedCandidate === candidate.id ? 'Selected' : 'Select Candidate'}
                          </Button>
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
            <CardContent className="pt-8 pb-10">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium">Your vote is secure and your identity is protected</span>
                </div>
                
                <Button
                  onClick={handleSubmitVote}
                  disabled={submitting}
                  size="xl"
                  className="gap-3 px-12 py-6 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      Processing Your Vote...
                    </>
                  ) : (
                    <>
                      <VoteIcon className="w-6 h-6" />
                      Cast My Vote Now
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 dark:text-gray-500 max-w-lg mx-auto leading-relaxed">
                  By clicking "Cast My Vote Now", you confirm that the information provided is accurate and that you are an eligible student member of the HU Ethics Club. One vote per student ID is strictly enforced.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}