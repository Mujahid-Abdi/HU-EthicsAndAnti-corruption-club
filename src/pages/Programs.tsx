import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  BookOpen,
  Target,
  Users,
  Calendar,
  NewspaperIcon,
  Vote,
  Trophy,
  Bell,
  Mail,
  ChevronRight,
  ArrowRight,
  Clock,
  MapPin,
  Search,
  Download,
  FileText,
  Scale
} from "lucide-react";

// Program Statistics Data
const programStats = [
  {
    icon: Users,
    number: "500+",
    label: "Students Reached",
  },
  {
    icon: FileText,
    number: "50+",
    label: "Resources Available",
  },
  {
    icon: Calendar,
    number: "25+",
    label: "Events Hosted",
  },
  {
    icon: NewspaperIcon,
    number: "100+",
    label: "News Articles",
  },
];

// News Articles Data
const newsArticles = [
  {
    title: "Student Survey Reveals Strong Support for Anti-Corruption Initiatives",
    summary: "A recent campus-wide survey shows that 87% of students support stronger measures to combat corruption and promote integrity in academic settings.",
    category: "Research",
    date: "September 28, 2024",
  },
  {
    title: "Monthly Integrity Workshops Announced",
    summary: "Starting in November, we will host monthly workshops covering various aspects of ethical conduct, transparency, and anti-corruption strategies.",
    category: "Announcement",
    date: "October 15, 2024",
  },
  {
    title: "Club Recognized at National Student Leadership Conference",
    summary: "Our club received recognition at the National Student Leadership Conference for outstanding contributions promoting academic integrity.",
    category: "Achievement",
    date: "October 30, 2024",
  },
  {
    title: "Ethics Training Program Launch",
    summary: "A new comprehensive training program has been developed to equip student leaders with ethical leadership skills and integrity tools.",
    category: "Program Launch",
    date: "November 15, 2024",
  },
  {
    title: "New Partnership with National Anti-Corruption Body",
    summary: "The club has formalized a partnership with the Federal Ethics and Anti-Corruption Commission to enhance our educational programs and reporting mechanisms.",
    category: "Announcement",
    date: "November 25, 2024",
  },
  {
    title: "Club Successfully Hosts First Annual Integrity Forum",
    summary: "Over 300 students and faculty members participated in our inaugural Integrity Forum, featuring keynote speeches and breakout sessions on ethical leadership.",
    category: "Event Recap",
    date: "December 10, 2024",
  },
];

// Upcoming Events Data
const upcomingEvents = [
  {
    title: "Workshop: Ethical Decision Making",
    date: "February 15, 2025",
    time: "10:00 AM - 12:00 PM",
    location: "Conference Room B",
    type: "Workshop",
    attendees: 50,
    description: "Interactive workshop exploring ethical frameworks for students and future professionals.",
  },
  {
    title: "Anti-Corruption Awareness Seminar",
    date: "January 28, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Main Auditorium",
    type: "Seminar",
    attendees: 150,
    description: "Expert speakers from the Federal Ethics and Anti-Corruption Commission will discuss prevention strategies.",
  },
  {
    title: "Student Recruitment Drive",
    date: "February 10, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Student Center",
    type: "Recruitment",
    attendees: 500,
    description: "Join our club! Meet current members, learn about our activities, and sign up to become an ambassador for integrity on campus.",
  },
  {
    title: "Ethics Week 2025",
    date: "March 15-22, 2025",
    time: "Various Times",
    location: "Main Campus",
    type: "Major Event",
    attendees: 2000,
    description: "A comprehensive week of workshops, panel discussions, film screenings, and interactive activities focused on promoting ethical conduct and anti-corruption awareness.",
  },
];

// Key Terms Glossary Data
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

// Club Documents Data
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

// University Policies Data
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

