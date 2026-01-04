import { useState, useEffect } from 'react';
import { FirestoreService } from '@/lib/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Save, Loader2, Home, Eye, EyeOff, Plus, Trash2, Users, Trophy, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface LeadershipMember {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  image: string;
  bio: string;
}

interface HomePageContent {
  missionTitle: string;
  missionDescription: string;
  visionTitle: string;
  visionDescription: string;
  valuesTitle: string;
  valuesDescription: string;
  achievementsTitle: string;
  achievementsDescription: string;
  leadershipTitle: string;
  leadershipDescription: string;
  leadership: LeadershipMember[];
}

const defaultContent: HomePageContent = {
  missionTitle: "Our Mission",
  missionDescription: "To foster a culture of integrity and ethical behavior within Haramaya University by educating, advocating, and taking action against corruption in all its forms.",
  visionTitle: "Our Vision", 
  visionDescription: "A corruption-free university environment where ethical conduct is the foundation of all academic and administrative activities.",
  valuesTitle: "Our Values",
  valuesDescription: "Integrity, Transparency, Accountability, Justice, and Excellence guide everything we do.",
  achievementsTitle: "Our Latest Achievements",
  achievementsDescription: "Celebrating our recent accomplishments in promoting ethics and fighting corruption.",
  leadershipTitle: "Our Leadership Team",
  leadershipDescription: "Meet the dedicated leaders driving our mission forward.",
  leadership: [
    {
      id: "1",
      name: "John Doe",
      position: "President",
      email: "president@huec.edu.et",
      phone: "+251-911-123456",
      image: "",
      bio: "Leading the fight against corruption with passion and dedication."
    },
    {
      id: "2", 
      name: "Jane Smith",
      position: "Vice President",
      email: "vicepresident@huec.edu.et",
      phone: "+251-911-123457",
      image: "",
      bio: "Supporting ethical initiatives and student engagement programs."
    },
    {
      id: "3",
      name: "Mike Johnson", 
      position: "Secretary",
      email: "secretary@huec.edu.et",
      phone: "+251-911-123458",
      image: "",
      bio: "Managing communications and organizational activities."
    }
  ]
};

export default function HomeManagementTab() {
  const [content, setContent] = useState<HomePageContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async () => {
    try {
      const data = await FirestoreService.get('settings', 'home-page-content');
      if (data) {
        setContent({ ...defaultContent, ...data });
      }
    } catch (error) {
      console.error('Error fetching home content:', error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await FirestoreService.createOrUpdate('settings', 'home-page-content', {
        ...content,
        updatedBy: user?.uid,
        updatedAt: new Date(),
      });
      toast.success('Home page content updated successfully');
    } catch (error) {
      console.error('Error saving home content:', error);
      toast.error('Failed to update home page content');
    }
    setIsSaving(false);
  };

  const handleInputChange = (field: keyof HomePageContent, value: string | boolean | LeadershipMember[]) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addLeadershipMember = () => {
    const newMember: LeadershipMember = {
      id: Date.now().toString(),
      name: "",
      position: "",
      email: "",
      phone: "",
      image: "",
      bio: ""
    };
    setContent(prev => ({
      ...prev,
      leadership: [...prev.leadership, newMember]
    }));
  };

  const updateLeadershipMember = (id: string, field: keyof LeadershipMember, value: string) => {
    setContent(prev => ({
      ...prev,
      leadership: prev.leadership.map(member => 
        member.id === id ? { ...member, [field]: value } : member
      )
    }));
  };

  const removeLeadershipMember = (id: string) => {
    setContent(prev => ({
      ...prev,
      leadership: prev.leadership.filter(member => member.id !== id)
    }));
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
          <h2 className="text-2xl font-bold text-foreground">Home Page Management</h2>
          <p className="text-muted-foreground">Customize the content and sections of your home page</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Mission Section */}
      <Card>
        <CardHeader>
          <CardTitle>Mission Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="missionTitle">Mission Title</Label>
            <Input
              id="missionTitle"
              value={content.missionTitle}
              onChange={(e) => handleInputChange('missionTitle', e.target.value)}
              placeholder="Enter mission title"
            />
          </div>
          <div>
            <Label htmlFor="missionDescription">Mission Description</Label>
            <Textarea
              id="missionDescription"
              value={content.missionDescription}
              onChange={(e) => handleInputChange('missionDescription', e.target.value)}
              placeholder="Enter mission description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Vision Section */}
      <Card>
        <CardHeader>
          <CardTitle>Vision Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="visionTitle">Vision Title</Label>
            <Input
              id="visionTitle"
              value={content.visionTitle}
              onChange={(e) => handleInputChange('visionTitle', e.target.value)}
              placeholder="Enter vision title"
            />
          </div>
          <div>
            <Label htmlFor="visionDescription">Vision Description</Label>
            <Textarea
              id="visionDescription"
              value={content.visionDescription}
              onChange={(e) => handleInputChange('visionDescription', e.target.value)}
              placeholder="Enter vision description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Values Section */}
      <Card>
        <CardHeader>
          <CardTitle>Values Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="valuesTitle">Values Title</Label>
            <Input
              id="valuesTitle"
              value={content.valuesTitle}
              onChange={(e) => handleInputChange('valuesTitle', e.target.value)}
              placeholder="Enter values title"
            />
          </div>
          <div>
            <Label htmlFor="valuesDescription">Values Description</Label>
            <Textarea
              id="valuesDescription"
              value={content.valuesDescription}
              onChange={(e) => handleInputChange('valuesDescription', e.target.value)}
              placeholder="Enter values description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Latest Achievements Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="achievementsTitle">Achievements Title</Label>
            <Input
              id="achievementsTitle"
              value={content.achievementsTitle}
              onChange={(e) => handleInputChange('achievementsTitle', e.target.value)}
              placeholder="Enter achievements title"
            />
          </div>
          <div>
            <Label htmlFor="achievementsDescription">Achievements Description</Label>
            <Textarea
              id="achievementsDescription"
              value={content.achievementsDescription}
              onChange={(e) => handleInputChange('achievementsDescription', e.target.value)}
              placeholder="Enter achievements description"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Leadership Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Leadership Team Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="leadershipTitle">Leadership Title</Label>
            <Input
              id="leadershipTitle"
              value={content.leadershipTitle}
              onChange={(e) => handleInputChange('leadershipTitle', e.target.value)}
              placeholder="Enter leadership title"
            />
          </div>
          <div>
            <Label htmlFor="leadershipDescription">Leadership Description</Label>
            <Textarea
              id="leadershipDescription"
              value={content.leadershipDescription}
              onChange={(e) => handleInputChange('leadershipDescription', e.target.value)}
              placeholder="Enter leadership description"
              rows={2}
            />
          </div>

          <div className="pt-4 border-t border-border">
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Centralized Team Management</h4>
                  <p className="text-sm text-muted-foreground">Leadership members are now managed from a single central location.</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                To add, edit, or remove leadership members (including their photos), please use the <strong>Executive Team</strong> tab in <strong>Content Management</strong>.
              </p>
              <div className="p-3 bg-white dark:bg-gray-950 rounded-lg border text-sm text-muted-foreground italic mb-4">
                Tip: Changes made there will automatically update both the Home and About pages.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}