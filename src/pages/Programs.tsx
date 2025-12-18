import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen,
  Calendar,
  Newspaper,
  ArrowRight,
  Users,
  Target,
  Lightbulb,
  Award,
  FileText,
  Download,
  ExternalLink,
  Search,
  Clock,
  MapPin,
  ChevronRight,
  Mail,
  Bell,
  Scale,
  Trophy,
  Vote,
} from "lucide-react";

// Resources Data
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

const clubDocuments = [
  {
    title: "Club Constitution",
    description: "The founding document outlining our mission, structure, and operational guidelines.",
    type: "PDF",
    size: "450 KB",
  },
  {
    title: "Annual Report 2024",
    description: "Summary of our activities, achievements, and impact over the past year.",
    type: "PDF",
    size: "2.1 MB",
  },
  {
    title: "Membership Guidelines",
    description: "Requirements and benefits of becoming a club member.",
    type: "PDF",
    size: "320 KB",
  },
];

const externalLinks = [
  {
    title: "Federal Ethics and Anti-Corruption Commission",
    description: "Ethiopia's national body for combating corruption",
    url: "https://www.feacc.gov.et/",
  },
  {
    title: "Transparency International",
    description: "Global coalition against corruption",
    url: "https://www.transparency.org/",
  },
  {
    title: "United Nations Office on Drugs and Crime",
    description: "UN resources on anti-corruption",
    url: "https://www.unodc.org/unodc/en/corruption/",
  },
  {
    title: "African Union Anti-Corruption Framework",
    description: "Continental anti-corruption initiatives",
    url: "https://au.int/",
  },
];

const glossary = [
  {
    term: "Corruption",
    definition: "The abuse of entrusted power for private gain. It can be classified as grand, petty, or political depending on the amounts involved and the sector.",
  },
  {
    term: "Bribery",
    definition: "The offering, giving, receiving, or soliciting of any item of value to influence the actions of an official or other person in charge of a public or legal duty.",
  },
  {
    term: "Whistleblower",
    definition: "A person who exposes information about activity within an organization that is deemed illegal, unethical, or not correct.",
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
    definition: "The investigation or exercise of care that a reasonable person or organization is expected to take before entering into an agreement or decision.",
  },
];

// Events Data
const upcomingEvents = [
  {
    title: "Ethics Week 2025",
    date: "March 15-22, 2025",
    time: "Various Times",
    location: "Main Campus",
    description: "A comprehensive week of workshops, panel discussions, film screenings, and interactive activities focused on promoting ethical conduct and anti-corruption awareness.",
    type: "Major Event",
    attendees: 500,
  },
  {
    title: "Student Recruitment Drive",
    date: "February 1, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Student Center",
    description: "Join our club! Meet current members, learn about our activities, and sign up to become an ambassador for integrity on campus.",
    type: "Recruitment",
    attendees: 150,
  },
  {
    title: "Anti-Corruption Awareness Seminar",
    date: "January 28, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Auditorium Hall A",
    description: "Expert speakers from the Federal Ethics and Anti-Corruption Commission will discuss corruption prevention strategies and civic responsibility.",
    type: "Seminar",
    attendees: 200,
  },
  {
    title: "Workshop: Ethical Decision Making",
    date: "February 15, 2025",
    time: "10:00 AM - 12:00 PM",
    location: "Conference Room B",
    description: "Interactive workshop exploring ethical dilemmas and decision-making frameworks for students and future professionals.",
    type: "Workshop",
    attendees: 50,
  },
];

// News Data
const newsArticles = [
  {
    title: "Club Successfully Hosts First Annual Integrity Forum",
    date: "December 10, 2024",
    summary: "Over 300 students and faculty members participated in our inaugural Integrity Forum, featuring keynote speeches and breakout sessions on ethical leadership.",
    category: "Event Recap",
  },
  {
    title: "New Partnership with National Anti-Corruption Body",
    date: "November 25, 2024",
    summary: "The club has formalized a partnership with the Federal Ethics and Anti-Corruption Commission to enhance our educational programs and reporting mechanisms.",
    category: "Announcement",
  },
  {
    title: "Ethics Training Program Launches for Student Leaders",
    date: "November 15, 2024",
    summary: "A new comprehensive training program has been developed to equip student organization leaders with ethical leadership skills and integrity tools.",
    category: "Program Launch",
  },
  {
    title: "Club Recognized at National Student Conference",
    date: "October 30, 2024",
    summary: "Our club received recognition at the National Student Leadership Conference for outstanding contributions to promoting academic integrity.",
    category: "Achievement",
  },
  {
    title: "Monthly Integrity Workshop Series Announced",
    date: "October 15, 2024",
    summary: "Starting in November, we will host monthly workshops covering various aspects of ethical conduct, transparency, and anti-corruption strategies.",
    category: "Announcement",
  },
  {
    title: "Student Survey Reveals Strong Support for Anti-Corruption Initiatives",
    date: "September 28, 2024",
    summary: "A recent campus-wide survey shows that 87% of students support stronger measures to combat corruption and promote integrity in academic settings.",
    category: "Research",
  },
];

