import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X, Users, User, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

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
  const [members, setMembers] = useState<ExecutiveMember[]>([
    {
      id: '1',
      full_name: 'Sarah Johnson',
      position: 'President',
      email: 'sarah.johnson@haramaya.edu.et',
      phone: '+251-911-123456',
      bio: 'Dedicated to promoting ethics and transparency in our university community.',
      image_url: null,
      display_order: 1,
      is_active: true,
    },
    {
      id: '2',
      full_name: 'Michael Chen',
      position: 'Vice President',
      email: 'michael.chen@haramaya.edu.et',
      phone: '+251-911-234567',
      bio: 'Passionate about student rights and anti-corruption initiatives.',
      image_url: null,
      display_order: 2,
      is_active: true,
    },
    {
      id: '3',
      full_name: 'Aisha Mohammed',
      position: 'Secretary',
      email: 'aisha.mohammed@haramaya.edu.et',
      phone: '+251-911-345678',
      bio: 'Committed to maintaining accurate records and transparent communication.',
      image_url: null,
      display_order: 3,
      is_active: true,
    }
  ]);

  const [loading, setLoading] = useState(false);
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

  const handleAdd = () => {
    setIsAdding(true);
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

  const handleEdit = (member: ExecutiveMember) => {
    setEditingId(member.id);
    setFormData(member);
  };

  const handleSave = () => {
    if (!formData.full_name || !formData.position) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isAdding) {
      const newMember: ExecutiveMember = {
        id: Date.now().toString(),
        full_name: formData.full_name!,
        position: formData.position!,
        email: formData.email || null,
        phone: formData.phone || null,
        bio: formData.bio || null,
        image_url: formData.image_url || null,
        display_order: formData.display_order || members.length + 1,
        is_active: formData.is_active !== false,
      };
      setMembers([...members, newMember].sort((a, b) => a.display_order - b.display_order));
      toast.success('Executive member added successfully');
    } else if (editingId) {
      setMembers(members.map(member => 
        member.id === editingId 
          ? { ...member, ...formData } as ExecutiveMember
          : member
      ).sort((a, b) => a.display_order - b.display_order));
      toast.success('Executive member updated successfully');
    }

    setIsAdding(false);
    setEditingId(null);
    setFormData({});
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
    toast.success('Executive member deleted successfully');
  };

  const toggleActiveStatus = (id: string, currentStatus: boolean) => {
    setMembers(members.map(member => 
      member.id === id 
        ? { ...member, is_active: !currentStatus }
        : member
    ));
    toast.success(`Member ${!currentStatus ? 'activated' : 'deactivated'}`);
  };

  const moveUp = (id: string) => {
    const member = members.find(m => m.id === id);
    if (!member || member.display_order <= 1) return;

    setMembers(members.map(m => {
      if (m.id === id) return { ...m, display_order: m.display_order - 1 };
      if (m.display_order === member.display_order - 1) return { ...m, display_order: m.display_order + 1 };
      return m;
    }).sort((a, b) => a.display_order - b.display_order));
    
    toast.success('Member moved up');
  };

  const moveDown = (id: string) => {
    const member = members.find(m => m.id === id);
    if (!member || member.display_order >= members.length) return;

    setMembers(members.map(m => {
      if (m.id === id) return { ...m, display_order: m.display_order + 1 };
      if (m.display_order === member.display_order + 1) return { ...m, display_order: m.display_order - 1 };
      return m;
    }).sort((a, b) => a.display_order - b.display_order));
    
    toast.success('Member moved down');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Executive Members</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage club executive members and their information
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {isAdding ? 'Add New Executive Member' : 'Edit Executive Member'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  value={formData.full_name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Position *</label>
                <Input
                  value={formData.position || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="Enter position (e.g., President, Secretary)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={formData.phone || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Photo URL</label>
                <Input
                  value={formData.image_url || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="Enter photo URL"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Display Order</label>
                <Input
                  type="number"
                  value={formData.display_order || 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  placeholder="Enter display order"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                value={formData.bio || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Enter member bio"
                rows={4}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active !== false}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="is_active" className="text-sm font-medium">
                Active member
              </label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Save Member
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
        {members.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {member.image_url ? (
                      <img 
                        src={member.image_url} 
                        alt={member.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {member.full_name}
                      </h3>
                      <Badge variant="outline">
                        {member.position}
                      </Badge>
                      {!member.is_active && (
                        <Badge variant="secondary">
                          Inactive
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        #{member.display_order}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {member.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{member.email}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    {member.bio && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveUp(member.id)}
                    disabled={member.display_order <= 1}
                    className="gap-1"
                  >
                    ↑
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveDown(member.id)}
                    disabled={member.display_order >= members.length}
                    className="gap-1"
                  >
                    ↓
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActiveStatus(member.id, member.is_active)}
                    className="gap-1"
                  >
                    {member.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(member)}
                    className="gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(member.id)}
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

      {members.length === 0 && !isAdding && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Executive Members Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add your first executive member to get started
            </p>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="w-4 h-4" />
              Add First Member
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}