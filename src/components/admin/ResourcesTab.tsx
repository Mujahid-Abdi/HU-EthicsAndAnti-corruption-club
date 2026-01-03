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
import { Plus, Pencil, Trash2, Loader2, BookOpen, Lock, Globe, Upload, Link as LinkIcon, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { TelegramService } from '@/lib/telegram';

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
  // Additional fields for different resource types
  type?: string; // 'document' | 'link' | 'glossary'
  size?: string; // For documents
  url?: string; // For external links
  term?: string; // For glossary items
  definition?: string; // For glossary items
  telegramMessageIds?: Record<string, string>;
}

const categories = [
  'Policy Documents',
  'Training Materials',
  'Research Papers',
  'Guidelines',
  'Templates',
  'University Policies',
  'Club Documents',
  'External Links',
  'Glossary',
  'Other',
];

// Default data removed, now stored in Firestore

export default function ResourcesTab() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [fileInputType, setFileInputType] = useState<'url' | 'file'>('url');
  const { settings: systemSettings } = useSystemSettings();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileUrl: '',
    category: '',
    isMemberOnly: false,
    type: 'document' as 'document' | 'link' | 'glossary',
    size: '',
    term: '',
    definition: '',
    postToTelegram: false,
  });
  const [isSeeding, setIsSeeding] = useState(false);

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

  const seedDefaultResources = async () => {
    setIsSeeding(true);
    let successCount = 0;
    
    for (const resource of defaultResourcesData) {
      try {
        await FirestoreService.create(Collections.RESOURCES, {
          ...resource,
          createdBy: user?.uid,
        });
        successCount++;
      } catch (error) {
        console.error('Error seeding resource:', error);
      }
    }
    
    if (successCount > 0) {
      toast.success(`Added ${successCount} default resources`);
      fetchResources();
    } else {
      toast.error('Failed to add default resources');
    }
    setIsSeeding(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      fileUrl: '',
      category: '',
      isMemberOnly: false,
      type: 'document',
      size: '',
      term: '',
      definition: '',
      postToTelegram: false,
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
      type: (resource.type as any) || 'document',
      size: (resource as any).size || '',
      term: (resource as any).term || '',
      definition: (resource as any).definition || '',
      postToTelegram: !!(resource.telegramMessageIds && Object.keys(resource.telegramMessageIds).length > 0),
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast.error('Title is required');
      return;
    }

    if (formData.type === 'glossary' && (!formData.term || !formData.definition)) {
      toast.error('Term and definition are required for glossary items');
      return;
    }

    setIsSaving(true);
    const resourceData = {
      title: formData.title,
      description: formData.description || null,
      fileUrl: formData.fileUrl || null,
      category: formData.category || null,
      isMemberOnly: formData.isMemberOnly,
      type: formData.type,
      ...(formData.size && { size: formData.size }),
      ...(formData.term && { term: formData.term }),
      ...(formData.definition && { definition: formData.definition }),
      createdBy: user?.uid,
    };

    try {
      let currentTelegramIds = editingResource?.telegramMessageIds || {};

      // Post/Update to Telegram
      if (formData.postToTelegram && systemSettings.telegramEnabled) {
        const telegramContent = {
          title: formData.title,
          text: formData.description || (formData.type === 'glossary' ? formData.definition : ''),
          imageUrl: formData.type !== 'glossary' ? formData.fileUrl : undefined,
          type: 'Resource' as const,
          link: formData.fileUrl || `${window.location.origin}/news` 
        };

        if (Object.keys(currentTelegramIds).length > 0) {
          currentTelegramIds = await TelegramService.updatePost(systemSettings, currentTelegramIds, telegramContent);
        } else {
          currentTelegramIds = await TelegramService.sendPost(systemSettings, telegramContent);
        }
      } else if (!formData.postToTelegram && Object.keys(currentTelegramIds).length > 0) {
        await TelegramService.deletePost(systemSettings, currentTelegramIds);
        currentTelegramIds = {};
      }

      const finalResourceData = {
        ...resourceData,
        telegramMessageIds: currentTelegramIds
      };

      if (editingResource) {
        await FirestoreService.update(Collections.RESOURCES, editingResource.id, finalResourceData);
        const telegramAdded = formData.postToTelegram && Object.keys(currentTelegramIds).length > 0;
        const telegramFailed = formData.postToTelegram && Object.keys(currentTelegramIds).length === 0;

        if (telegramFailed) {
          toast.warning('Resource updated, but Telegram posting failed. Please check your bot token and channel IDs.');
        } else {
          toast.success('Resource updated successfully' + (telegramAdded ? ' and synced with Telegram' : ''));
        }
      } else {
        await FirestoreService.create(Collections.RESOURCES, finalResourceData);
        const telegramAdded = formData.postToTelegram && Object.keys(currentTelegramIds).length > 0;
        const telegramFailed = formData.postToTelegram && Object.keys(currentTelegramIds).length === 0;

        if (telegramFailed) {
          toast.warning('Resource created, but Telegram posting failed. Please check your bot token and channel IDs.');
        } else {
          toast.success('Resource created successfully' + (telegramAdded ? ' and posted to Telegram' : ''));
        }
      }
      setIsDialogOpen(false);
      fetchResources();
    } catch (error) {
      console.error('Error saving resource:', error);
      toast.error('Failed to save resource');
    }
    setIsSaving(false);
  };

  const handleDelete = async (resource: Resource) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      // Delete from Telegram if exists
      if (resource.telegramMessageIds && Object.keys(resource.telegramMessageIds).length > 0 && systemSettings.telegramEnabled) {
        await TelegramService.deletePost(systemSettings, resource.telegramMessageIds);
      }

      await FirestoreService.delete(Collections.RESOURCES, resource.id);
      toast.success('Resource and corresponding Telegram posts deleted successfully');
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
        <div className="flex gap-2">
          {resources.length === 0 && (
            <Button variant="outline" onClick={seedDefaultResources} disabled={isSeeding}>
              {isSeeding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Add Default Resources
                </>
              )}
            </Button>
          )}
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>
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
              <Label htmlFor="type">Resource Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">Document (PDF/Word)</SelectItem>
                  <SelectItem value="link">External Link / Website</SelectItem>
                  <SelectItem value="glossary">Glossary Term</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type === 'glossary' ? (
              <>
                <div>
                  <Label htmlFor="term">Term *</Label>
                  <Input
                    id="term"
                    value={formData.term}
                    onChange={(e) => setFormData({ ...formData, term: e.target.value, title: e.target.value })}
                    placeholder="e.g. Integrity"
                  />
                </div>
                <div>
                  <Label htmlFor="definition">Definition *</Label>
                  <Textarea
                    id="definition"
                    value={formData.definition}
                    onChange={(e) => setFormData({ ...formData, definition: e.target.value, description: e.target.value })}
                    rows={4}
                    placeholder="Provide a clear definition of the term..."
                  />
                </div>
              </>
            ) : (
              <>
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
              </>
            )}

            {formData.type === 'document' && (
              <div>
                <Label htmlFor="size">File Size (optional)</Label>
                <Input
                  id="size"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="e.g. 1.2 MB"
                />
              </div>
            )}

            {formData.type !== 'glossary' && (
              <div>
                <Label htmlFor="file">{formData.type === 'link' ? 'External Link URL' : 'File'}</Label>
                <div className="space-y-3">
                  {formData.type === 'document' && (
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
                  )}
                  
                  {(fileInputType === 'url' || formData.type === 'link') ? (
                    <Input
                      id="fileUrl"
                      placeholder={formData.type === 'link' ? "https://www.example.org" : "https://example.com/document.pdf"}
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
                          setFormData({ ...formData, fileUrl: `uploaded_${file.name}` });
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            )}
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
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-dashed border-primary/20">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-primary" />
                <div>
                  <Label htmlFor="postToTelegram" className="text-sm font-medium">Post to Telegram</Label>
                  <p className="text-[10px] text-muted-foreground">Broadcast to linked Telegram channels</p>
                </div>
              </div>
              <Switch
                id="postToTelegram"
                checked={formData.postToTelegram}
                onCheckedChange={(checked) => setFormData({ ...formData, postToTelegram: checked })}
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
                  <div className="flex items-center gap-2">
                    {resource.type === 'document' && <BookOpen className="h-5 w-5 text-blue-500" />}
                    {resource.type === 'link' && <LinkIcon className="h-5 w-5 text-green-500" />}
                    {resource.type === 'glossary' && <Globe className="h-5 w-5 text-orange-500" />}
                    <div>
                      <CardTitle className="text-lg">
                        {resource.type === 'glossary' ? resource.term : resource.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {resource.category && (
                          <Badge variant="outline">
                            {resource.category}
                          </Badge>
                        )}
                        {resource.type && (
                          <Badge variant="secondary" className="capitalize">
                            {resource.type}
                          </Badge>
                        )}
                        {resource.type === 'document' && resource.size && (
                          <Badge variant="outline" className="text-xs font-normal">
                            {resource.size}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge variant={resource.isMemberOnly ? 'secondary' : 'default'}>
                    {resource.isMemberOnly ? (
                      <span className="flex items-center gap-1 text-[10px]">
                        <Lock className="h-2.5 w-2.5" />
                        Members
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px]">
                        <Globe className="h-2.5 w-2.5" />
                        Public
                      </span>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {resource.type === 'glossary' ? (
                  <div className="bg-orange-50/50 dark:bg-orange-900/10 p-3 rounded-lg border border-orange-100 dark:border-orange-800 mb-4">
                    <p className="text-sm italic text-foreground">
                      {resource.definition || resource.description}
                    </p>
                  </div>
                ) : (
                  resource.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {resource.description}
                    </p>
                  )
                )}
                
                {resource.type === 'link' && resource.fileUrl && (
                  <div className="mb-4 text-xs text-blue-600 truncate underline">
                    {resource.fileUrl}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-8" onClick={() => openEditDialog(resource)}>
                    <Pencil className="h-3.5 w-3.5 mr-2" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10" onClick={() => handleDelete(resource)}>
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
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
