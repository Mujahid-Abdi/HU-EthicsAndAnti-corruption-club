import { useState, useEffect } from 'react';
import { FirestoreService, Collections } from '@/lib/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, Calendar, Upload, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { TelegramService } from '@/lib/telegram';

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: any;
  endDate: any;
  location: string | null;
  imageUrl: string | null;
  maxAttendees: number | null;
  published: boolean | null;
  createdAt: any;
  updatedAt: any;
  telegramMessageId?: string;
  telegramMessageIds?: Record<string, string>;
  // Legacy support for older field names if needed
  event_date?: any;
  end_date?: any;
}

export default function EventsTab() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imageInputType, setImageInputType] = useState<'url' | 'file'>('url');
  const { settings: systemSettings } = useSystemSettings();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    end_date: '',
    location: '',
    image_url: '',
    max_attendees: '',
    published: false,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await FirestoreService.getAll(Collections.EVENTS);
      setEvents(data as Event[]);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_date: '',
      end_date: '',
      location: '',
      image_url: '',
      max_attendees: '',
      published: false,
    });
    setEditingEvent(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      event_date: event.event_date ? format(new Date(event.event_date.seconds * 1000), "yyyy-MM-dd'T'HH:mm") : '',
      end_date: event.end_date ? format(new Date(event.end_date.seconds * 1000), "yyyy-MM-dd'T'HH:mm") : '',
      location: event.location || '',
      image_url: event.imageUrl || '',
      max_attendees: event.maxAttendees?.toString() || '',
      published: event.published || false,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.event_date) {
      toast.error('Title and event date are required');
      return;
    }

    setIsSaving(true);
    const eventData = {
      title: formData.title,
      description: formData.description || null,
      date: new Date(formData.event_date),
      endDate: formData.end_date ? new Date(formData.end_date) : null,
      location: formData.location || null,
      imageUrl: formData.image_url || null,
      maxAttendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
      published: formData.published,
      created_by: user?.uid,
    };

    try {
      let docId = editingEvent?.id;
      if (editingEvent) {
        await FirestoreService.update(Collections.EVENTS, editingEvent.id, eventData);
        
        // Handle Telegram Update
        if (formData.published && systemSettings.telegramEnabled) {
          const content = {
            title: formData.title,
            text: formData.description || '',
            imageUrl: formData.image_url,
            type: 'Event' as const,
            link: `${window.location.origin}/events`,
          };

          const currentIds: Record<string, string> = editingEvent.telegramMessageIds || (editingEvent.telegramMessageId ? { [systemSettings.telegramChannelId || '']: editingEvent.telegramMessageId } : {});
          const updatedIds = await TelegramService.updatePost(systemSettings, currentIds, content);
          
          if (Object.keys(updatedIds).length > 0) {
            await FirestoreService.update(Collections.EVENTS, editingEvent.id, { 
              telegramMessageIds: updatedIds,
              telegramMessageId: Object.values(updatedIds)[0]
            });
          }
        } else if (!formData.published && (editingEvent.telegramMessageIds || editingEvent.telegramMessageId) && systemSettings.telegramEnabled) {
          const currentIds: Record<string, string> = editingEvent.telegramMessageIds || (editingEvent.telegramMessageId ? { [systemSettings.telegramChannelId || '']: editingEvent.telegramMessageId } : {});
          await TelegramService.deletePost(systemSettings, currentIds);
          await FirestoreService.update(Collections.EVENTS, editingEvent.id, { 
            telegramMessageIds: null,
            telegramMessageId: null 
          });
        }
        
        toast.success('Event updated successfully');
      } else {
        const docRef = await FirestoreService.create(Collections.EVENTS, eventData);
        docId = (docRef as any).id;
        
        // Handle Telegram Create
        if (formData.published && systemSettings.telegramEnabled) {
          const results = await TelegramService.sendPost(systemSettings, {
            title: formData.title,
            text: formData.description || '',
            imageUrl: formData.image_url,
            type: 'Event',
            link: `${window.location.origin}/events`,
          });
          
          if (Object.keys(results).length > 0) {
            await FirestoreService.update(Collections.EVENTS, docId, { 
              telegramMessageIds: results,
              telegramMessageId: Object.values(results)[0]
            });
          }
        }
        
        toast.success('Event created successfully');
      }
      setIsDialogOpen(false);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    }
    setIsSaving(false);
  };

  const handleDelete = async (event: Event) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      // Delete from Telegram if exists
      const currentIds = event.telegramMessageIds || (event.telegramMessageId ? { [systemSettings.telegramChannelId || '']: event.telegramMessageId } : {});
      if (Object.keys(currentIds).length > 0 && systemSettings.telegramEnabled) {
        await TelegramService.deletePost(systemSettings, currentIds);
      }
      
      await FirestoreService.delete(Collections.EVENTS, event.id);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
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
        <h2 className="text-xl font-semibold">Events Management</h2>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Create Event'}</DialogTitle>
            <DialogDescription>
              {editingEvent ? 'Update the event details below.' : 'Fill in the details to create a new event.'}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event_date">Start Date *</Label>
                <Input
                  id="event_date"
                  type="datetime-local"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="image">Image</Label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={imageInputType === 'url' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setImageInputType('url')}
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    URL
                  </Button>
                  <Button
                    type="button"
                    variant={imageInputType === 'file' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setImageInputType('file')}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                </div>
                
                {imageInputType === 'url' ? (
                  <Input
                    id="image_url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                ) : (
                  <Input
                    id="image_file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // For now, we'll convert to a data URL for preview
                        // In production, you'd upload to Firebase Storage
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setFormData({ ...formData, image_url: e.target?.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                )}
                
                {formData.image_url && (
                  <div className="mt-2">
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Invalid+Image';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="max_attendees">Max Attendees</Label>
              <Input
                id="max_attendees"
                type="number"
                value={formData.max_attendees}
                onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
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
            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Event'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No events yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {event.date && format(new Date(event.date.seconds * 1000), 'PPP p')}
                    </p>
                  </div>
                  <Badge variant={event.published ? 'default' : 'secondary'}>
                    {event.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {event.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {event.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(event)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(event)}>
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
