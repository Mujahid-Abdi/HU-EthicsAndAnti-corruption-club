import { useState, useEffect } from 'react';
import { FirestoreService, Collections } from '@/lib/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, BookOpen, Lock, Globe, Upload, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Resource {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string | null;
  category: string | null;
  isMemberOnly: boolean | null;
  createdAt: any;
  // Legacy support
  file_url?: string;
  is_member_only?: boolean;
  created_at?: any;
}

const categories = [
  'Policy Documents',
  'Training Materials',
  'Research Papers',
  'Guidelines',
  'Templates',
  'Other',
];

export default function ResourcesTab() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [fileInputType, setFileInputType] = useState<'url' | 'file'>('url');
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileUrl: '',
    category: '',
    isMemberOnly: false,
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const data = await FirestoreService.getAll(Collections.RESOURCES);
      const mappedData = data.map((item: any) => ({
        ...item,
        fileUrl: item.fileUrl || item.file_url || null,
        isMemberOnly: item.isMemberOnly || item.is_member_only || false,
        createdAt: item.createdAt || item.created_at || null,
      }));
      setResources(mappedData as Resource[]);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to fetch resources');
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      fileUrl: '',
      category: '',
      isMemberOnly: false,
    });
    setEditingResource(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description || '',
      fileUrl: resource.fileUrl || '',
      category: resource.category || '',
      isMemberOnly: resource.isMemberOnly || false,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast.error('Title is required');
      return;
    }

    setIsSaving(true);
    const resourceData = {
      title: formData.title,
      description: formData.description || null,
      fileUrl: formData.fileUrl || null,
      category: formData.category || null,
      isMemberOnly: formData.isMemberOnly,
      createdBy: user?.uid,
    };

    try {
      if (editingResource) {
        await FirestoreService.update(Collections.RESOURCES, editingResource.id, {
          ...resourceData,
          updated_at: new Date(),
        });
        toast.success('Resource updated successfully');
      } else {
        await FirestoreService.create(Collections.RESOURCES, resourceData);
        toast.success('Resource created successfully');
      }
      setIsDialogOpen(false);
      fetchResources();
    } catch (error) {
      console.error('Error saving resource:', error);
      toast.error('Failed to save resource');
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      await FirestoreService.delete(Collections.RESOURCES, id);
      toast.success('Resource deleted successfully');
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Failed to delete resource');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Resources Management</h2>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingResource ? 'Edit Resource' : 'Create Resource'}</DialogTitle>
            <DialogDescription>
              {editingResource ? 'Update the resource details below.' : 'Add a new resource document or link.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="file">File</Label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={fileInputType === 'url' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFileInputType('url')}
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    URL
                  </Button>
                  <Button
                    type="button"
                    variant={fileInputType === 'file' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFileInputType('file')}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                </div>
                
                {fileInputType === 'url' ? (
                  <Input
                    id="fileUrl"
                    placeholder="https://example.com/document.pdf"
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  />
                ) : (
                  <Input
                    id="file_upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // For now, we'll use the file name as a placeholder
                        // In production, you'd upload to Firebase Storage
                        setFormData({ ...formData, fileUrl: `uploaded_${file.name}` });
                      }
                    }}
                  />
                )}
                
                {formData.fileUrl && (
                  <div className="mt-2 p-2 bg-muted rounded text-sm">
                    File: {formData.fileUrl}
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isMemberOnly">Members Only</Label>
                <p className="text-xs text-muted-foreground">
                  Restrict access to approved members
                </p>
              </div>
              <Switch
                id="isMemberOnly"
                checked={formData.isMemberOnly}
                onCheckedChange={(checked) => setFormData({ ...formData, isMemberOnly: checked })}
              />
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Resource'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {resources.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No resources yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {resources.map((resource) => (
            <Card key={resource.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    {resource.category && (
                      <Badge variant="outline" className="mt-1">
                        {resource.category}
                      </Badge>
                    )}
                  </div>
                  <Badge variant={resource.isMemberOnly ? 'secondary' : 'default'}>
                    {resource.isMemberOnly ? (
                      <span className="flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Members
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        Public
                      </span>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {resource.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {resource.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(resource)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(resource.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
