import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Save, X, Users } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ExecutiveMember {
  id: string;
  full_name: string;
  position: string;
  email: string | null;
  phone: string | null;
  bio: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

export default function ExecutivesTab() {
  const [members, setMembers] = useState<ExecutiveMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<ExecutiveMember>>({
    full_name: '',
    position: '',
    email: '',
    phone: '',
    bio: '',
    image_url: '',
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('executive_members')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load executive members',
        variant: 'destructive',
      });
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (member: ExecutiveMember) => {
    setEditingId(member.id);
    setFormData(member);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      full_name: '',
      position: '',
      email: '',
      phone: '',
      bio: '',
      image_url: '',
      display_order: members.length + 1,
      is_active: true,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({});
  };

  const handleSave = async () => {
    if (!formData.full_name || !formData.position) {
      toast({
        title: 'Error',
        description: 'Name and position are required',
        variant: 'destructive',
      });
      return;
    }

    if (isAdding) {
      const { error } = await supabase
        .from('executive_members')
        .insert([formData]);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to add member',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Executive member added successfully',
        });
        fetchMembers();
        handleCancel();
      }
    } else if (editingId) {
      const { error } = await supabase
        .from('executive_members')
        .update(formData)
        .eq('id', editingId);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update member',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Executive member updated successfully',
        });
        fetchMembers();
        handleCancel();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this executive member?')) {
      return;
    }

    const { error } = await supabase
      .from('executive_members')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete member',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Executive member deleted successfully',
      });
      fetchMembers();
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Executive Members</h2>
          <p className="text-muted-foreground">Manage club executive committee</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{isAdding ? 'Add New Member' : 'Edit Member'}</CardTitle>
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
                <Input
                  value={formData.position || ''}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="e.g., President, Secretary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+251 xxx xxx xxx"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Display Order</label>
                <Input
                  type="number"
                  value={formData.display_order || 0}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <Input
                  value={formData.image_url || ''}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <Textarea
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief biography..."
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active || false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="is_active" className="text-sm font-medium">Active (visible on website)</label>
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <Card key={member.id} className={!member.is_active ? 'opacity-50' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground">{member.full_name}</h3>
                    <p className="text-sm text-primary">{member.position}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">#{member.display_order}</span>
              </div>
              {member.bio && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{member.bio}</p>
              )}
              {(member.email || member.phone) && (
                <div className="text-xs text-muted-foreground space-y-1 mb-3">
                  {member.email && <div>📧 {member.email}</div>}
                  {member.phone && <div>📱 {member.phone}</div>}
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(member)}
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(member.id)}
                  variant="destructive"
                  size="sm"
                  className="gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
