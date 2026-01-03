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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, Newspaper, Database, Upload, Link as LinkIcon, Send } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { compressImage } from '@/lib/utils';

const sampleNewsArticles = [
  {
    title: "Student Union Elections 2025: Registration Now Open",
    excerpt: "The Haramaya University Student Union announces the opening of candidate registration for the upcoming 2025 elections. All eligible students are encouraged to participate.",
    content: `The Haramaya University Student Union is pleased to announce that candidate registration for the 2025 Student Union Elections is now officially open.

This year's elections will determine the leadership of our student body for the upcoming academic year. We are seeking dedicated, passionate, and ethical students to represent their peers in various positions including President, Vice President, Secretary General, and departmental representatives.

Key Dates:
- Candidate Registration: December 20, 2025 - January 10, 2026
- Campaign Period: January 15 - January 25, 2026
- Voting Days: January 28-29, 2026
- Results Announcement: January 30, 2026

Eligibility Requirements:
- Must be a registered student in good academic standing
- Minimum GPA of 2.5
- No disciplinary actions in the past academic year
- Commitment to ethical leadership and transparency

The Ethics and Anti-Corruption Club will be monitoring the entire election process to ensure fairness and transparency.`,
    image_url: "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?w=800",
    published: true,
  },
  {
    title: "Ethics Club Launches Anti-Corruption Awareness Week",
    excerpt: "Join us for a week of workshops, seminars, and activities focused on promoting ethical conduct and fighting corruption in our university community.",
    content: `The Haramaya University Ethics and Anti-Corruption Club is proud to announce our annual Anti-Corruption Awareness Week, scheduled for January 15-21, 2026.

This year's theme is "Integrity Starts With You" and will feature a variety of engaging activities designed to educate and inspire our university community.

Program Highlights:
- Day 1: Opening Ceremony & Keynote Address
- Day 2: Workshop on Recognizing and Reporting Corruption
- Day 3: Panel Discussion on Ethics in Academic Life
- Day 4: Documentary Screening & Discussion
- Day 5: Student Debate Competition
- Day 6: Community Outreach
- Day 7: Closing Ceremony & Awards

All events are free and open to all students, faculty, and staff. Certificates of participation will be provided.`,
    image_url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800",
    published: true,
  },
  {
    title: "Clubs and Organizations Fair: Find Your Community",
    excerpt: "Over 50 student clubs and organizations will showcase their activities at the annual Clubs Fair. Discover opportunities to get involved!",
    content: `Haramaya University invites all students to the Annual Clubs and Organizations Fair, taking place on January 8, 2026, at the Main Campus Grounds from 9:00 AM to 5:00 PM.

This exciting event brings together over 50 registered student clubs and organizations, offering students the perfect opportunity to explore their interests and find their community.

Featured Organizations:
- Academic Clubs: Engineering Society, Medical Students Association, Law Students Forum
- Cultural & Arts: Drama Club, Music Association, Photography Club
- Service & Advocacy: Ethics and Anti-Corruption Club, Environmental Conservation Club
- Sports & Recreation: Football Club, Basketball Association, Chess Club

Don't miss this chance to enhance your university experience!`,
    image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
    published: true,
  },
  {
    title: "Voting System Training for Election Monitors",
    excerpt: "The Ethics Club is conducting training sessions for students who will serve as election monitors during the upcoming Student Union elections.",
    content: `In preparation for the 2025 Student Union Elections, the Ethics and Anti-Corruption Club is organizing comprehensive training sessions for volunteer election monitors.

Training Schedule:
- Session 1: January 5, 2026 (9:00 AM - 12:00 PM)
- Session 2: January 6, 2026 (2:00 PM - 5:00 PM)
- Session 3: January 7, 2026 (9:00 AM - 12:00 PM)

Training Topics:
1. Understanding Electoral Integrity
2. Monitoring Procedures
3. Conflict Resolution
4. Technology and Voting Systems

To register as an election monitor, please fill out the application form at the Ethics Club office.`,
    image_url: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800",
    published: true,
  },
  {
    title: "Student Union Announces New Scholarship Programs",
    excerpt: "Three new scholarship programs have been established to support academically excellent and financially needy students at Haramaya University.",
    content: `The Haramaya University Student Union is proud to announce the establishment of three new scholarship programs for the 2025-2026 academic year.

1. Merit Excellence Scholarship
- Award: Full tuition coverage
- Eligibility: GPA of 3.75 or above

2. Need-Based Support Grant
- Award: 50-100% tuition support based on need
- Eligibility: Demonstrated financial need

3. Leadership and Service Award
- Award: Partial tuition + monthly stipend
- Eligibility: Active involvement in clubs/community service

Application Opens: January 2, 2026
Application Deadline: February 15, 2026`,
    image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    published: true,
  },
  {
    title: "Ethics Club Partners with Regional Anti-Corruption Office",
    excerpt: "A new partnership will bring professional training and resources to strengthen our fight against corruption on campus and in the community.",
    content: `The Haramaya University Ethics and Anti-Corruption Club has signed a Memorandum of Understanding (MOU) with the Oromia Regional Anti-Corruption Commission.

Partnership Highlights:
- Professional training for club members
- Workshops on investigation techniques
- Guest lectures from commission experts
- Internship opportunities for students
- Joint community education programs
- Streamlined reporting channels

This partnership reflects our commitment to moving beyond awareness to actual impact. We invite all students to join us in this important mission.`,
    image_url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800",
    published: true,
  }
];

interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  published: boolean | null;
  createdAt: any;
  updatedAt: any;
  telegramMessageId?: string;
  telegramMessageIds?: Record<string, string>;
}

export default function NewsTab() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { settings: systemSettings } = useSystemSettings();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imageInputType, setImageInputType] = useState<'url' | 'file'>('url');
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    published: false,
    postToTelegram: false,
  });
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const data = await FirestoreService.getAll(Collections.NEWS);
      setNews(data as NewsItem[]);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to fetch news');
    }
    setIsLoading(false);
  };

  const seedSampleNews = async () => {
    setIsSeeding(true);
    let successCount = 0;
    
    for (const article of sampleNewsArticles) {
      try {
        await FirestoreService.create(Collections.NEWS, {
          ...article,
          created_by: user?.uid,
        });
        successCount++;
      } catch (error) {
        console.error('Error seeding article:', error);
      }
    }
    
    if (successCount > 0) {
      toast.success(`Added ${successCount} sample news articles`);
      fetchNews();
    } else {
      toast.error('Failed to add sample articles');
    }
    setIsSeeding(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image_url: '',
      published: false,
      postToTelegram: false,
    });
    setEditingNews(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: NewsItem) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      excerpt: item.excerpt || '',
      content: item.content,
      image_url: item.imageUrl || '',
      published: item.published || false,
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
    const newsData = {
      title: formData.title,
      excerpt: formData.excerpt || null,
      content: formData.content,
      imageUrl: formData.image_url || null,
      published: formData.published,
      created_by: user?.uid,
    };

    try {
      let currentTelegramIds = editingNews?.telegramMessageIds || {};
      
      // Post/Update to Telegram if enabled
      if (formData.published && formData.postToTelegram && systemSettings.telegramEnabled) {
        const telegramContent = {
          title: formData.title,
          text: formData.excerpt || formData.content.substring(0, 150) + '...',
          imageUrl: formData.image_url,
          type: 'News' as const,
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

      const finalNewsData = {
         ...newsData,
         telegramMessageIds: currentTelegramIds
      };

      if (editingNews) {
        await FirestoreService.update(Collections.NEWS, editingNews.id, finalNewsData);
        const telegramAdded = formData.postToTelegram && Object.keys(currentTelegramIds).length > 0;
        const telegramFailed = formData.postToTelegram && Object.keys(currentTelegramIds).length === 0;
        
        if (telegramFailed) {
          toast.warning('News updated, but Telegram posting failed. Please check your bot token and channel IDs.');
        } else {
          toast.success('News updated successfully' + (telegramAdded ? ' and synced with Telegram' : ''));
        }
      } else {
        await FirestoreService.create(Collections.NEWS, finalNewsData);
        const telegramAdded = formData.postToTelegram && Object.keys(currentTelegramIds).length > 0;
        const telegramFailed = formData.postToTelegram && Object.keys(currentTelegramIds).length === 0;

        if (telegramFailed) {
          toast.warning('News created, but Telegram posting failed. Please check your bot token and channel IDs.');
        } else {
          toast.success('News created successfully' + (telegramAdded ? ' and posted to Telegram' : ''));
        }
      }

      setIsDialogOpen(false);
      fetchNews();
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('Failed to save news');
    }
    setIsSaving(false);
  };

  const handleDelete = async (item: NewsItem) => {
    if (!confirm('Are you sure you want to delete this news article?')) return;

    try {
      // Delete from Telegram if exists
      if (item.telegramMessageIds && Object.keys(item.telegramMessageIds).length > 0 && systemSettings.telegramEnabled) {
        await TelegramService.deletePost(systemSettings, item.telegramMessageIds);
      }
      
      await FirestoreService.delete(Collections.NEWS, item.id);
      toast.success('News article and corresponding Telegram posts deleted successfully');
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error('Failed to delete news');
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
        <h2 className="text-xl font-semibold">News Management</h2>
        <div className="flex gap-2">
          {news.length === 0 && (
            <Button variant="outline" onClick={seedSampleNews} disabled={isSeeding}>
              {isSeeding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Add Sample News
                </>
              )}
            </Button>
          )}
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Article
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingNews ? 'Edit Article' : 'Create Article'}</DialogTitle>
            <DialogDescription>
              {editingNews ? 'Update the news article details below.' : 'Create a new news article or announcement.'}
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
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                placeholder="Brief summary of the article"
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
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = async (e) => {
                            const base64 = e.target?.result as string;
                            if (base64) {
                              try {
                                const toastId = toast.loading('Compressing image...');
                                const compressed = await compressImage(base64);
                                setFormData({ ...formData, image_url: compressed });
                                toast.dismiss(toastId);
                                toast.success('Image compressed and ready');
                              } catch (err) {
                                console.error('Compression failed:', err);
                                toast.error('Failed to process image');
                              }
                            }
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
            <div className="flex items-center justify-between">
              <Label htmlFor="published">Published</Label>
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
            </div>
            {formData.published && (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="postToTelegram">Post to Telegram</Label>
                  <p className="text-xs text-muted-foreground">
                    Share this news on Telegram channel
                  </p>
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
                'Save Article'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {news.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No news articles yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {news.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    {item.createdAt && (
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(item.createdAt.seconds * 1000), 'PPP')}
                      </p>
                    )}
                  </div>
                  <Badge variant={item.published ? 'default' : 'secondary'}>
                    {item.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {item.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {item.excerpt}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item)}>
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
