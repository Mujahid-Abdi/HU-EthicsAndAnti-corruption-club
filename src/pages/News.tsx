import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FirestoreService, Collections } from '@/lib/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, 
  Newspaper, 
  Calendar, 
  ArrowRight, 
  Bell, 
  Mail, 
  BookOpen,
  FileText,
  Download,
  Search,
  Scale,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';

// Key Terms Glossary Data (moved from Programs page)
const glossary = [
  {
    term: "Corruption",
    definition: "The abuse of entrusted power for private gain. It can be classified as grand, petty, and political, depending on the amounts of money involved and the sector where it occurs.",
  },
  {
    term: "Bribery",
    definition: "The offering, giving, receiving, or soliciting of any item of value to influence the actions of an official or other person in charge of a public or legal duty.",
  },
  {
    term: "Whistleblower",
    definition: "A person who exposes information or activity within an organization that is deemed illegal, unethical, or not correct.",
  },
  {
    term: "Conflict of Interest",
    definition: "A situation in which a person's private interests interfere with their professional duties and responsibilities.",
  },
  {
    term: "Academic Integrity",
    definition: "The commitment to and demonstration of honest and moral behavior in an academic setting, including avoiding plagiarism and cheating.",
  },
  {
    term: "Due Diligence",
    definition: "The investigation or exercise of care that a reasonable person or organization is expected to take before entering into an agreement or contract.",
  },
];

// Club Documents Data (moved from Programs page)
const clubDocuments = [
  {
    title: "Membership Guidelines",
    description: "Requirements and benefits of becoming a club member.",
    type: "PDF",
    size: "3.2 MB",
  },
  {
    title: "Annual Report 2024",
    description: "Summary of our activities, achievements, and impact over the past year.",
    type: "PDF",
    size: "2.1 MB",
  },
  {
    title: "Club Constitution",
    description: "The founding document outlining our mission, structure, and operational guidelines.",
    type: "PDF",
    size: "450 KB",
  },
];

// University Policies Data (moved from Programs page)
const universityPolicies = [
  {
    title: "University Code of Conduct",
    description: "Comprehensive guidelines for ethical behavior expected of all students, faculty, and staff.",
    type: "PDF",
    size: "1.2 MB",
  },
  {
    title: "Academic Integrity Policy",
    description: "Detailed policy on academic honesty, plagiarism prevention, and disciplinary procedures.",
    type: "PDF",
    size: "890 KB",
  },
  {
    title: "Disciplinary Procedures Manual",
    description: "Step-by-step guide to the university's disciplinary process and appeal mechanisms.",
    type: "PDF",
    size: "1.5 MB",
  },
  {
    title: "Anti-Harassment Policy",
    description: "Policy addressing all forms of harassment and the reporting/response procedures.",
    type: "PDF",
    size: "720 KB",
  },
];

