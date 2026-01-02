import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { FirestoreService, Collections } from '@/lib/firestore';
import { Loader2, Save, RefreshCw, Phone, Mail, MapPin, Clock } from 'lucide-react';

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  officeHours: string;
}

interface SocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  telegram?: string;
}

interface ContactContent {
  id: string;
  title: string;
  description: string;
  contactInfo: ContactInfo;
  socialMedia: SocialMedia;
  mapEmbedUrl?: string;
  additionalInfo?: string;
}

export default function ContactTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contactContent, setContactContent] = useState<ContactContent>({
    id: 'contact-content',
    title: 'Get in Touch',
    description: 'Have questions or concerns? We\'re here to help. Reach out to us through any of the channels below.',
    contactInfo: {
      phone: '+251-9-XXXX-XXXX',
      email: 'ethics@haramaya.edu.et',
      address: 'Haramaya University, Dire Dawa, Ethiopia',
      officeHours: 'Monday - Friday: 8:00 AM - 5:00 PM'
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      telegram: ''
    },
    mapEmbedUrl: '',
    additionalInfo: 'For urgent matters or anonymous reporting, please use our secure reporting system.'
  });

  useEffect(() => {
    fetchContactContent();
  }, []);

  const fetchContactContent = async () => {
    try {
      setLoading(true);
      const data = await FirestoreService.get(Collections.CONTENT, 'contact-content');
      if (data) {
        setContactContent(data as ContactContent);
      }
    } catch (error) {
      console.error('Error fetching contact content:', error);
      toast.error('Failed to load contact content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await FirestoreService.set(Collections.CONTENT, 'contact-content', contactContent);
      toast.success('Contact content updated successfully');
    } catch (error) {
      console.error('Error saving contact content:', error);
      toast.error('Failed to save contact content');
    } finally {
      setSaving(false);
    }
  };

  const updateContactInfo = (field: keyof ContactInfo, value: string) => {
    setContactContent({
      ...contactContent,
      contactInfo: {
        ...contactContent.contactInfo,
        [field]: value
      }
    });
  };

  const updateSocialMedia = (platform: keyof SocialMedia, value: string) => {
    setContactContent({
      ...contactContent,
      socialMedia: {
        ...contactContent.socialMedia,
        [platform]: value
      }
    });
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Page Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage the content displayed on the Contact page</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchContactContent} disabled={loading}>
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
          <TabsTrigger value="contact">Contact Details</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Content</CardTitle>
              <CardDescription>
                Manage the main content of the contact page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={contactContent.title}
                  onChange={(e) => setContactContent({ ...contactContent, title: e.target.value })}
                  placeholder="Contact page title"
                />
              </div>
              <div>
                <Label htmlFor="description">Page Description</Label>
                <Textarea
                  id="description"
                  value={contactContent.description}
                  onChange={(e) => setContactContent({ ...contactContent, description: e.target.value })}
                  placeholder="Brief description for the contact page"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  value={contactContent.additionalInfo || ''}
                  onChange={(e) => setContactContent({ ...contactContent, additionalInfo: e.target.value })}
                  placeholder="Any additional information or instructions"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="mapEmbedUrl">Google Maps Embed URL (optional)</Label>
                <Input
                  id="mapEmbedUrl"
                  value={contactContent.mapEmbedUrl || ''}
                  onChange={(e) => setContactContent({ ...contactContent, mapEmbedUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Get embed URL from Google Maps → Share → Embed a map
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Manage the club's contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={contactContent.contactInfo.phone}
                  onChange={(e) => updateContactInfo('phone', e.target.value)}
                  placeholder="+251-9-XXXX-XXXX"
                />
              </div>
              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={contactContent.contactInfo.email}
                  onChange={(e) => updateContactInfo('email', e.target.value)}
                  placeholder="ethics@haramaya.edu.et"
                />
              </div>
              <div>
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Physical Address
                </Label>
                <Textarea
                  id="address"
                  value={contactContent.contactInfo.address}
                  onChange={(e) => updateContactInfo('address', e.target.value)}
                  placeholder="Haramaya University, Dire Dawa, Ethiopia"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="officeHours" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Office Hours
                </Label>
                <Input
                  id="officeHours"
                  value={contactContent.contactInfo.officeHours}
                  onChange={(e) => updateContactInfo('officeHours', e.target.value)}
                  placeholder="Monday - Friday: 8:00 AM - 5:00 PM"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Manage the club's social media presence (leave empty to hide)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facebook">Facebook Page URL</Label>
                <Input
                  id="facebook"
                  value={contactContent.socialMedia.facebook || ''}
                  onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                  placeholder="https://facebook.com/your-page"
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter/X Profile URL</Label>
                <Input
                  id="twitter"
                  value={contactContent.socialMedia.twitter || ''}
                  onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                  placeholder="https://twitter.com/your-handle"
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram Profile URL</Label>
                <Input
                  id="instagram"
                  value={contactContent.socialMedia.instagram || ''}
                  onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                  placeholder="https://instagram.com/your-handle"
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn Page URL</Label>
                <Input
                  id="linkedin"
                  value={contactContent.socialMedia.linkedin || ''}
                  onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/your-page"
                />
              </div>
              <div>
                <Label htmlFor="telegram">Telegram Channel URL</Label>
                <Input
                  id="telegram"
                  value={contactContent.socialMedia.telegram || ''}
                  onChange={(e) => updateSocialMedia('telegram', e.target.value)}
                  placeholder="https://t.me/your-channel"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}