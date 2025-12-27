import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
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
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';

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

interface VoteForm {
  voterFullName: string;
  voterStudentId: string;
  voterDepartment: string;
  voterBatch: string;
  selectedCandidates: {
    president: string;
    vice_president: string;
    secretary: string;
  };
}

export default function VoteComplete() {
  const { user, isLoading: authLoading } = useAuth();
  const { votingEnabled, electionOpen } = useSystemSettings();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const [voteForm, setVoteForm] = useState<VoteForm>({
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
      setCandidates(candidatesData as Candidate[]);

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

  // Redirect if not logged in
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if voting is disabled
  if (!votingEnabled || !electionOpen) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Voting Closed</h3>
              <p className="text-mu  iv>
       </d    .</p>
    ion..ding elect">Loaroundforeged-ut"text-m className=       <piv>
     b-4"></do mimary mx-auter-prbordb-2 12 border-full h-12 w-unded-spin rote-e="animaamv classN    <di        -center">
e="textlassNam     <div c">
     -4 py-20mx-auto pxontainer me="cdiv classNa
        <t>    <Layoureturn (
   {
    ding)hLoang || autloadie
  if (g stathow loadin
  // S }
 );
 t>
   ou </Layiv>
         </d>
    /Card          <ntent>
 </CardCo       
        </p>     tion.
     e informa for morthe adminontact ter or cla back eckse chabled. Pleantly diss curreng i      Voti        nd">
  outed-foregr