// Election Results Component
const ElectionResults = () => {
  const [elections, setElections] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchElectionResults = async () => {
    try {
      setLoading(true);
      
      // Get closed elections from Firebase
      const electionsQuery = query(
        collection(db, 'elections'),
        where('status', '==', 'closed')
      );
      const electionsSnapshot = await getDocs(electionsQuery);
      const electionsData = electionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (electionsData.length > 0) {
        // Get results for the most recent closed election
        const latestElection = electionsData[0];
        
        // Get votes for this election
        const votesQuery = query(
          collection(db, 'votes'),
          where('electionId', '==', latestElection.id)
        );
        const votesSnapshot = await getDocs(votesQuery);
        const votes = votesSnapshot.docs.map(doc => doc.data());

        // Calculate results
        const candidateVotes: { [key: string]: number } = {};
        const positionTotals: { [key: string]: number } = {};

        votes.forEach((vote: any) => {
          Object.entries(vote.votes || {}).forEach(([position, candidateId]) => {
            const key = `${position}-${candidateId}`;
            candidateVotes[key] = (candidateVotes[key] || 0) + 1;
            positionTotals[position] = (positionTotals[position] || 0) + 1;
          });
        });

        // Format results
        const formattedResults: any[] = [];
        ['president', 'vice_president', 'secretary'].forEach(position => {
          const positionResults = Object.entries(candidateVotes)
            .filter(([key]) => key.startsWith(position))
            .sort(([, a], [, b]) => (b as number) - (a as number));

          positionResults.forEach(([key, voteCount], index) => {
            const candidateId = key.split('-')[1];
            const total = positionTotals[position] || 1;
            const percentage = Math.round(((voteCount as number) / total) * 100);
            
            formattedResults.push({
              position,
              candidate_name: `Candidate ${candidateId}`,
              vote_count: voteCount,
              percentage,
              rank: index + 1
            });
          });
        });

        setResults(formattedResults);
        setElections(electionsData);
      }
    } catch (error) {
      console.error('Error fetching election results:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElectionResults();
  }, []);

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
      <div className="flex items-center gap-4 mb-10 scroll-animate">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-orange-dark flex items-center justify-center">
          <Trophy className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
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
                  <CardTitle className="text-lg">{election.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Completed on {new Date(election.createdAt || election.endDate).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Trophy className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {['president', 'vice_president', 'secretary'].map(position => {
                  const positionResults = results.filter(r => r.position === position);
                  const winner = positionResults.find(r => r.rank === 1);
                  
                  return (
                    <div key={position}>
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 mx-auto">
                        <Vote className="w-8 h-8 text-primary" />
                      </div>
                      <h4 className="font-semibold text-center mb-2">
                        {position === 'president' ? 'President' : position === 'vice_president' ? 'Vice President' : 'Secretary'}
                      </h4>
                      {winner ? (
                        <>
                          <p className="font-medium text-primary text-center mb-1">{winner.candidate_name}</p>
                          <p className="text-sm text-muted-foreground text-center">
                            {winner.vote_count} votes ({winner.percentage}%)
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center">No results available</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default function Programs() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
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
      <section className="relative min-h-[25vh] flex items-center overflow-hidden bg-gradient-to-r from-gray-900/80 via-gray-900/70 to-gray-900/60 dark:from-gray-950/90 dark:via-gray-950/80 dark:to-gray-950/70">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2084&q=80')] bg-cover bg-center opacity-30 dark:opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/70 to-gray-900/60 dark:from-gray-950/90 dark:via-gray-950/80 dark:to-gray-950/70"></div>
        
        {/* Background decorations */}
        <div className="absolute top-10 right-[10%] w-32 h-32 bg-primary/30 rounded-full blur-3xl z-0"></div>
        <div className="absolute bottom-20 left-[20%] w-48 h-48 bg-orange-light/20 rounded-[40%] blur-2xl z-0"></div>
        
        <div className="container mx-auto px-4 pt-16 pb-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6 animate-fade-in">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Our Programs & Initiatives</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Programs & <span className="text-primary">Initiatives</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
              Explore our comprehensive programs designed to promote ethics, integrity, and transparency. 
              From educational resources to engaging activities, we foster accountability within the university community.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Tabs - Next section */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="resources" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-card border border-border rounded-xl p-1 max-w-2xl mx-auto">
                <TabsTrigger value="resources" className="data-[state=active]:bg-primary data-[state=active]:text-white gap-2">
                  <BookOpen className="w-4 h-4" />
                  Resources
                </TabsTrigger>
                <TabsTrigger value="events" className="data-[state=active]:bg-primary data-[state=active]:text-white gap-2">
                  <Calendar className="w-4 h-4" />
                  Events
                </TabsTrigger>
                <TabsTrigger value="news" className="data-[state=active]:bg-primary data-[state=active]:text-white gap-2">
                  <NewspaperIcon className="w-4 h-4" />
                  News
                </TabsTrigger>
              </TabsList>

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

                {/* Program Statistics */}
                <section className="py-16 space-y-16">
                  <div className="max-w-4xl mx-auto text-center mb-12">
                    <div className="flex items-center gap-4 mb-10 justify-center">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-orange-dark flex items-center justify-center">
                        <Scale className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                          Program Statistics
                        </h3>
                        <p className="text-muted-foreground">
                          Results being processed
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                      {programStats.map((stat, index) => (
                        <div
                          key={index}
                          className="scroll-fade-up bg-card p-6 text-center rounded-xl border border-border shadow-card hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                            <stat.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-wrap items-center justify-center gap-2 mb-3">
                            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                              {stat.label}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-display text-3xl font-bold text-primary mb-2">{stat.number}</p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

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

              {/* Events Tab Content */}
              <TabsContent value="events" className="space-y-16 py-16">
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-center gap-4 mb-10 scroll-animate">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-orange-dark flex items-center justify-center">
                      <Calendar className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                        Upcoming Events
                      </h3>
                      <p className="text-muted-foreground">
                        Mark your calendar for these important activities
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    {upcomingEvents.map((event, index) => (
                      <Card key={index} className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
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
                            </div>
                            <h4 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                              {event.title}
                            </h4>
                            <p className="text-muted-foreground mb-4">{event.description}</p>
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
                          </div>
                          <div className="mt-4 flex-shrink-0">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="w-4 h-4" />
                              <span>{event.attendees} expected</span>
                            </div>
                            <Button variant="ghost" className="text-primary hover:text-primary/80 gap-2 h-auto p-0 mt-4">
                              Learn More
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Election Results Section */}
                <ElectionResults />
              </TabsContent>

              {/* News Tab Content */}
              <TabsContent value="news" className="space-y-16 py-16">
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-center gap-4 mb-10 scroll-animate">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-orange-dark flex items-center justify-center">
                      <NewspaperIcon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                        Latest News
                      </h3>
                      <p className="text-muted-foreground">
                        Recent updates and announcements from our club
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {newsArticles.map((article, index) => (
                      <Card key={index} className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {article.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {article.date}
                          </span>
                        </div>
                        <h4 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4 rounded">{article.summary}</p>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                          Read More
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Newsletter Signup for News */}
                <section className="relative py-16 bg-gradient-to-br from-primary to-orange-dark rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-light/20 rounded-full blur-3xl"></div>
                  </div>
                  <div className="relative z-10 px-4">
                    <div className="max-w-3xl mx-auto text-center">
                      <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                        <Bell className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                        Stay Informed
                      </h3>
                      <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
                        Subscribe to our newsletter to receive the latest news and updates about upcoming events.
                      </p>
                      <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <div className="flex-1 relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                          <Input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="pl-12 h-14 bg-white border-gray-200 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl shadow-lg transition-all"
                          />
                        </div>
                        <Button
                          type="submit"
                          size="lg"
                          className="h-14 px-8 bg-gradient-to-r from-primary to-orange-dark hover:shadow-lg transition:shadow-xl rounded-xl font-semibold text-white"
                        >
                          Subscribe
                        </Button>
                      </form>
                      <p className="text-sm text-white/70 mt-4 max-w-2xl mx-auto">
                        We respect your privacy. Unsubscribe at any time.
                      </p>
                    </div>
                  </div>
                </section>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </Layout>
  );
}