// Announcements Data
const announcements = [
  {
    id: 'ann-1',
    title: "New Office Hours Effective January 2025",
    content: "Starting January 1, 2025, our office hours will be Monday-Friday 8:00 AM - 5:00 PM, Saturday 9:00 AM - 12:00 PM. Sunday closed.",
    type: "Office Update",
    created_at: "2024-12-15",
    priority: "high"
  },
  {
    id: 'ann-2', 
    title: "Ethics Week 2025 Registration Now Open",
    content: "Registration is now open for Ethics Week 2025 (March 15-22). All students are encouraged to participate in workshops, seminars, and activities.",
    type: "Event Registration",
    created_at: "2024-12-10",
    priority: "high"
  },
  {
    id: 'ann-3',
    title: "Updated Reporting Guidelines",
    content: "We have updated our anonymous reporting guidelines to provide clearer instructions and better protection for whistleblowers.",
    type: "Policy Update",
    created_at: "2024-12-05",
    priority: "medium"
  },
  {
    id: 'ann-4',
    title: "Holiday Schedule Notice",
    content: "Please note that our office will be closed from December 25, 2024 to January 2, 2025 for the holiday break.",
    type: "Schedule",
    created_at: "2024-12-01",
    priority: "low"
  }
];
const staticNewsArticles = [
  {
    id: 'static-1',
    title: "Student Survey Reveals Strong Support for Anti-Corruption Initiatives",
    excerpt: "A recent campus-wide survey shows that 87% of students support stronger measures to combat corruption and promote integrity in academic settings.",
    category: "Research",
    createdAt: "2024-09-28",
    imageUrl: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800",
  },
  {
    id: 'static-2',
    title: "Monthly Integrity Workshops Announced",
    excerpt: "Starting in November, we will host monthly workshops covering various aspects of ethical conduct, transparency, and anti-corruption strategies.",
    category: "Announcement",
    createdAt: "2024-10-15",
    imageUrl: "https://images.unsplash.com/photo-1544531585-9837bd664d0f?w=800",
  },
  {
    id: 'static-3',
    title: "Club Recognized at National Student Leadership Conference",
    excerpt: "Our club received recognition at the National Student Leadership Conference for outstanding contributions promoting academic integrity.",
    category: "Achievement",
    createdAt: "2024-10-30",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
  },
  {
    id: 'static-4',
    title: "Ethics Training Program Launch",
    excerpt: "A new comprehensive training program has been developed to equip student leaders with ethical leadership skills and integrity tools.",
    category: "Program Launch",
    createdAt: "2024-11-15",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
  },
  {
    id: 'static-5',
    title: "New Partnership with National Anti-Corruption Body",
    excerpt: "The club has formalized a partnership with the Federal Ethics and Anti-Corruption Commission to enhance our educational programs and reporting mechanisms.",
    category: "Announcement",
    createdAt: "2024-11-25",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800",
  },
  {
    id: 'static-6',
    title: "Club Successfully Hosts First Annual Integrity Forum",
    excerpt: "Over 300 students and faculty members participated in our inaugural Integrity Forum, featuring keynote speeches and breakout sessions on ethical leadership.",
    category: "Event Recap",
    createdAt: "2024-12-10",
    imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800",
  },
];

interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  published: boolean | null;
  createdAt: any;
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchPublishedNews();
  }, []);

  const fetchPublishedNews = async () => {
    try {
      const data = await FirestoreService.getAll(Collections.NEWS);
      const publishedNews = data
        .filter((item: any) => item.published)
        .map((item: any) => ({
          ...item,
          imageUrl: item.imageUrl || item.image_url,
          createdAt: item.createdAt || item.created_at,
        }))
        .sort((a: any, b: any) => {
          const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(0);
          const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
      setNews(publishedNews as NewsItem[]);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
    setIsLoading(false);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive updates about our latest news.",
      });
      setEmail("");
    }
  };

  // Combine database news with static articles
  const allNews = [...news, ...staticNewsArticles].sort((a, b) => {
    const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(a.createdAt || '');
    const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(b.createdAt || '');
    return dateB.getTime() - dateA.getTime();
  });

  if (isLoading) {
    return (
      <>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header Section */}
      <section className="pt-24 pb-8 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
              <Newspaper className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                News & Information
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              News & Resources
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay informed with our latest news, announcements, and access important resources and documents.
            </p>
          </div>
          
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="news" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-card border border-border rounded-xl p-1 max-w-2xl mx-auto">
                <TabsTrigger value="news" className="data-[state=active]:bg-primary data-[state=active]:text-white gap-2">
                  <Newspaper className="w-4 h-4" />
                  News
                </TabsTrigger>
                <TabsTrigger value="announcements" className="data-[state=active]:bg-primary data-[state=active]:text-white gap-2">
                  <Bell className="w-4 h-4" />
                  Announcements
                </TabsTrigger>
                <TabsTrigger value="resources" className="data-[state=active]:bg-primary data-[state=active]:text-white gap-2">
                  <BookOpen className="w-4 h-4" />
                  Resources
                </TabsTrigger>
              </TabsList>

              {/* News Tab Content */}
              <TabsContent value="news" className="space-y-16 py-16">
                {isLoading ? (
                  <div className="min-h-[40vh] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : allNews.length === 0 ? (
                  <Card className="max-w-md mx-auto">
                    <CardContent className="py-16 text-center">
                      <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No News Yet</h3>
                      <p className="text-muted-foreground">
                        Check back soon for updates and announcements from our club.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allNews.map((item) => (
                      <Link key={item.id} to={`/news/${item.id}`}>
                        <Card className="h-full overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border">
                          {item.imageUrl && (
                            <div className="aspect-video overflow-hidden">
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <CardContent className={`p-6 ${!item.imageUrl ? 'pt-8' : ''}`}>
                            {item.createdAt && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                <Calendar className="w-4 h-4" />
                                {format(
                                  item.createdAt.seconds ? new Date(item.createdAt.seconds * 1000) : new Date(item.createdAt), 
                                  'MMMM d, yyyy'
                                )}
                              </div>
                            )}
                            <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                              {item.title}
                            </h3>
                            {item.excerpt && (
                              <p className="text-muted-foreground line-clamp-3 mb-4">
                                {item.excerpt}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-primary text-sm font-medium">
                              Read More
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Announcements Tab Content */}
              <TabsContent value="announcements" className="space-y-16 py-16">
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                      <Bell className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                        Important Announcements
                      </h3>
                      <p className="text-muted-foreground">
                        Stay updated with important notices and announcements
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <Card key={announcement.id} className="border border-border hover:border-primary/50 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-display text-lg font-semibold text-foreground">
                                  {announcement.title}
                                </h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  announcement.priority === 'high' ? 'bg-red-100 text-red-700' :
                                  announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {announcement.priority} priority
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {announcement.type} • {format(new Date(announcement.created_at), 'MMMM d, yyyy')}
                              </p>
                              <p className="text-muted-foreground">
                                {announcement.content}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Resources Tab Content */}
              <TabsContent value="resources" className="space-y-16 py-16">
                {/* Search Bar */}
                <div className="max-w-2xl mx-auto relative">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                    <Input
                      type="search"
                      placeholder="Search policies, documents, and resources..."
                      className="pl-12 h-14 bg-white border-2 border-gray-200 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl shadow-sm transition-all"
                    />
                  </div>
                </div>

                {/* Key Terminology Glossary */}
                <div className="text-center mb-12">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                    Key Terminology Glossary
                  </h3>
                  <p className="text-muted-foreground">
                    Understanding the language of ethics and anti-corruption
                  </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-4">
                  {glossary.map((item, index) => (
                    <Card key={index} className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-colors">
                      <div className="flex items-start gap-4">
                        <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-display font-semibold text-foreground mb-2">{item.term}</h4>
                          <p className="text-muted-foreground leading-relaxed">{item.definition}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Club Documents */}
                <div className="text-center mb-12">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                    Club Documents
                  </h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Essential documents and reports from our club
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
                  {clubDocuments.map((doc, index) => (
                    <Card key={index} className="group hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <CardTitle className="text-lg">{doc.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="flex justify-between items-center">
                        <div>
                          <p className="text-muted-foreground text-sm">{doc.description}</p>
                          <span className="text-xs text-muted-foreground">
                            {doc.size} • {doc.type}
                          </span>
                        </div>
                        <Button variant="outline" size="sm" className="group-hover:bg-primary/5 gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* University Policies */}
                <div className="text-center mb-12">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                    University Policies
                  </h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Official documents and guidelines from Haramaya University
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
                  {universityPolicies.map((doc, index) => (
                    <Card key={index} className="group hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <CardTitle className="text-lg">{doc.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="flex justify-between items-center">
                        <div>
                          <p className="text-muted-foreground text-sm">{doc.description}</p>
                          <span className="text-xs text-muted-foreground">
                            {doc.size} • {doc.type}
                          </span>
                        </div>
                        <Button variant="outline" size="sm" className="group-hover:bg-primary/5 gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-br from-primary via-primary/95 to-orange-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Subscribe to our newsletter to receive the latest news, announcements, and updates directly in your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 bg-white border-0 text-foreground placeholder:text-muted-foreground shadow-lg"
                  required
                />
              </div>
              <Button 
                type="submit" 
                size="lg"
                className="bg-foreground text-white hover:bg-foreground/90 shadow-lg"
              >
                Subscribe
              </Button>
            </form>

            <p className="text-sm text-white/70 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
