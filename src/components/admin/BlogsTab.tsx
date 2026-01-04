import { useState, useEffect } from 'react';
import { FirestoreService, Collections } from '@/lib/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { TelegramService } from '@/lib/telegram';
import { 
  Loader2, 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar,
  User,
  Tag,
  Save,
  X,
  Upload,
  Image
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  published: boolean;
  createdAt: any;
  updatedAt: any;
  tags: string[];
  postToTelegram?: boolean;
}

export default function BlogsTab() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    author: '',
    published: false,
    tags: [] as string[],
    postToTelegram: false,
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const data = await FirestoreService.getAll(Collections.BLOGS);
      const sortedBlogs = data.sort((a: any, b: any) => {
        const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(0);
        const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      setBlogs(sortedBlogs as BlogPost[]);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to fetch blogs');
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      imageUrl: '',
      author: user?.displayName || user?.email || '',
      published: false,
      tags: [],
      postToTelegram: false,
    });
    setTagInput('');
    setImagePreview(null);
    setEditingBlog(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (blog: BlogPost) => {
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      imageUrl: blog.imageUrl,
      author: blog.author,
      published: blog.published,
      tags: blog.tags || [],
      postToTelegram: false,
    });
    setTagInput('');
    setImagePreview(blog.imageUrl);
    setEditingBlog(blog);
    setIsDialogOpen(true);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
        setFormData(prev => ({ ...prev, imageUrl: base64String }));
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
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    toast.success('Image removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const blogData = {
        ...formData,
        author: formData.author || user?.displayName || user?.email || 'Anonymous',
        updatedBy: user?.uid,
        updatedAt: new Date(),
      };

      if (editingBlog) {
        await FirestoreService.update(Collections.BLOGS, editingBlog.id, blogData);
        toast.success('Blog post updated successfully');
      } else {
        const newBlog = await FirestoreService.create(Collections.BLOGS, {
          ...blogData,
          createdBy: user?.uid,
        });

        // Post to Telegram if enabled and published
        if (formData.postToTelegram && formData.published) {
          try {
            await TelegramService.postBlog({
              title: formData.title,
              excerpt: formData.excerpt,
              author: formData.author,
              tags: formData.tags,
              url: `${window.location.origin}/blogs/${newBlog.id}`
            });
          } catch (telegramError) {
            console.error('Failed to post to Telegram:', telegramError);
            toast.error('Blog created but failed to post to Telegram');
          }
        }

        toast.success('Blog post created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error('Failed to save blog post');
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await FirestoreService.delete(Collections.BLOGS, id);
      toast.success('Blog post deleted successfully');
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog post');
    }
  };

  const togglePublished = async (blog: BlogPost) => {
    try {
      await FirestoreService.update(Collections.BLOGS, blog.id, {
        published: !blog.published,
        updatedBy: user?.uid,
        updatedAt: new Date(),
      });
      toast.success(`Blog post ${!blog.published ? 'published' : 'unpublished'} successfully`);
      fetchBlogs();
    } catch (error) {
      console.error('Error updating blog status:', error);
      toast.error('Failed to update blog status');
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Blog Management</h2>
          <p className="text-muted-foreground">Create and manage blog posts</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              New Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter blog title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Author name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of the blog post"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your blog content here..."
                  rows={10}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Featured Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/image.jpg or upload file below"
                />
              </div>

              {/* File Upload Section */}
              <div className="space-y-4">
                <Label>Upload Featured Image</Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  {imagePreview ? (
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Featured image uploaded successfully
                        </p>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('blog-image-upload')?.click()}
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
                          onClick={() => document.getElementById('blog-image-upload')?.click()}
                          disabled={uploadingImage}
                          className="gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          {uploadingImage ? 'Uploading...' : 'Upload Featured Image'}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  )}
                  <input
                    id="blog-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                    />
                    <Label htmlFor="published">Publish immediately</Label>
                  </div>
                  
                  {!editingBlog && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="postToTelegram"
                        checked={formData.postToTelegram}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, postToTelegram: checked }))}
                      />
                      <Label htmlFor="postToTelegram">Post to Telegram</Label>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {editingBlog ? 'Update' : 'Create'} Blog
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {blogs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No blog posts yet. Create your first blog post!</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Blog Posts ({blogs.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{blog.title}</div>
                          {blog.excerpt && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {blog.excerpt}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {blog.author || 'Anonymous'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={blog.published ? 'default' : 'secondary'}>
                          {blog.published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {blog.tags?.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {blog.tags?.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{blog.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {blog.createdAt && format(
                            blog.createdAt.seconds 
                              ? new Date(blog.createdAt.seconds * 1000) 
                              : new Date(blog.createdAt), 
                            'MMM d, yyyy'
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePublished(blog)}
                            title={blog.published ? 'Unpublish' : 'Publish'}
                          >
                            {blog.published ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(blog)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(blog.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}