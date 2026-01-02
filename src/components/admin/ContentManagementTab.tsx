import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X, Users, User, Mail, Phone, FileText, Info, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { FirestoreService, Collections } from '@/lib/firestore';

interface AboutContent {
  id: string;
  mission: string;
  vision: string;
  history: string;
  values: string[];
  pillars: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  updatedAt: any;
}

interface ContactInfo {
  id: string;
  address: string;
  phone: string;
  email: string;
  officeHours: Array<{
    day: string;
    hours: string;
  }>;
  updatedAt: any;
}

interface ExecutiveMember {
  id: string;
  fullName: string;
  position: string;
  email: string | null;
  phone: string | null;
  bio: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
}

export default function ContentManagementTab() {
  // About page state
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    id: 'about-content',
    mission: 'To cultivate a culture of integrity by educating students about ethical conduct, advocating for transparent policies, providing secure channels for reporting concerns, and collaborating with all stakeholders to prevent and address corruption within our university.',
    vision: 'To establish Haramaya University as a beacon of ethical excellence in higher education, where integrity is the foundation of all academic, administrative, and social interactions, inspiring a generation of principled leaders committed to building a corruption-free society.',
    history: 'The Haramaya University Ethics and Anti-Corruption Club was founded by a group of dedicated students who recognized the vital importance of ethical conduct in academic settings. Inspired by national and international efforts to combat corruption, the club was established to serve as a student-led initiative promoting integrity.',
    values: ['Integrity', 'Transparency', 'Accountability', 'Education'],
    pillars: [
      {
        title: 'Education',
        description: 'We conduct workshops, seminars, and awareness campaigns to educate students about ethical conduct, anti-corruption laws, and the importance of integrity in academic and professional life.',
        icon: 'BookOpen'
      },
      {
        title: 'Policy Advocacy',
        description: 'We work closely with university administration to review, strengthen, and implement policies that promote transparency, accountability, and ethical governance.',
        icon: 'Scale'
      },
      {
        title: 'Support & Reporting',
        description: 'We provide a safe, confidential channel for students and staff to report concerns about unethical behavior, and offer support throughout the process.',
        icon: 'Users'
      }
    ],
    updatedAt: null
  });

  // Contact page state
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    id: 'contact-info',
    address: 'Student Center Building, Room 204\nHaramaya University Main Campus\nP.O. Box 138, Dire Dawa, Ethiopia',
    phone: '+251 25 553 0325',
    email: 'ethics.club@haramaya.edu.et',
    officeHours: [
      { day: 'Monday - Friday', hours: '8:00 AM - 5:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 12:00 PM' },
      { day: 'Sunday', hours: 'Closed' }
    ],
    updatedAt: null
  });

  // Executive members state
  const [executives, setExecutives] = useState<ExecutiveMember[]>([]);
  const [editingExecutive, setEditingExecutive] = useState<string | null>(null);
  const [isAddingExecutive, setIsAddingExecutive] = useState(false);
  const [executiveForm, setExecutiveForm] = useState<Partial<ExecutiveMember>>({});

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    fetchContent();
    fetchExecutives();
  }, []);

  const fetchContent = async () => {
    try {
      // Fetch about content
      const aboutData = await FirestoreService.get(Collections.CONTENT, 'about-content');
      if (aboutData) {
        setAboutContent(aboutData as AboutContent);
      }

      // Fetch contact info
      const contactData = await FirestoreService.get(Collections.CONTENT, 'contact-info');
      if (contactData) {
        setContactInfo(contactData as ContactInfo);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const fetchExecutives = async () => {
    try {
      const executivesData = await FirestoreService.getAll(Collections.EXECUTIVES);
      setExecutives((executivesData as ExecutiveMember[]).sort((a, b) => a.displayOrder - b.displayOrder));
    } catch (error) {
      console.error('Error fetching executives:', error);
    }
  };

  const handleSaveAbout = async () => {
    setLoading(true);
    try {
      await FirestoreService.createOrUpdate(Collections.CONTENT, 'about-content', {
        ...aboutContent,
        updatedAt: new Date()
      });
      toast.success('About page content updated successfully');
    } catch (error) {
      console.error('Error saving about content:', error);
      toast.error('Failed to save about content');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContact = async () => {
    setLoading(true);
    try {
      await FirestoreService.createOrUpdate(Collections.CONTENT, 'contact-info', {
        ...contactInfo,
        updatedAt: new Date()
      });
      toast.success('Contact information updated successfully');
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast.error('Failed to save contact information');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExecutive = () => {
    setIsAddingExecutive(true);
    setExecutiveForm({
      fullName: '',
      position: '',
      email: '',
      phone: '',
      bio: '',
      imageUrl: '',
      displayOrder: executives.length + 1,
      isActive: true,
    });
  };

  const handleEditExecutive = (executive: ExecutiveMember) => {
    setEditingExecutive(executive.id);
    setExecutiveForm(executive);
  };

  const handleSaveExecutive = async () => {
    if (!executiveForm.fullName || !executiveForm.position) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (isAddingExecutive) {
        const newExecutive: ExecutiveMember = {
          id: Date.now().toString(),
          fullName: executiveForm.fullName!,
          position: executiveForm.position!,
          email: executiveForm.email || null,
          phone: executiveForm.phone || null,
          bio: executiveForm.bio || null,
          imageUrl: executiveForm.imageUrl || null,
          displayOrder: executiveForm.displayOrder || executives.length + 1,
          isActive: executiveForm.isActive !== false,
        };
        
        await FirestoreService.create(Collections.EXECUTIVES, newExecutive);
        setExecutives([...executives, newExecutive].sort((a, b) => a.displayOrder - b.displayOrder));
        toast.success('Executive member added successfully');
      } else if (editingExecutive) {
        await FirestoreService.update(Collections.EXECUTIVES, editingExecutive, executiveForm);
        setExecutives(executives.map(exec => 
          exec.id === editingExecutive 
            ? { ...exec, ...executiveForm } as ExecutiveMember
            : exec
        ).sort((a, b) => a.displayOrder - b.displayOrder));
        toast.success('Executive member updated successfully');
      }

      setIsAddingExecutive(false);
      setEditingExecutive(null);
      setExecutiveForm({});
    } catch (error) {
      console.error('Error saving executive:', error);
      toast.error('Failed to save executive member');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExecutive = async (id: string) => {
    try {
      await FirestoreService.delete(Collections.EXECUTIVES, id);
      setExecutives(executives.filter(exec => exec.id !== id));
      toast.success('Executive member deleted successfully');
    } catch (error) {
      console.error('Error deleting executive:', error);
      toast.error('Failed to delete executive member');
    }
  };

  const handleCancelExecutive = () => {
    setIsAddingExecutive(false);
    setEditingExecutive(null);
    setExecutiveForm({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Content Management</h2>
          <p className="text-muted-foreground">Manage About and Contact page content</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            About Page
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Contact Info
          </TabsTrigger>
          <TabsTrigger value="executives" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Executive Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                About Page Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mission Statement</label>
                  <Textarea
                    value={aboutContent.mission}
                    onChange={(e) => setAboutContent(prev => ({ ...prev, mission: e.target.value }))}
                    placeholder="Enter mission statement"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Vision Statement</label>
                  <Textarea
                    value={aboutContent.vision}
                    onChange={(e) => setAboutContent(prev => ({ ...prev, vision: e.target.value }))}
                    placeholder="Enter vision statement"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">History & Background</label>
                  <Textarea
                    value={aboutContent.history}
                    onChange={(e) => setAboutContent(prev => ({ ...prev, history: e.target.value }))}
                    placeholder="Enter club history and background"
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Core Values (comma-separated)</label>
                  <Input
                    value={aboutContent.values.join(', ')}
                    onChange={(e) => setAboutContent(prev => ({ 
                      ...prev, 
                      values: e.target.value.split(',').map(v => v.trim()).filter(v => v) 
                    }))}
                    placeholder="Enter core values separated by commas"
                  />
                </div>
              </div>

              <Button onClick={handleSaveAbout} disabled={loading} className="gap-2">
                <Save className="w-4 h-4" />
                Save About Content
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter contact email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Office Address</label>
                <Textarea
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter office address"
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">Office Hours</label>
                {contactInfo.officeHours.map((schedule, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4">
                    <Input
                      value={schedule.day}
                      onChange={(e) => {
                        const newHours = [...contactInfo.officeHours];
                        newHours[index] = { ...newHours[index], day: e.target.value };
                        setContactInfo(prev => ({ ...prev, officeHours: newHours }));
                      }}
                      placeholder="Day(s)"
                    />
                    <Input
                      value={schedule.hours}
                      onChange={(e) => {
                        const newHours = [...contactInfo.officeHours];
                        newHours[index] = { ...newHours[index], hours: e.target.value };
                        setContactInfo(prev => ({ ...prev, officeHours: newHours }));
                      }}
                      placeholder="Hours"
                    />
                  </div>
                ))}
              </div>

              <Button onClick={handleSaveContact} disabled={loading} className="gap-2">
                <Save className="w-4 h-4" />
                Save Contact Information
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="executives" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Executive Team Management</h3>
              <p className="text-sm text-muted-foreground">Manage executive committee members displayed on the contact page</p>
            </div>
            <Button onClick={handleAddExecutive} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Executive
            </Button>
          </div>

          {(isAddingExecutive || editingExecutive) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {isAddingExecutive ? 'Add New Executive' : 'Edit Executive'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name *</label>
                    <Input
                      value={executiveForm.fullName || ''}
                      onChange={(e) => setExecutiveForm(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Position *</label>
                    <Input
                      value={executiveForm.position || ''}
                      onChange={(e) => setExecutiveForm(prev => ({ ...prev, position: e.target.value }))}
                      placeholder="Enter position"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={executiveForm.email || ''}
                      onChange={(e) => setExecutiveForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={executiveForm.phone || ''}
                      onChange={(e) => setExecutiveForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Photo URL</label>
                    <Input
                      value={executiveForm.imageUrl || ''}
                      onChange={(e) => setExecutiveForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="Enter photo URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Display Order</label>
                    <Input
                      type="number"
                      value={executiveForm.displayOrder || 0}
                      onChange={(e) => setExecutiveForm(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                      placeholder="Enter display order"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <Textarea
                    value={executiveForm.bio || ''}
                    onChange={(e) => setExecutiveForm(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Enter bio"
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={executiveForm.isActive !== false}
                    onChange={(e) => setExecutiveForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">Active</label>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveExecutive} disabled={loading} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Executive
                  </Button>
                  <Button variant="outline" onClick={handleCancelExecutive} className="gap-2">
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {executives.map((executive) => (
              <Card key={executive.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {executive.imageUrl ? (
                          <img 
                            src={executive.imageUrl} 
                            alt={executive.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{executive.fullName}</h3>
                          <Badge variant="outline">{executive.position}</Badge>
                          {!executive.isActive && <Badge variant="secondary">Inactive</Badge>}
                          <Badge variant="outline" className="text-xs">#{executive.displayOrder}</Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          {executive.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              <span>{executive.email}</span>
                            </div>
                          )}
                          {executive.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{executive.phone}</span>
                            </div>
                          )}
                        </div>
                        
                        {executive.bio && (
                          <p className="text-muted-foreground text-sm">{executive.bio}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditExecutive(executive)}
                        className="gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteExecutive(executive.id)}
                        className="gap-1 text-destructive hover:text-destructive"
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

          {executives.length === 0 && !isAddingExecutive && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Executive Members</h3>
                <p className="text-muted-foreground mb-4">Add your first executive member to get started</p>
                <Button onClick={handleAddExecutive} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add First Executive
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}