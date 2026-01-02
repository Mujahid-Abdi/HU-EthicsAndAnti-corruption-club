import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { FirestoreService, Collections } from '@/lib/firestore';
import { Loader2, Save, RefreshCw, Info } from 'lucide-react';

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
}

export default function AboutTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    id: 'about-content',
    mission: '',
    vision: '',
    history: '',
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
    ]
  });

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const data = await FirestoreService.get(Collections.CONTENT, 'about-content');
      if (data) {
        setAboutContent(data as AboutContent);
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
      toast.error('Failed to load about content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await FirestoreService.set(Collections.CONTENT, 'about-content', aboutContent);
      toast.success('About content updated successfully');
    } catch (error) {
      console.error('Error saving about content:', error);
      toast.error('Failed to save about content');
    } finally {
      setSaving(false);
    }
  };

  const updatePillar = (index: number, field: string, value: string) => {
    const updatedPillars = [...aboutContent.pillars];
    updatedPillars[index] = { ...updatedPillars[index], [field]: value };
    setAboutContent({ ...aboutContent, pillars: updatedPillars });
  };

  const updateValue = (index: number, value: string) => {
    const updatedValues = [...aboutContent.values];
    updatedValues[index] = value;
    setAboutContent({ ...aboutContent, values: updatedValues });
  };

  const addValue = () => {
    setAboutContent({
      ...aboutContent,
      values: [...aboutContent.values, '']
    });
  };

  const removeValue = (index: number) => {
    const updatedValues = aboutContent.values.filter((_, i) => i !== index);
    setAboutContent({ ...aboutContent, values: updatedValues });
  };

  if (loading) {
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About Page Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage the content displayed on the About page</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAboutContent} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="pillars">Three Pillars</TabsTrigger>
          <TabsTrigger value="values">Core Values</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Mission & Vision
              </CardTitle>
              <CardDescription>
                Define the club's mission, vision, and history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mission">Mission Statement</Label>
                <Textarea
                  id="mission"
                  placeholder="Enter the club's mission statement..."
                  value={aboutContent.mission}
                  onChange={(e) => setAboutContent({ ...aboutContent, mission: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="vision">Vision Statement</Label>
                <Textarea
                  id="vision"
                  placeholder="Enter the club's vision statement..."
                  value={aboutContent.vision}
                  onChange={(e) => setAboutContent({ ...aboutContent, vision: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="history">History & Founding</Label>
                <Textarea
                  id="history"
                  placeholder="Enter the club's history and founding story..."
                  value={aboutContent.history}
                  onChange={(e) => setAboutContent({ ...aboutContent, history: e.target.value })}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pillars" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Three Pillars of Action</CardTitle>
              <CardDescription>
                Manage the three main pillars that guide the club's activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {aboutContent.pillars.map((pillar, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Pillar {index + 1}</h4>
                  </div>
                  <div>
                    <Label htmlFor={`pillar-title-${index}`}>Title</Label>
                    <Input
                      id={`pillar-title-${index}`}
                      value={pillar.title}
                      onChange={(e) => updatePillar(index, 'title', e.target.value)}
                      placeholder="Pillar title"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`pillar-description-${index}`}>Description</Label>
                    <Textarea
                      id={`pillar-description-${index}`}
                      value={pillar.description}
                      onChange={(e) => updatePillar(index, 'description', e.target.value)}
                      placeholder="Pillar description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`pillar-icon-${index}`}>Icon (Lucide icon name)</Label>
                    <Input
                      id={`pillar-icon-${index}`}
                      value={pillar.icon}
                      onChange={(e) => updatePillar(index, 'icon', e.target.value)}
                      placeholder="e.g., BookOpen, Scale, Users"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="values" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Core Values</CardTitle>
              <CardDescription>
                Manage the core values that define the club's principles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aboutContent.values.map((value, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={value}
                    onChange={(e) => updateValue(index, e.target.value)}
                    placeholder="Core value"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeValue(index)}
                    disabled={aboutContent.values.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addValue}>
                Add Value
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}