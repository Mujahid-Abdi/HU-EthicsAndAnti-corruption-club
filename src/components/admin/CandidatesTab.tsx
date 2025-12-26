import { useState, useEffect } from 'react';
import { FirestoreService, Collections } from '@/lib/firestore';
import { where, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X, Users, User } from 'lucide-react';
import { toast } from 'sonner';

interface Candidate {
  id: string;
  electionId: string;
  fullName: string;
  position: 'president' | 'vice_president' | 'secretary';
  photoUrl: string | null;
  department: string;
  batch: string;
  manifesto: string | null;
}

interface Election {
  id: string;
  title: string;
  status: 'draft' | 'open' | 'closed';
}

export default function CandidatesTab() {
  const [elections, setElections] = useState<Election[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedElection, setSelectedElection] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchElections();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      fetchCandidates();
    }
  }, [selectedElection]);

  const fetchElections = async () => {
    try {
      const data = await FirestoreService.getAll(Collections.ELECTIONS, [
        orderBy('createdAt', 'desc')
      ]);
      setElections(data as Election[]);
      if (data && data.length > 0 && !selectedElection) {
        setSelectedElection(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching elections:', error);
      toast.error('Failed to load elections');
    }
  };

  const fetchCandidates = async () => {
    if (!selectedElection) return;
    
    setLoading(true);
    try {
      const data = await FirestoreService.getAll(Collections.CANDIDATES, [
        where('electionId', '==', selectedElection),
        orderBy('position', 'asc')
      ]);
      setCandidates(data as Candidate[]);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Candidate>>({
    fullName: '',
    position: 'president',
    photoUrl: '',
    department: '',
    batch: '',
    manifesto: '',
  });

  const filteredCandidates = candidates.filter(c => c.electionId === selectedElection);

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      fullName: '',
      position: 'president',
      photoUrl: '',
      department: '',
      batch: '',
      manifesto: '',
    });
  };

  const handleEdit = (candidate: Candidate) => {
    setEditingId(candidate.id);
    setFormData(candidate);
  };

  const handleSave = async () => {
    if (!formData.fullName || !formData.department || !formData.batch) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!selectedElection) {
      toast.error('Please select an election first');
      return;
    }

    setLoading(true);

    try {
      if (isAdding) {
        await FirestoreService.create(Collections.CANDIDATES, {
          electionId: selectedElection,
          fullName: formData.fullName!,
          position: formData.position || 'president',
          photoUrl: formData.photoUrl || null,
          department: formData.department!,
          batch: formData.batch!,
          manifesto: formData.manifesto || null,
        });
        toast.success('Candidate added successfully');
      } else if (editingId) {
        await FirestoreService.update(Collections.CANDIDATES, editingId, {
          fullName: formData.fullName!,
          position: formData.position || 'president',
          photoUrl: formData.photoUrl || null,
          department: formData.department!,
          batch: formData.batch!,
          manifesto: formData.manifesto || null,
        });
        toast.success('Candidate updated successfully');
      }
      
      fetchCandidates(); // Refresh the list
    } catch (error) {
      console.error('Error saving candidate:', error);
      toast.error(`Failed to ${isAdding ? 'add' : 'update'} candidate`);
    } finally {
      setLoading(false);
      setIsAdding(false);
      setEditingId(null);
      setFormData({});
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this candidate? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await FirestoreService.delete(Collections.CANDIDATES, id);
      toast.success('Candidate deleted successfully');
      fetchCandidates(); // Refresh the list
    } catch (error) {
      console.error('Error deleting candidate:', error);
      toast.error('Failed to delete candidate');
    } finally {
      setLoading(false);
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'president': return 'bg-blue-100 text-blue-800';
      case 'vice_president': return 'bg-green-100 text-green-800';
      case 'secretary': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPosition = (position: string) => {
    return position.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Candidates Management</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage candidates for elections
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2" disabled={!selectedElection}>
          <Plus className="w-4 h-4" />
          Add Candidate
        </Button>
      </div>

      {/* Election Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Election</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={selectedElection}
            onChange={(e) => setSelectedElection(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select an election</option>
            {elections.map((election) => (
              <option key={election.id} value={election.id}>
                {election.title} ({election.status})
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {isAdding ? 'Add New Candidate' : 'Edit Candidate'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  value={formData.fullName || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter candidate's full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Position *</label>
                <select
                  value={formData.position || 'president'}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value as 'president' | 'vice_president' | 'secretary' }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="president">President</option>
                  <option value="vice_president">Vice President</option>
                  <option value="secretary">Secretary</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Department *</label>
                <Input
                  value={formData.department || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Enter department"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Batch *</label>
                <Input
                  value={formData.batch || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, batch: e.target.value }))}
                  placeholder="Enter batch year"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Photo URL</label>
              <Input
                value={formData.photoUrl || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, photoUrl: e.target.value }))}
                placeholder="Enter photo URL (optional)"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Manifesto</label>
              <Textarea
                value={formData.manifesto || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, manifesto: e.target.value }))}
                placeholder="Enter candidate's manifesto"
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Save Candidate
              </Button>
              <Button variant="outline" onClick={handleCancel} className="gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedElection && (
        <div className="grid gap-4">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      {candidate.photoUrl ? (
                        <img 
                          src={candidate.photoUrl} 
                          alt={candidate.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {candidate.fullName}
                        </h3>
                        <Badge className={getPositionColor(candidate.position)}>
                          {formatPosition(candidate.position)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span>{candidate.department}</span>
                        <span>Batch {candidate.batch}</span>
                      </div>
                      
                      {candidate.manifesto && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {candidate.manifesto}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(candidate)}
                      className="gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(candidate.id)}
                      className="gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedElection && filteredCandidates.length === 0 && !isAdding && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Candidates Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add candidates for this election
            </p>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="w-4 h-4" />
              Add First Candidate
            </Button>
          </CardContent>
        </Card>
      )}

      {!selectedElection && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Select an Election
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Choose an election to manage its candidates
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}