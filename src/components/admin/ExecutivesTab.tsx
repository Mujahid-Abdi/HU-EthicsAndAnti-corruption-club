import { useState, useEffect } from 'react';
import { FirestoreService, Collections } from '@/lib/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X, Users, User, Mail, Phone, Upload, Image } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { user } = useAuth();
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
    fetchExecutives();
  }, []);

  const fetchExecutives = async () => {
    try {
      setLoading(true);
      const data = await FirestoreService.getAll('executives');
      const sortedExecutives = data.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));
      setMembers(sortedExecutives as ExecutiveMember[]);
    } catch (error) {
      console.error('Error fetching executives:', error);
      toast.error('Failed to fetch executives');
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setImagePreview(null);
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
    setImagePreview(member.image_url);
    setFormData(member);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      // Convert file to base64 for preview and storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, image_url: base64String }));
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
    toast.success('Image removed');
  };

  const handleSave = async () => {
    if (!formData.full_name || !formData.position) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const executiveData = {
        full_name: formData.full_name,
        position: formData.position,
        email: formData.email || null,
        phone: formData.phone || null,
        bio: formData.bio || null,
        image_url: formData.image_url || null,
        display_order: formData.display_order || members.length + 1,
        is_active: formData.is_active !== false,
        updatedBy: user?.uid,
        updatedAt: new Date(),
      };

      if (isAdding) {
        await FirestoreService.create('executives', {
          ...executiveData,
          createdBy: user?.uid,
        });
        toast.success('Executive member added successfully');
      } else if (editingId) {
        await FirestoreService.update('executives', editingId, executiveData);
        toast.success('Executive member updated successfully');
      }

      setIsAdding(false);
      setEditingId(null);
      setFormData({});
      setImagePreview(null);
      fetchExecutives();
    } catch (error) {
      console.error('Error saving executive:', error);
      toast.error('Failed to save executive member');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this executive member?')) return;

    try {
      await FirestoreService.delete('executives', id);
      toast.success('Executive member deleted successfully');
      fetchExecutives();
    } catch (error) {
      console.error('Error deleting executive:', error);
      toast.error('Failed to delete executive member');
    }
  };

  const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
    try {
      await FirestoreService.update('executives', id, {
        is_active: !currentStatus,
        updatedBy: user?.uid,
        updatedAt: new Date(),
      });
      toast.success(`Member ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchExecutives();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update member status');
    }
  };

  const moveUp = async (id: string) => {
    const member = members.find(m => m.id === id);
    if (!member || member.display_order <= 1) return;

    const otherMember = members.find(m => m.display_order === member.display_order - 1);
    if (!otherMember) return;

    try {
      await Promise.all([
        FirestoreService.update('executives', id, { 
          display_order: member.display_order - 1,
          updatedBy: user?.uid,
          updatedAt: new Date(),
        }),
        FirestoreService.update('executives', otherMember.id, { 
          display_order: otherMember.display_order + 1,
          updatedBy: user?.uid,
          updatedAt: new Date(),
        })
      ]);
      
      toast.success('Member moved up');
      fetchExecutives();
    } catch (error) {
      console.error('Error moving member:', error);
      toast.error('Failed to move member');
    }
  };

  const moveDown = async (id: string) => {
    const member = members.find(m => m.id === id);
    if (!member || member.display_order >= members.length) return;

    const otherMember = members.find(m => m.display_order === member.display_order + 1);
    if (!otherMember) return;

    try {
      await Promise.all([
        FirestoreService.update('executives', id, { 
          display_order: member.display_order + 1,
          updatedBy: user?.uid,
          updatedAt: new Date(),
        }),
        FirestoreService.update('executives', otherMember.id, { 
          display_order: otherMember.display_order - 1,
          updatedBy: user?.uid,
          updatedAt: new Date(),
        })
      ]);
      
      toast.success('Member moved down');
      fetchExecutives();
    } catch (error) {
      console.error('Error moving member:', error);
      toast.error('Failed to move member');
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setImagePreview(null);
    setFormData({});
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
                  placeholder="Enter photo URL or upload file below"
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

            {/* File Upload Section */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Upload Photo</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                {imagePreview ? (
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Image uploaded successfully
                      </p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('image-upload')?.click()}
                          disabled={uploadingImage}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Change Image
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeImage}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <div className="mb-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        disabled={uploadingImage}
                        className="gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        {uploadingImage ? 'Uploading...' : 'Upload Image'}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
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