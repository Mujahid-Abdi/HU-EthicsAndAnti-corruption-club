import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FirestoreService, Collections } from "@/lib/firestore";
import {
  BookOpen,
  Target,
  Users,
  Calendar,
  Bell,
  Mail,
  ChevronRight,
  ArrowRight,
  Clock,
  MapPin,
  Search,
  Download,
  FileText,
  Scale,
  Loader2
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

export default function Programs() {
  const [email, setEmail] = useState("");
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [pastEvents, setPastEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isVotingEnabled } = useSystemSettings();
  useScrollAnimation();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await FirestoreService.getAll(Collections.EVENTS);
      const currentDate = new Date();
      
      const upcoming = data.filter((event: any) => {
        const eventDate = event.date ? new Date(event.date) : new Date();
        return eventDate >= currentDate;
      }).sort((a: any, b: any) => {
        const dateA = new Date(a.date || '');
        const dateB = new Date(b.date || '');
        return dateA.getTime() - dateB.getTime();
      });

      const past = data.filter((event: any) => {
        const eventDate = event.date ? new Date(event.date) : new Date();
        return eventDate < currentDate;
      }).sort((a: any, b: any) => {
        const dateA = new Date(a.date || '');
        const dateB = new Date(b.date || '');
        return dateB.getTime() - dateA.getTime();
      });

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (error) {
      console.error('Error fetching events:', error);
      // Fallback to static events if Firebase fails
      setUpcomingEvents([
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
      ]);
    } finally {
      setLoading(false);
    }
  };

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
    <>
      {/* Navigation Tabs */}
      <section className="pt-24 pb-8 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                Events & Activities
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Events & Activities
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our upcoming events, past activities, and election information.
            </p>
          </div>
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="events" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-card border border-border rounded-xl p-1 max-w-2xl mx-auto">
                <TabsTrigger value="events" className="data-[state=active]:bg-primary data-[state=active]:text-white gap-2">
                  <Calendar className="w-4 h-4" />
                  Upcoming Events
                </TabsTrigger>
                <TabsTrigger value="past-events" className="data-[state=active]:bg-primary data-[state=active]:text-white gap-2">
                  <Clock className="w-4 h-4" />
                  Past Events
                </TabsTrigger>
              </TabsList>

              {/* Upcoming Events Tab Content */}
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

                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : upcomingEvents.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h4 className="text-xl font-semibold text-foreground mb-2">No Upcoming Events</h4>
                      <p className="text-muted-foreground">
                        Check back later for new events and activities.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-6 justify-between">
                      {upcomingEvents.map((event, index) => (
                        <Card key={index} className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
                          <div className="flex flex-col md:flex-row md:items-start gap-6 justify-between">
                            <div className="flex-shrink-0">
                              <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Calendar className="w-10 h-10 text-primary" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-3 mb-3">
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                  {event.type || 'Event'}
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
                                {event.time && (
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span>{event.time}</span>
                                  </div>
                                )}
                                {event.location && (
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span>{event.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="mt-4 flex-shrink-0">
                              {event.attendees && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Users className="w-4 h-4" />
                                  <span>{event.attendees} expected</span>
                                </div>
                              )}
                              <Button variant="ghost" className="text-primary hover:text-primary/80 gap-2 h-auto p-0 mt-4">
                                Learn More
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Past Events Tab Content */}
              <TabsContent value="past-events" className="space-y-16 py-16">
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-center gap-4 mb-10 scroll-animate">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                        Past Events
                      </h3>
                      <p className="text-muted-foreground">
                        Review our previous activities and achievements
                      </p>
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : pastEvents.length === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h4 className="text-xl font-semibold text-foreground mb-2">No Past Events</h4>
                      <p className="text-muted-foreground">
                        Past events will appear here once they are completed.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-6 justify-between">
                      {pastEvents.map((event, index) => (
                        <Card key={index} className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-lg transition-shadow duration-300 group cursor-pointer opacity-75">
                          <div className="flex flex-col md:flex-row md:items-start gap-6 justify-between">
                            <div className="flex-shrink-0">
                              <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center">
                                <Clock className="w-10 h-10 text-gray-500" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-3 mb-3">
                                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                  {event.type || 'Event'} • Completed
                                </span>
                              </div>
                              <h4 className="font-display text-xl font-semibold text-foreground mb-2">
                                {event.title}
                              </h4>
                              <p className="text-muted-foreground mb-4">{event.description}</p>
                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="w-4 h-4 text-gray-500" />
                                  <span>{event.date}</span>
                                </div>
                                {event.time && (
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span>{event.time}</span>
                                  </div>
                                )}
                                {event.location && (
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <span>{event.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </section>
    </>
  );
}