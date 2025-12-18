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
import { toast } from 'sonner';

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

export default function ElectionsTab() {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('elections')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load elections: ' + error.message);
    } else {
      setElections(data || []);
    }
    setLoading(false);
  };
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Election>>({
    title: '',
    description: '',
    status: 'draft',
    start_date: '',
    end_date: '',
    results_public: false,
  });

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      title: '',
      description: '',
      status: 'draft',
      start_date: '',
      end_date: '',
      results_public: false,
    });
  };

  const handleEdit = (election: Election) => {
    setEditingId(election.id);
    setFormData(election);
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast.error('Please enter an election title');
      return;
    }

    setLoading(true);

    if (isAdding) {
      const { data, error } = await supabase
        .from('elections')
        .insert([{
          title: formData.title!,
          description: formData.description || null,
          status: formData.status || 'draft',
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          results_public: formData.results_public || false,
        }])
        .select()
        .single();

      if (error) {
        toast.error('Failed to create election: ' + error.message);
      } else {
        toast.success('Election created successfully');
        fetchElections(); // Refresh the list
      }
    } else if (editingId) {
      const { error } = await supabase
        .from('elections')
        .update({
          title: formData.title!,
          description: formData.description || null,
          status: formData.status || 'draft',
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          results_public: formData.results_public || false,
        })
        .eq('id', editingId);

      if (error) {
        toast.error('Failed to update election: ' + error.message);
      } else {
        toast.success('Election updated successfully');
        fetchElections(); // Refresh the list
      }
    }

    setLoading(false);
    setIsAdding(false);
    setEditingId(null);
    setFormData({});
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this election? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('elections')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete election: ' + error.message);
    } else {
      toast.success('Election deleted successfully');
      fetchElections(); // Refresh the list
    }
    setLoading(false);
  };

  const toggleElectionStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'draft' ? 'open' : 
                     currentStatus === 'open' ? 'closed' : 'draft';
    
    setLoading(true);
    const { error } = await supabase
      .from('elections')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update election status: ' + error.message);
    } else {
      toast.success(`Election status changed to ${newStatus}`);
      fetchElections(); // Refresh the list
    }
    setLoading(false);
  };

  const toggleResultsVisibility = async (id: string, currentVisibility: boolean) => {
    setLoading(true);
    const { error } = await supabase
      .from('elections')
      .update({ results_public: !currentVisibility })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update results visibility: ' + error.message);
    } else {
      toast.success(`Results ${!currentVisibility ? 'published' : 'hidden'}`);
      fetchElections(); // Refresh the list
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Elections Management</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage elections for your organization
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          New Election
        </Button>
      </div>

      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Vote className="w-5 h-5" />
              {isAdding ? 'Create New Election' : 'Edit Election'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Election Title</label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter election title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={formData.status || 'draft'}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'open' | 'closed' }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="draft">Draft</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter election description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={formData.end_date || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="results_public"
                checked={formData.results_public || false}
                onChange={(e) => setFormData(prev => ({ ...prev, results_public: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="results_public" className="text-sm font-medium">
                Make results public
              </label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Save Election
              </Button>
              <Button variant="outline" onClick={handleCancel} className="gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {elections.map((election) => (
          <Card key={election.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {election.title}
                    </h3>
                    <Badge className={getStatusColor(election.status)}>
                      {election.status}
                    </Badge>
                    {election.results_public && (
                      <Badge variant="outline" className="gap-1">
                        <Eye className="w-3 h-3" />
                        Public Results
                      </Badge>
                    )}
                  </div>
                  
                  {election.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {election.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    {election.start_date && (
                      <span>Start: {new Date(election.start_date).toLocaleDateString()}</span>
                    )}
                    {election.end_date && (
                      <span>End: {new Date(election.end_date).toLocaleDateString()}</span>
                    )}
                    <span>Created: {new Date(election.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleElectionStatus(election.id, election.status)}
                    className="gap-1"
                  >
                    {election.status === 'open' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    {election.status === 'draft' ? 'Start' : election.status === 'open' ? 'Close' : 'Reopen'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleResultsVisibility(election.id, election.results_public)}
                    className="gap-1"
                  >
                    {election.results_public ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {election.results_public ? 'Hide' : 'Show'} Results
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(election)}
                    className="gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
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

      {elections.length === 0 && !isAdding && (
        <Card>
          <CardContent className="p-12 text-center">
            <Vote className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Elections Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get started by creating your first election
            </p>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Election
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}