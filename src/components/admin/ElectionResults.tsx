import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Users, 
  BarChart3, 
  User, 
  CheckCircle,
  Download,
  Search
} from 'lucide-react';
import { FirestoreService, Collections } from '@/lib/firestore';
import { Election, Candidate, Vote } from '@/types';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/input';

interface ElectionResultsProps {
  election: Election;
  onBack: () => void;
}

export default function ElectionResults({ election, onBack }: ElectionResultsProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [election.id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch candidates
      const candidatesData = await FirestoreService.getAll(Collections.CANDIDATES, [
        where('electionId', '==', election.id)
      ]);
      setCandidates(candidatesData as Candidate[]);

      // Fetch all votes for this election
      const votesQuery = query(
        collection(db, Collections.VOTES),
        where('electionId', '==', election.id)
      );
      const votesSnapshot = await getDocs(votesQuery);
      const votesData = votesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vote));
      setVotes(votesData);

    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCandidateVotes = (candidateId: string, position: string) => {
    const field = position === 'president' ? 'presidentCandidateId' : 
                  position === 'vice_president' ? 'vicePresidentCandidateId' : 
                  'secretaryCandidateId';
    
    return votes.filter(v => (v as any)[field] === candidateId);
  };

  const getVotersByCandidate = (candidateId: string, position: string) => {
    const candidateVotes = getCandidateVotes(candidateId, position);
    return candidateVotes.map(v => v.voterFullName);
  };

  const positions = ['president', 'vice_president', 'secretary'];

  const filteredVoters = votes.filter(v => 
    v.voterFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.voterStudentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Calculating results...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{election.title} - Results</h2>
            <p className="text-muted-foreground">Total Votes Cast: {votes.length}</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => window.print()}>
          <Download className="w-4 h-4" />
          Export Results
        </Button>
      </div>

      <div className="grid gap-8">
        {positions.map(position => {
          const positionCandidates = candidates.filter(c => c.position === position);
          
          if (positionCandidates.length === 0) return null;

          return (
            <div key={position} className="space-y-4">
              <h3 className="text-xl font-semibold capitalize border-b pb-2 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                {position.replace('_', ' ')} Candidates
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {positionCandidates.map(candidate => {
                  const candidateVotes = getCandidateVotes(candidate.id, position);
                  const isWinner = candidateVotes.length > 0 && 
                    positionCandidates.every(c => getCandidateVotes(c.id, position).length <= candidateVotes.length);

                  return (
                    <Card key={candidate.id} className={`${isWinner ? 'border-primary shadow-md' : ''}`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{candidate.fullName}</CardTitle>
                          {isWinner && candidateVotes.length > 0 && (
                            <Badge className="bg-primary text-primary-foreground">
                              Current Winner
                            </Badge>
                          )}
                        </div>
                        <CardDescription>{candidate.department} - {candidate.batch}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold mb-4 flex items-center gap-2 text-primary">
                          {candidateVotes.length}
                          <span className="text-sm font-normal text-muted-foreground">votes</span>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            Voters List:
                          </p>
                          <div className="text-xs text-muted-foreground flex flex-wrap gap-1">
                            {candidateVotes.length > 0 ? (
                              candidateVotes.map((v, i) => (
                                <span key={i} className="bg-muted px-2 py-1 rounded">
                                  {v.voterFullName}
                                </span>
                              ))
                            ) : (
                              <span>No votes yet</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Voter List */}
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Overall Voter List</CardTitle>
              <CardDescription>Detailed list of all students who participated in this election</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search voters..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Full Name</th>
                  <th className="px-4 py-3 text-left font-medium">Student ID</th>
                  <th className="px-4 py-3 text-left font-medium">Department</th>
                  <th className="px-4 py-3 text-left font-medium">Batch</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredVoters.map((vote) => (
                  <tr key={vote.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{vote.voterFullName}</td>
                    <td className="px-4 py-3">{vote.voterStudentId}</td>
                    <td className="px-4 py-3">{vote.voterDepartment}</td>
                    <td className="px-4 py-3">{vote.voterBatch}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200 gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </Badge>
                    </td>
                  </tr>
                ))}
                {filteredVoters.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No voters found match your search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
