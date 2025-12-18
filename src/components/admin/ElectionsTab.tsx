import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Vote, 
  Users, 
  BarChart3,
  Play,
  Pause,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Election {
  id: string;
  title: string;
  description: string | null;
  status: 'draft' | 'open' | 'closed';
  start_date: string | null;
  end_date: string | null;
  results_public: boolean;
  created_at: string;
}

interface Candidate {
  id: string;
  election_id: string;
  full_name: string;
  position: 'president' | 'vice_president' | 'secretary';
  photo_url: string | null;
  department: string;
  batch: string;
  manifesto: string | null;
}

interface ElectionResult {
  position: 'president' | 'vice_president' | 'secretary';
  candidate_id: string;
  candidate_name: string;
  vote_count: number;
}

export default function ElectionsTab() {
  const [elections, setElections] = useState<Election[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [results, setResults] = useState<ElectionResult[]>([]);
  const [selectedElection, setSelectedElection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingElection, setEditingElection] = useState<string | null>(null);
  const [isAddingElection, setIsAddingElection] = useState(false);
  const [electionForm, setElectionForm] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    fetchElections();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      fetchCandidates(selectedElection);
      fetchResults(selectedElection);
    }
  }, [selectedElection]);

  const fetchElections = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('elections')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load elections',
        variant: 'destructive',
      });
    } else {
      setElections(data || []);
      if (data && data.length > 0 && !selectedElection) {
        setSelectedElection(data[0].id);
      }
    }
    setLoading(false);
  };

  const fetchCandidates = async (electionId: string) => {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('election_id', electionId)
      .order('position', { ascending: true });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load candidates',
        variant: 'destructive',
      });
    } else {
      setCandidates(data || []);
    }
  };

  const fetchResults = async (electionId: string) => {
    const { data, error } = await supabase.rpc('get_election_results', {
      election_uuid: electionId
    });

    if (error) {
      console.error('Failed to load results:', error);
    } else {
      setResults(data || []);
    }
  };

  const handleCreateElection = async () => {
    if (!electionForm.title) {
      toast({
        title: 'Error',
        description: 'Election title is required',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('elections')
      .insert([{
        ...electionForm,
        start_date: electionForm.start_date || null,
        end_date: electionForm.end_date || null,
      }]);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create election',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Election created successfully',
      });
      fetchElections();
      setIsAddingElection(false);
      setElectionForm({ title: '', description: '', start_date: '', end_date: '' });
    }
  };

  const handleUpdateElectionStatus = async (electionId: string, status: 'draft' | 'open' | 'closed') => {
    const { error } = await supabase
      .from('elections')
      .update({ status })
      .eq('id', electionId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update election status',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `Election ${status === 'open' ? 'opened' : 'closed'} successfully`,
      });
      fetchElections();
    }
  };

  const handleToggleResultsPublic = async (electionId: string, resultsPublic: boolean) => {
    const { error } = await supabase
      .from('elections')
      .update({ results_public: resultsPublic })
      .eq('id', electionId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update results visibility',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `Results are now ${resultsPublic ? 'public' : 'private'}`,
      });
      fetchElections();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const currentElection = elections.find(e => e.id === selectedElection);

  if (loading) {
    return <div className="text-center py-8">Loading elections...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Election Management</h2>
          <p className="text-muted-foreground">Manage elections, candidates, and view results</p>
        </div>
        <Button onClick={() => setIsAddingElection(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Election
        </Button>
      </div>

      {isAddingElection && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Election</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={electionForm.title}
                onChange={(e) => setElectionForm({ ...electionForm, title: e.target.value })}
                placeholder="Election title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={electionForm.description}
                onChange={(e) => setElectionForm({ ...electionForm, description: e.target.value })}
                placeholder="Election description"
                rows={3}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <Input
                  type="datetime-local"
                  value={electionForm.start_date}
                  onChange={(e) => setElectionForm({ ...electionForm, start_date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <Input
                  type="datetime-local"
                  value={electionForm.end_date}
                  onChange={(e) => setElectionForm({ ...electionForm, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateElection} className="gap-2">
                <Save className="w-4 h-4" />
                Create Election
              </Button>
              <Button 
                onClick={() => {
                  setIsAddingElection(false);
                  setElectionForm({ title: '', description: '', start_date: '', end_date: '' });
                }} 
                variant="outline" 
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {elections.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Vote className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No elections found. Create your first election to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Elections List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Elections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {elections.map((election) => (
                  <div
                    key={election.id}
                    onClick={() => setSelectedElection(election.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedElection === election.id
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{election.title}</h4>
                      <Badge className={getStatusColor(election.status)}>
                        {election.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(election.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Election Details */}
          <div className="lg:col-span-3">
            {currentElection && (
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="candidates">Candidates</TabsTrigger>
                  <TabsTrigger value="results">Results</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{currentElection.title}</CardTitle>
                          <p className="text-muted-foreground mt-2">{currentElection.description}</p>
                        </div>
                        <Badge className={getStatusColor(currentElection.status)}>
                          {currentElection.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Start Date</label>
                          <p className="text-sm text-muted-foreground">
                            {currentElection.start_date 
                              ? new Date(currentElection.start_date).toLocaleString()
                              : 'Not set'
                            }
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">End Date</label>
                          <p className="text-sm text-muted-foreground">
                            {currentElection.end_date 
                              ? new Date(currentElection.end_date).toLocaleString()
                              : 'Not set'
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {currentElection.status === 'draft' && (
                          <Button
                            onClick={() => handleUpdateElectionStatus(currentElection.id, 'open')}
                            className="gap-2"
                          >
                            <Play className="w-4 h-4" />
                            Open Election
                          </Button>
                        )}
                        {currentElection.status === 'open' && (
                          <Button
                            onClick={() => handleUpdateElectionStatus(currentElection.id, 'closed')}
                            variant="destructive"
                            className="gap-2"
                          >
                            <Pause className="w-4 h-4" />
                            Close Election
                          </Button>
                        )}
                        {currentElection.status === 'closed' && (
                          <Button
                            onClick={() => handleToggleResultsPublic(currentElection.id, !currentElection.results_public)}
                            variant="outline"
                            className="gap-2"
                          >
                            {currentElection.results_public ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {currentElection.results_public ? 'Make Results Private' : 'Make Results Public'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="candidates">
                  <Card>
                    <CardHeader>
                      <CardTitle>Candidates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {candidates.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          No candidates added yet. Add candidates to start the election.
                        </p>
                      ) : (
                        <div className="space-y-6">
                          {['president', 'vice_president', 'secretary'].map((position) => {
                            const positionCandidates = candidates.filter(c => c.position === position);
                            return (
                              <div key={position}>
                                <h4 className="font-semibold mb-3">{getPositionLabel(position)}</h4>
                                {positionCandidates.length === 0 ? (
                                  <p className="text-sm text-muted-foreground">No candidates for this position</p>
                                ) : (
                                  <div className="grid md:grid-cols-2 gap-4">
                                    {positionCandidates.map((candidate) => (
                                      <div key={candidate.id} className="border rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                          {candidate.photo_url ? (
                                            <img
                                              src={candidate.photo_url}
                                              alt={candidate.full_name}
                                              className="w-12 h-12 rounded-full object-cover"
                                            />
                                          ) : (
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                              <Users className="w-6 h-6 text-primary" />
                                            </div>
                                          )}
                                          <div className="flex-1">
                                            <h5 className="font-medium">{candidate.full_name}</h5>
                                            <p className="text-sm text-muted-foreground">
                                              {candidate.department} • {candidate.batch}
                                            </p>
                                            {candidate.manifesto && (
                                              <p className="text-sm mt-2 line-clamp-2">{candidate.manifesto}</p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="results">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Election Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {results.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          No votes cast yet.
                        </p>
                      ) : (
                        <div className="space-y-6">
                          {['president', 'vice_president', 'secretary'].map((position) => {
                            const positionResults = results.filter(r => r.position === position);
                            const totalVotes = positionResults.reduce((sum, r) => sum + r.vote_count, 0);
                            
                            return (
                              <div key={position}>
                                <h4 className="font-semibold mb-3">
                                  {getPositionLabel(position)} ({totalVotes} votes)
                                </h4>
                                {positionResults.length === 0 ? (
                                  <p className="text-sm text-muted-foreground">No candidates for this position</p>
                                ) : (
                                  <div className="space-y-2">
                                    {positionResults.map((result) => {
                                      const percentage = totalVotes > 0 ? (result.vote_count / totalVotes) * 100 : 0;
                                      return (
                                        <div key={result.candidate_id} className="flex items-center gap-4">
                                          <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                              <span className="font-medium">{result.candidate_name}</span>
                                              <span className="text-sm text-muted-foreground">
                                                {result.vote_count} votes ({percentage.toFixed(1)}%)
                                              </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                              <div
                                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${percentage}%` }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      )}
    </div>
  );
}