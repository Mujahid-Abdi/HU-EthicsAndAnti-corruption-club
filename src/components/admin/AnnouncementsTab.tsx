import { useState, useEffect } from 'react';
import { FirestoreService, Collections } from '@/lib/firestore';
import { TelegramService } from '@/lib/telegram';
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
import { Plus, Pencil, Trash2, Loader2, Megaphone, Upload, Link as LinkIcon, Send } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { Announcement } from '@/types';

type PriorityType = 'low' | 'medium' | 'high' | 'urgent';

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' },
];

export default function AnnouncementsTab() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { settings: systemSettings } = useSystemSettings();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium' as PriorityType,
    published: false,
    expiresAt: '',
    postToTelegram: false,
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const data = await FirestoreService.getAll(Collections.NEWS, [
        // We'll use the NEWS collection but filter by type or use a separate collection
      ]);
      // For now, we'll create a separate collection for announcements
      const announcementData = await FirestoreService.getAll('announcements');
      setAnnouncements(announcementData as Announcement[]);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to fetch announcements');
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      priority: 'medium',
      published: false,
      expiresAt: '',
      postToTelegram: false,
    });
    setEditingAnnouncement(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      published: announcement.published || false,
      expiresAt: announcement.expiresAt ? 
        new Date(announcement.expiresAt.seconds * 1000).toISOString().split('T')[0] : '',
      postToTelegram: false,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    setIsSaving(true);
    const announcementData = {
      title: formData.title,
      content: formData.content,
      priority: formData.priority,
      published: formData.published,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : null,
      created_by: user?.uid,
    };

    try {
      let currentTelegramIds = editingAnnouncement?.telegramMessageIds || {};

      // Post/Update to Telegram if enabled
      if (formData.published && formData.postToTelegram && systemSettings.telegramEnabled) {
        const telegramContent = {
          title: formData.title,
          text: formData.content,
          type: 'Announcement' as const,
          link: `${window.location.origin}/news`
        };

        if (Object.keys(currentTelegramIds).length > 0) {
          // Update existing
          currentTelegramIds = await TelegramService.updatePost(systemSettings, currentTelegramIds, telegramContent);
        } else {
          // Send new
          currentTelegramIds = await TelegramService.sendPost(systemSettings, telegramContent);
        }
      } else if (!formData.published && Object.keys(currentTelegramIds).length > 0) {
        // If unpublished, delete from telegram
        await TelegramService.deletePost(systemSettings, currentTelegramIds);
        currentTelegramIds = {};
      }

      const finalAnnouncementData = {
        ...announcementData,
        telegramMessageIds: currentTelegramIds
      };

      if (editingAnnouncement) {
        await FirestoreService.update('announcements', editingAnnouncement.id, finalAnnouncementData);
        const telegramAdded = formData.postToTelegram && Object.keys(currentTelegramIds).length > 0;
        const telegramFailed = formData.postToTelegram && Object.keys(currentTelegramIds).length === 0;

        if (telegramFailed) {
          toast.warning('Announcement updated, but Telegram posting failed. Please check your bot token and channel IDs.');
        } else {
          toast.success('Announcement updated successfully' + (telegramAdded ? ' and synced with Telegram' : ''));
        }
      } else {
        await FirestoreService.create('announcements', finalAnnouncementData);
        const telegramAdded = formData.postToTelegram && Object.keys(currentTelegramIds).length > 0;
        const telegramFailed = formData.postToTelegram && Object.keys(currentTelegramIds).length === 0;

        if (telegramFailed) {
          toast.warning('Announcement created, but Telegram posting failed. Please check your bot token and channel IDs.');
        } else {
          toast.success('Announcement created successfully' + (telegramAdded ? ' and posted to Telegram' : ''));
        }
      }

      setIsDialogOpen(false);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast.error('Failed to save announcement');
    }
    setIsSaving(false);
  };

  const handleDelete = async (announcement: Announcement) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      // Delete from Telegram if exists
      if (announcement.telegramMessageIds && Object.keys(announcement.telegramMessageIds).length > 0 && systemSettings.telegramEnabled) {
        await TelegramService.deletePost(systemSettings, announcement.telegramMessageIds);
      }

      await FirestoreService.delete('announcements', announcement.id);
      toast.success('Announcement and corresponding Telegram posts deleted successfully');
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
    }
  };

  const getPriorityBadge = (priority: string) => {
    const option = priorityOptions.find(p => p.value === priority);
    return option || priorityOptions[1]; // Default to medium
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
        <h2 className="text-xl font-semibold">Announcements Management</h2>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Announcement
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}</DialogTitle>
            <DialogDescription>
              {editingAnnouncement ? 'Update the announcement details below.' : 'Create a new announcement for the community.'}
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
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
              <Input
                id="expiresAt"
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="published">Published</Label>
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
            </div>
            {formData.published && (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-dashed border-primary/20">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-primary" />
                  <div>
                    <Label htmlFor="postToTelegram" className="text-sm font-medium">Post to Telegram</Label>
                    <p className="text-[10px] text-muted-foreground">Sync this announcement with Telegram</p>
                  </div>
                </div>
                <Switch
                  id="postToTelegram"
                  checked={formData.postToTelegram}
                  onCheckedChange={(checked) => setFormData({ ...formData, postToTelegram: checked })}
                />
              </div>
            )}
            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Announcement'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {announcements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No announcements yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    {announcement.createdAt && (
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(announcement.createdAt.seconds * 1000), 'PPP')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge 
                      variant="outline" 
                      className={getPriorityBadge(announcement.priority).color}
                    >
                      {getPriorityBadge(announcement.priority).label}
                    </Badge>
                    <Badge variant={announcement.published ? 'default' : 'secondary'}>
                      {announcement.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {announcement.content}
                </p>
                {announcement.expiresAt && (
                  <p className="text-xs text-orange-600 mb-4">
                    Expires: {format(new Date(announcement.expiresAt.seconds * 1000), 'PPP')}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(announcement)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(announcement)}>
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