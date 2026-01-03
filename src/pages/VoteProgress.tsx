import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { FirestoreService, Collections } from '@/lib/firestore';
import { where, Timestamp } from 'firebase/firestore';
import { 
  Vote as VoteIcon, 
  Users, 
  Clock, 
  ChevronLeft,
  Trophy,
  Activity,
  User
} from 'lucide-react';
import { Election, Candidate, Vote } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export default function VoteProgress() {
  const { isVotingEnabled } = useSystemSettings();
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useScrollAnimation();

  useEffect(() => {
    let unsubscribeElection: () => void;
    let unsubscribeCandidates: () => void;
    let unsubscribeVotes: () => void;

    const setupSubscriptions = async () => {
      try {
        // 1. Get current open election
        unsubscribeElection = FirestoreService.subscribe(
          Collections.ELECTIONS,
          (elections) => {
            const openElection = elections.find(e => e.status === 'open');
            if (openElection) {
              setElection(openElection as Election);
              
              // 2. Subscribe to candidates for this election
              if (unsubscribeCandidates) unsubscribeCandidates();
              unsubscribeCandidates = FirestoreService.subscribe(
                Collections.CANDIDATES,
                (data) => setCandidates(data as Candidate[]),
                [where('electionId', '==', openElection.id)]
              );

              // 3. Subscribe to votes for this election
              if (unsubscribeVotes) unsubscribeVotes();
              unsubscribeVotes = FirestoreService.subscribe(
                Collections.VOTES,
                (data) => setVotes(data as Vote[]),
                [where('electionId', '==', openElection.id)]
              );
            } else {
              setElection(null);
            }
            setLoading(false);
          },
          [where('status', '==', 'open')]
        );
      } catch (error) {
        console.error('Error setting up subscriptions:', error);
        setLoading(false);
      }
    };

    setupSubscriptions();

    return () => {
      if (unsubscribeElection) unsubscribeElection();
      if (unsubscribeCandidates) unsubscribeCandidates();
      if (unsubscribeVotes) unsubscribeVotes();
    };
  }, []);

  // Timer Effect
  useEffect(() => {
    if (!election?.endDate) return;

    const interval = setInterval(() => {
      const end = election.endDate.toDate();
      const now = new Date();
      
      if (now > end) {
        setTimeLeft('Election Completed');
        clearInterval(interval);
      } else {
        setTimeLeft(formatDistanceToNow(end, { addSuffix: true }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [election]);

  const getVoteCount = (candidateId: string, position: string) => {
    const field = position === 'president' ? 'presidentCandidateId' : 
                 position === 'vice_president' ? 'vicePresidentCandidateId' : 
                 'secretaryCandidateId';
    
    return votes.filter(v => v[field as keyof Vote] === candidateId).length;
  };

  const getPositionLabel = (position: string) => {
    switch (position) {
      case 'president': return 'President';
      case 'vice_president': return 'Vice President';
      case 'secretary': return 'Secretary';
      default: return position;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading progress...</p>
      </div>
    );
  }

  if (!election || !isVotingEnabled) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="py-12">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold mb-2">No Active Election Progress</h2>
            <p className="text-muted-foreground mb-6">
              There is currently no voting process in progress or results are hidden.
            </p>
            <Link to="/vote">
              <Button variant="outline" className="gap-2">
                <ChevronLeft className="w-4 h-4" /> Back to Voting
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24 max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to="/vote" className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Voting
          </Link>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
            Election Live Progress
          </h1>
          <p className="text-muted-foreground">{election.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 py-1.5 px-3 gap-1.5 text-sm font-semibold">
            <Activity className="w-4 h-4 animate-pulse" />
            Live Updates
          </Badge>
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 py-1.5 px-3 gap-1.5 text-sm font-semibold">
            <Clock className="w-4 h-4" />
            {timeLeft}
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Votes Cast</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{votes.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/5 to-transparent border-orange-500/10">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Current Leaderboard</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Real-time Standings</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Tables */}
      <div className="space-y-8">
        {['president', 'vice_president', 'secretary'].map((position) => {
          const positionCandidates = candidates
            .filter(c => c.position === position)
            .sort((a, b) => getVoteCount(b.id, position) - getVoteCount(a.id, position));

          return (
            <Card key={position} className="overflow-hidden border-gray-200 dark:border-gray-800 shadow-xl">
              <CardHeader className="bg-gray-50 dark:bg-gray-900/50 border-b">
                <CardTitle className="flex items-center justify-between">
                  <span>{getPositionLabel(position)} Candidates</span>
                  <Badge variant="secondary">{positionCandidates.length} Active</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {positionCandidates.map((candidate, index) => {
                    const count = getVoteCount(candidate.id, position);
                    const percentage = votes.length > 0 ? Math.round((count / votes.length) * 100) : 0;
                    
                    return (
                      <div key={candidate.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                              {candidate.photoUrl ? (
                                <img src={candidate.photoUrl} alt={candidate.fullName} className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-6 h-6 text-primary" />
                              )}
                            </div>
                            {index === 0 && count > 0 && (
                              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full p-1 shadow-sm border border-yellow-500">
                                <Trophy className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">{candidate.fullName}</h4>
                            <p className="text-xs text-muted-foreground">{candidate.department} • Batch of {candidate.batch}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-baseline justify-end gap-1">
                            <span className="text-2xl font-black text-primary">{count}</span>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Votes</span>
                          </div>
                          <div className="w-32 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-2 overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-1000 ease-out"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {positionCandidates.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground italic">
                      No candidates found for this position.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Security Notice:</strong> Vote data is synchronized in real-time. Voter identities are encrypted and only the aggregate numbers are displayed publicly.
        </p>
      </div>
    </div>
  );
}
