import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X, Users, User } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Election {
  id: string;
  title: string;
  status: 'draft' | 'open' | 'closed';
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

export default function CandidatesTab() {
  const [elections, setElections] = useState<Election[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedElection, setSelectedElection] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Candidate>>({
    full_name: '',
    position: 'president',
    photo_url: '',
    department: '',
    batch: '',
    manifesto: '',
  });

  useEffect(() => {
    fetchElections();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      fetchCandidates(selectedElection);
    }
  }, [selectedElection]);

  const fetchElections = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('elections')
      .select('id, title, status')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load elections',
        variant: 'destructive',
      });
    } else {
      setElections(data || []);
      if (data && data.length > 0) {
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

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      full_name: '',
      position: 'president',
      photo_url: '',
      department: '',
      batch: '',
      manifesto: '',
    });
  };

  const handleEdit = (candidate: Candidate) => {
    setEditingId(candidate.id);
    setFormData(candidate);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({});
  };

  const handleSave = async () => {
    if (!formData.full_name || !formData.department || !formData.batch || !selectedElection) {
      toast({
        title: 'Error',
        description: 'Name, department, and batch are required',
        variant: 'destructive',
      });
      return;
    }

    if (isAdding) {
      const { error } = await supabase
        .from('candidates')
        .insert([{
          ...formData,
          election_id: selectedElection,
        }]);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to add candidate',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Candidate added successfully',
        });
        fetchCandidates(selectedElection);
        handleCancel();
      }
    } else if (editingId) {
      const { error } = await supabase
        .from('candidates')
        .update(formData)
        .eq('id', editingId);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update candidate',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Candidate updated successfully',
        });
        fetchCandidates(selectedElection);
        handleCancel();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this candidate?')) {
      return;
    }

    const { error } = await supabase
      .from('candidates')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete candidate',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Candidate deleted successfully',
      });
      fetchCandidates(selectedElection);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Candidate Management</h2>
          <p className="text-muted-foreground">Manage candidates for elections</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedElection} onValueChange={setSelectedElection}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select election" />
            </SelectTrigger>
            <SelectContent>
              {elections.map((election) => (
                <SelectItem key={election.id} value={election.id}>
                  <div className="flex items-center gap-2">
                    <span>{election.title}</span>
                    <Badge className={getStatusColor(election.status)}>
                      {election.status}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAdd} disabled={!selectedElection} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Candidate
          </Button>
        </div>
      </div>

      {!selectedElection ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Select an election to manage candidates</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {(isAdding || editingId) && (
            <Card>
              <CardHeader>
                <CardTitle>{isAdding ? 'Add New Candidate' : 'Edit Candidate'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <Input
                      value={formData.full_name || ''}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Position *</label>
                    <Select
                      value={formData.position || 'president'}
                      onValueChange={(value: 'president' | 'vice_president' | 'secretary') => 
                        setFormData({ ...formData, position: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="president">President</SelectItem>
                        <SelectItem value="vice_president">Vice President</SelectItem>
                        <SelectItem value="secretary">Secretary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Department *</label>
                    <Input
                      value={formData.department || ''}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Batch *</label>
                    <Input
                      value={formData.batch || ''}
                      onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                      placeholder="e.g., 2021"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Photo URL</label>
                    <Input
                      value={formData.photo_url || ''}
                      onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Manifesto</label>
                  <Textarea
                    value={formData.manifesto || ''}
                    onChange={(e) => setFormData({ ...formData, manifesto: e.target.value })}
                    placeholder="Candidate's manifesto and goals..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="gap-2">
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            {['president', 'vice_president', 'secretary'].map((position) => {
              const positionCandidates = candidates.filter(c => c.position === position);
              return (
                <Card key={position}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      {getPositionLabel(position)} ({positionCandidates.length} candidates)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {positionCandidates.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No candidates for this position yet.
                      </p>
                    ) : (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {positionCandidates.map((candidate) => (
                          <div key={candidate.id} className="border rounded-lg p-4">
                            <div className="flex items-start gap-3 mb-4">
                              {candidate.photo_url ? (
                                <img
                                  src={candidate.photo_url}
                                  alt={candidate.full_name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="w-6 h-6 text-primary" />
                                </div>
                              )}
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground">{candidate.full_name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {candidate.department} • {candidate.batch}
                                </p>
                              </div>
                            </div>
                            {candidate.manifesto && (
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                {candidate.manifesto}
                              </p>
                            )}
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleEdit(candidate)}
                                variant="outline"
                                size="sm"
                                className="flex-1 gap-1"
                              >
                                <Edit className="w-3 h-3" />
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDelete(candidate.id)}
                                variant="destructive"
                                size="sm"
                                className="gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}