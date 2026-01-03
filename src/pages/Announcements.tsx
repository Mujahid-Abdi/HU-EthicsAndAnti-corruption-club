import { useState, useEffect } from 'react';
import { FirestoreService } from '@/lib/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { Loader2, Megaphone, Search, Clock, AlertTriangle } from 'lucide-react';
import { format, isAfter } from 'date-fns';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  published: boolean | null;
  expiresAt: any | null;
  createdAt: any;
}

const priorityConfig = {
  low: { label: 'Low', color: 'bg-gray-100 text-gray-800', icon: null },
  medium: { label: 'Medium', color: 'bg-blue-100 text-blue-800', icon: null },
  high: { label: 'High', color: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const data = await FirestoreService.getAll('announcements');
      // Filter published and non-expired announcements
      const validAnnouncements = data.filter((announcement: Announcement) => {
        if (!announcement.published) return false;
        if (announcement.expiresAt) {
          const expiryDate = new Date(announcement.expiresAt.seconds * 1000);
          return !isAfter(new Date(), expiryDate);
        }
        return true;
      });
      setAnnouncements(validAnnouncements as Announcement[]);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
    setIsLoading(false);
  };

  // Filter announcements based on search term
  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort by priority (urgent first) and then by creation date
  const sortedAnnouncements = filteredAnnouncements.sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // If same priority, sort by creation date (newest first)
    return new Date(b.createdAt.seconds * 1000).getTime() - new Date(a.createdAt.seconds * 1000).getTime();
  });

  return (
    <>
      {/* Header Section */}
      <section className="pt-24 pb-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
              <Megaphone className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                Latest Updates
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Announcements
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay informed with the latest announcements and important updates from the Ethics and Anti-Corruption Club.
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb and Search */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <Breadcrumb 
            items={[
              { label: "Home", href: "/" },
              { label: "Announcements" }
            ]} 
          />
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <Input
              type="search"
              placeholder="Search announcements..."
              className="pl-12 h-14 bg-white border-2 border-gray-200 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Announcements List */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sortedAnnouncements.length === 0 ? (
            <div className="text-center py-12">
              <Megaphone className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Announcements</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'No announcements match your search.' : 'There are no announcements at this time.'}
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {sortedAnnouncements.map((announcement) => {
                const priorityInfo = priorityConfig[announcement.priority];
                const PriorityIcon = priorityInfo.icon;
                
                return (
                  <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{announcement.title}</CardTitle>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {format(new Date(announcement.createdAt.seconds * 1000), 'PPP')}
                            </div>
                            {announcement.expiresAt && (
                              <div className="flex items-center gap-1 text-orange-600">
                                <AlertTriangle className="w-4 h-4" />
                                Expires {format(new Date(announcement.expiresAt.seconds * 1000), 'PPP')}
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge className={priorityInfo.color}>
                          {PriorityIcon && <PriorityIcon className="w-3 h-3 mr-1" />}
                          {priorityInfo.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        {announcement.content.split('\n').map((paragraph, index) => (
                          <p key={index} className="mb-3 last:mb-0 text-muted-foreground leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}