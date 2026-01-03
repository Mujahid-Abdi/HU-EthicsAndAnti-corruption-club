import { useState, useEffect } from 'react';
import ElectionResults from './ElectionResults';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { toast } from 'sonner';
import { FirestoreService, Collections } from '@/lib/firestore';
import { Election, ElectionStatus } from '@/types';
import { Timestamp } from 'firebase/firestore';

export default function ElectionsTab() {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingResultsId, setViewingResultsId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Election>>({
    title: '',
    description: '',
    status: 'draft',
    startDate: undefined,
    endDate: undefined,
    resultsPublic: false,
  });

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    setLoading(true);
    try {
      const data = await FirestoreService.getAll(Collections.ELECTIONS);
      setElections(data as Election[]);
    } catch (error) {
      console.error('Elections fetch error:', error);
      toast.error('Failed to load elections. Please check your Firebase configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      title: '',
      description: '',
      status: 'draft',
      startDate: undefined,
      endDate: undefined,
      resultsPublic: false,
    });
  };

  const handleEdit = (election: Election) => {
    setEditingId(election.id);
    setFormData({
      title: election.title,
      description: election.description,
      status: election.status,
      startDate: election.startDate,
      endDate: election.endDate,
      resultsPublic: election.resultsPublic,
    });
  };

  const handleSave = async () => {
    if (!formData.title?.trim()) {
      toast.error('Election title is required');
      return;
    }

    setLoading(true);

    try {
      const electionData = {
        title: formData.title!,
        description: formData.description || '',
        status: formData.status || 'draft' as ElectionStatus,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        resultsPublic: formData.resultsPublic || false,
      };

      if (isAdding) {
        await FirestoreService.create(Collections.ELECTIONS, electionData);
        toast.success('Election created successfully');
      } else if (editingId) {
        await FirestoreService.update(Collections.ELECTIONS, editingId, electionData);
        toast.success('Election updated successfully');
      }

      fetchElections();
      handleCancel();
    } catch (error) {
      console.error('Election save error:', error);
      toast.error('Failed to save election. Please check your Firebase configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this election?')) return;

    try {
      await FirestoreService.delete(Collections.ELECTIONS, id);
      toast.success('Election deleted successfully');
      fetchElections();
    } catch (error) {
      console.error('Election delete error:', error);
      toast.error('Failed to delete election');
    }
  };

  const handleStatusChange = async (id: string, newStatus: ElectionStatus) => {
    try {
      await FirestoreService.update(Collections.ELECTIONS, id, { status: newStatus });
      toast.success(`Election ${newStatus === 'open' ? 'opened' : newStatus === 'closed' ? 'closed' : 'saved as draft'}`);
      fetchElections();
    } catch (error) {
      console.error('Status change error:', error);
      toast.error('Failed to update election status');
    }
  };

  const getStatusColor = (status: ElectionStatus) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (viewingResultsId) {
    const election = elections.find(e => e.id === viewingResultsId);
    if (election) {
      return (
        <ElectionResults 
          election={election} 
          onBack={() => setViewingResultsId(null)} 
        />
      );
    }
  }

  if (loading && elections.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Elections Management</h2>
          <p className="text-muted-foreground">Create and manage club elections</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          New Election
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{isAdding ? 'Create New Election' : 'Edit Election'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter election title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter election description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value: ElectionStatus) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Results Public</label>
                <Select
                  value={formData.resultsPublic ? 'true' : 'false'}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, resultsPublic: value === 'true' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Private</SelectItem>
                    <SelectItem value="true">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} disabled={loading} className="gap-2">
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Election'}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Elections List */}
      {elections.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No elections created yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {elections.map((election) => (
            <Card key={election.id} className="hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{election.title}</h3>
                      <Badge className={getStatusColor(election.status)}>
                        {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                      </Badge>
                      {election.resultsPublic && (
                        <Badge variant="outline" className="gap-1">
                          <Eye className="w-3 h-3" />
                          Public Results
                        </Badge>
                      )}
                    </div>
                    
                    {election.description && (
                      <p className="text-muted-foreground mb-3">{election.description}</p>
                    )}
                    
                    <div className="text-sm text-muted-foreground">
                      Created: {election.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {election.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(election.id, 'open')}
                        className="gap-1 bg-green-600 hover:bg-green-700"
                      >
                        <Play className="w-3 h-3" />
                        Open
                      </Button>
                    )}
                    
                    {election.status === 'open' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(election.id, 'closed')}
                        className="gap-1"
                      >
                        <Pause className="w-3 h-3" />
                        Close
                      </Button>
                    )}

                    {(election.status === 'open' || election.status === 'closed') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setViewingResultsId(election.id)}
                        className="gap-1 border-primary text-primary hover:bg-primary/10"
                      >
                        <BarChart3 className="w-3 h-3" />
                        Results
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(election)}
                      className="gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(election.id)}
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
    </div>
  );
}