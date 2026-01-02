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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, Award, Upload, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

interface Achievement {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  date_achieved: any;
  published: boolean | null;
  created_at: any;
}

const categories = [
  'Awards & Recognition',
  'Community Impact',
  'Academic Excellence',
  'Leadership',
  'Innovation',
  'Partnership',
  'Other'
];

export default function AchievementsTab() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imageInputType, setImageInputType] = useState<'url' | 'file'>('url');
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: '',
    date_achieved: '',
    published: false,
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const data = await FirestoreService.getAll(Collections.ACHIEVEMENTS);
      setAchievements(data as Achievement[]);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      toast.error('Failed to fetch achievements');
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      category: '',
      date_achieved: '',
      published: false,
    });
    setEditingAchievement(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setFormData({
      title: achievement.title,
      description: achievement.description || '',
      image_url: achievement.image_url || '',
      category: achievement.category || '',
      date_achieved: achievement.date_achieved ? format(new Date(achievement.date_achieved.seconds * 1000), "yyyy-MM-dd") : '',
      published: achievement.published || false,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.date_achieved) {
      toast.error('Title and date achieved are required');
      return;
    }

    setIsSaving(true);
    const achievementData = {
      title: formData.title,
      description: formData.description || null,
      image_url: formData.image_url || null,
      category: formData.category || null,
      date_achieved: new Date(formData.date_achieved),
      published: formData.published,
      created_by: user?.uid,
      created_at: new Date(),
      updated_at: new Date(),
    };

    try {
      if (editingAchievement) {
        await FirestoreService.update(Collections.ACHIEVEMENTS, editingAchievement.id, {
          ...achievementData,
          updated_at: new Date(),
        });
        toast.success('Achievement updated successfully');
      } else {
        await FirestoreService.create(Collections.ACHIEVEMENTS, achievementData);
        toast.success('Achievement created successfully');
      }
      setIsDialogOpen(false);
      fetchAchievements();
    } catch (error) {
      console.error('Error saving achievement:', error);
      toast.error('Failed to save achievement');
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;

    try {
      await FirestoreService.delete(Collections.ACHIEVEMENTS, id);
      toast.success('Achievement deleted successfully');
      fetchAchievements();
    } catch (error) {
      console.error('Error deleting achievement:', error);
      toast.error('Failed to delete achievement');
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
        <h2 className="text-xl font-semibold">Achievements Management</h2>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Achievement
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAchievement ? 'Edit Achievement' : 'Create Achievement'}</DialogTitle>
            <DialogDescription>
              {editingAchievement ? 'Update the achievement details below.' : 'Add a new achievement to showcase club accomplishments.'}
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
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
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
            <div>
              <Label htmlFor="date_achieved">Date Achieved *</Label>
              <Input
                id="date_achieved"
                type="date"
                value={formData.date_achieved}
                onChange={(e) => setFormData({ ...formData, date_achieved: e.target.value })}
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
                'Save Achievement'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {achievements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No achievements yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className="overflow-hidden">
              {achievement.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={achievement.image_url}
                    alt={achievement.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base line-clamp-1">{achievement.title}</CardTitle>
                    {achievement.category && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {achievement.category}
                      </Badge>
                    )}
                  </div>
                  <Badge variant={achievement.published ? 'default' : 'secondary'} className="ml-2">
                    {achievement.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {achievement.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {achievement.description}
                  </p>
                )}
                {achievement.date_achieved && (
                  <p className="text-xs text-muted-foreground mb-3">
                    Achieved: {format(new Date(achievement.date_achieved.seconds * 1000), 'PPP')}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(achievement)}>
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(achievement.id)}>
                    <Trash2 className="h-3 w-3 mr-1" />
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