const programStats = [
  { number: "500+", label: "Students Reached", icon: Users },
  { number: "50+", label: "Resources Available", icon: FileText },
  { number: "25+", label: "Events Hosted", icon: Calendar },
  { number: "100+", label: "News Articles", icon: Newspaper },
];

// Election Results Component
function ElectionResults() {
  const [elections, setElections] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElectionResults();
  }, []);

  const fetchElectionResults = async () => {
    setLoading(true);
    
    // Get closed elections
    const { data: electionsData } = await supabase
      .from('elections')
      .select('*')
      .eq('status', 'closed')
      .order('created_at', { ascending: false });

    if (electionsData && electionsData.length > 0) {
      setElections(electionsData);
      
      // Get results for the most recent closed election
      const latestElection = electionsData[0];
      try {
        const { data: resultsData, error } = await (supabase as any).rpc('get_election_results', {
          election_uuid: latestElection.id
        });
        
        if (error) {
          console.error('Error fetching election results:', error);
          setResults([]);
        } else if (resultsData) {
          setResults(resultsData);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Error calling get_election_results:', error);
        setResults([]); // Set empty array on error
      }
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading election results...</p>
      </div>
    );
  }

  if (elections.length === 0) {
    return null; // Don't show section if no closed elections
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-orange-dark flex items-center justify-center">
          <Trophy className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Election Results
          </h3>
          <p className="text-muted-foreground">
            Results from recent club elections
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {elections.slice(0, 3).map((election) => (
          <Card key={election.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-orange-light/5 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{election.title}</CardTitle>
                  <p className="text-muted-foreground mt-1">
                    Completed on {new Date(election.end_date || election.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Trophy className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {results.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {['president', 'vice_president', 'secretary'].map((position) => {
                    const positionResults = results.filter(r => r.position === position);
                    const winner = positionResults.find(r => r.rank === 1);
                    
                    return (
                      <div key={position} className="text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                          <Vote className="w-8 h-8 text-primary" />
                        </div>
                        <h4 className="font-semibold text-foreground mb-2">
                          {position === 'president' ? 'President' : 
                           position === 'vice_president' ? 'Vice President' : 'Secretary'}
                        </h4>
                        {winner ? (
                          <>
                            <p className="font-medium text-primary mb-1">{winner.candidate_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {winner.vote_count} votes ({winner.percentage}%)
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">No results available</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Vote className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Results are being processed</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function ProgramsPage() {
  const [email, setEmail] = useState("");
  useScrollAnimation();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive updates about our programs.",
      });
      setEmail("");
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/70 to-gray-900/60 dark:from-gray-950/90 dark:via-gray-950/80 dark:to-gray-950/70 z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920')] bg-cover bg-center opacity-30 dark:opacity-20" />
        </div>

        <div className="absolute top-10 right-[10%] w-32 h-32 bg-primary/30 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-20 right-[20%] w-48 h-48 bg-primary/20 rounded-[40%] blur-2xl z-0" />

        <div className="container mx-auto px-4 py-20 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-medium">
                Our Programs
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Programs & <span className="text-primary">Initiatives</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
              Explore our comprehensive programs designed to promote ethics, integrity, and transparency. 
              From educational resources to engaging events and the latest news.
            </p>
          </div>
        </div>
      </section>

      {/* Program Statistics */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {programStats.map((stat, index) => (
              <div
                key={index}
                className="scroll-fade-up bg-card rounded-xl p-6 text-center shadow-card border border-border hover:shadow-card-hover transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-display font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Programs Tabs */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                Our Programs
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comprehensive Program Portfolio
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our three main program areas designed to educate, engage, and inform our community about ethics and integrity.
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="resources" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-card border border-border rounded-xl p-1">
                <TabsTrigger value="resources" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <BookOpen className="w-4 h-4" />
                  Resources
                </TabsTrigger>
                <TabsTrigger value="events" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Calendar className="w-4 h-4" />
                  Events
                </TabsTrigger>
                <TabsTrigger value="news" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Newspaper className="w-4 h-4" />
                  News
                </TabsTrigger>
              </TabsList>

              {/* Resources Tab Content */}
              <TabsContent value="resources" className="space-y-16">
                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                  <Input
                    type="search"
                    placeholder="Search resources, policies, and documents..."
                    className="pl-12 h-14 bg-white border-2 border-gray-200 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl shadow-sm transition-all"
                  />
                </div>

                {/* University Policies */}
                <div>
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
                      <Scale className="w-4 h-4 text-primary" />
                      <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                        Official Documents
                      </span>
                    </div>
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
                          <p className="text-muted-foreground">{doc.description}</p>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {doc.size} • {doc.type}
                          </span>
                          <Button variant="outline" size="sm" className="gap-2 group-hover:bg-primary/5">
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Club Documents */}
                <div>
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
                          <p className="text-muted-foreground">{doc.description}</p>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {doc.size} • {doc.type}
                          </span>
                          <Button variant="outline" size="sm" className="gap-2 group-hover:bg-primary/5">
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Glossary */}
                <div>
                  <div className="text-center mb-12">
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                      Key Terminology Glossary
                    </h3>
                    <p className="text-muted-foreground">
                      Understanding the language of ethics and anti-corruption
                    </p>
                  </div>

                  <div className="space-y-4 max-w-4xl mx-auto">
                    {glossary.map((item, index) => (
                      <div
                        key={index}
                        className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="font-display font-semibold text-foreground mb-2">
                              {item.term}
                            </h4>
                            <p className="text-muted-foreground leading-relaxed">
                              {item.definition}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Events Tab Content */}
              <TabsContent value="events" className="space-y-16">
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-center gap-4 mb-10 scroll-animate">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-orange-dark flex items-center justify-center">
                      <Calendar className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                        Upcoming Events
                      </h3>
                      <p className="text-muted-foreground">
                        Mark your calendar for these important activities
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    {upcomingEvents.map((event, index) => (
                      <div
                        key={index}
                        className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all group cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Calendar className="w-10 h-10 text-primary" />
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                {event.type}
                              </span>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Users className="w-4 h-4" />
                                <span>{event.attendees} expected</span>
                              </div>
                            </div>

                            <h4 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                              {event.title}
                            </h4>

                            <p className="text-muted-foreground mb-4">
                              {event.description}
                            </p>

                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="w-4 h-4 text-primary" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span>{event.location}</span>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-border">
                              <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80 p-0 h-auto">
                                Learn More
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Election Results Section */}
                <ElectionResults />

                {/* Newsletter Signup for Events */}
                <div className="relative py-20 bg-gradient-to-br from-primary via-primary/95 to-orange-dark overflow-hidden rounded-3xl">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
                  
                  <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl mx-auto text-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                        <Bell className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                        Stay Updated
                      </h3>
                      <p className="text-lg text-white/90 mb-8">
                        Subscribe to receive updates about upcoming events and workshops.
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
                        <Button type="submit" size="lg" className="bg-foreground text-white hover:bg-foreground/90 shadow-lg">
                          Subscribe
                        </Button>
                      </form>

                      <p className="text-sm text-white/70 mt-4">
                        We respect your privacy. Unsubscribe at any time.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* News Tab Content */}
              <TabsContent value="news" className="space-y-16">
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-orange-dark flex items-center justify-center shadow-md">
                      <Newspaper className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                        Latest News
                      </h3>
                      <p className="text-muted-foreground">
                        Recent updates and announcements from our club
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {newsArticles.map((article, index) => (
                      <div
                        key={index}
                        className="bg-card rounded-xl p-5 border border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer shadow-md hover:shadow-xl"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {article.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {article.date}
                          </span>
                        </div>
                        <h4 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          {article.summary}
                        </p>
                        <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read More
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Newsletter Signup for News */}
                <div className="relative py-16 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-3xl">
                  <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-light/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
                  </div>
                  
                  <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto">
                      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl border border-gray-200/50">
                        <div className="text-center mb-6">
                          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-orange-dark mb-6 shadow-lg">
                            <Bell className="w-10 h-10 text-white" />
                          </div>
                          <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Stay Informed
                          </h3>
                          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                            Subscribe to our newsletter to receive the latest news and updates.
                          </p>
                        </div>

                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                          <div className="flex-1 relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                            <Input
                              type="email"
                              placeholder="Enter your email address"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="pl-12 h-14 bg-white border-2 border-gray-200 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl shadow-sm transition-all"
                              required
                            />
                          </div>
                          <Button 
                            type="submit" 
                            size="lg"
                            className="h-14 px-8 bg-gradient-to-r from-primary to-orange-dark text-white hover:shadow-lg transition-all rounded-xl font-semibold"
                          >
                            Subscribe
                          </Button>
                        </form>

                        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          <span>We respect your privacy. Unsubscribe at any time.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </Layout>
  );
}