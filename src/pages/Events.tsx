import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Mail,
  Bell,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FirestoreService, Collections } from "@/lib/firestore";

const upcomingEvents = [
  {
    title: "Ethics Week 2025",
    date: "March 15-22, 2025",
    time: "Various Times",
    location: "Main Campus",
    description:
      "A comprehensive week of workshops, panel discussions, film screenings, and interactive activities focused on promoting ethical conduct and anti-corruption awareness.",
    type: "Major Event",
    attendees: 500,
  },
  {
    title: "Student Recruitment Drive",
    date: "February 1, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Student Center",
    description:
      "Join our club! Meet current members, learn about our activities, and sign up to become an ambassador for integrity on campus.",
    type: "Recruitment",
    attendees: 150,
  },
  {
    title: "Anti-Corruption Awareness Seminar",
    date: "January 28, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Auditorium Hall A",
    description:
      "Expert speakers from the Federal Ethics and Anti-Corruption Commission will discuss corruption prevention strategies and civic responsibility.",
    type: "Seminar",
    attendees: 200,
  },
  {
    title: "Workshop: Ethical Decision Making",
    date: "February 15, 2025",
    time: "10:00 AM - 12:00 PM",
    location: "Conference Room B",
    description:
      "Interactive workshop exploring ethical dilemmas and decision-making frameworks for students and future professionals.",
    type: "Workshop",
    attendees: 50,
  },
];

interface ClubEvent {
  id: string;
  title: string;
  date: any;
  time?: string;
  location: string;
  description: string;
  type: string;
  attendees: number;
  imageUrl?: string;
  published: boolean;
}

export default function EventsPage() {
  const [email, setEmail] = useState("");
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const location = useLocation();
  useScrollAnimation();

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash === 'upcoming') {
      setActiveTab('upcoming');
    } else if (hash === 'past') {
      setActiveTab('past');
    } else {
      // Default to upcoming if no hash
      setActiveTab('upcoming');
    }
  }, [location.hash]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL hash when tab changes
    window.history.replaceState(null, '', `#${value}`);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await FirestoreService.getAll(Collections.EVENTS);
      const publishedEvents = data
        .filter((item: any) => item.published || item.is_published)
        .map((item: any) => ({
          id: item.id,
          title: item.title,
          date: item.date || item.event_date,
          time: item.time || "TBA",
          location: item.location || "Main Campus",
          description: item.description,
          type: item.type || "Event",
          attendees: item.maxAttendees || item.max_attendees || 0,
          imageUrl: item.imageUrl || item.image_url,
          published: true,
        }));
      setEvents(publishedEvents as ClubEvent[]);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const allEvents = [...events, ...upcomingEvents.map(e => ({ ...e, id: Math.random().toString(), published: true }))];

  const currentDate = new Date();
  
  const upcomingEventsList = allEvents.filter((event: any) => {
    const eventDate = event.date?.seconds ? new Date(event.date.seconds * 1000) : new Date(event.date);
    return eventDate >= currentDate;
  }).sort((a: any, b: any) => {
    const dateA = a.date?.seconds ? new Date(a.date.seconds * 1000) : new Date(a.date);
    const dateB = b.date?.seconds ? new Date(b.date.seconds * 1000) : new Date(b.date);
    return dateA.getTime() - dateB.getTime(); // Sort by date ascending for upcoming
  });

  const pastEventsList = allEvents.filter((event: any) => {
    const eventDate = event.date?.seconds ? new Date(event.date.seconds * 1000) : new Date(event.date);
    return eventDate < currentDate;
  }).sort((a: any, b: any) => {
    const dateA = a.date?.seconds ? new Date(a.date.seconds * 1000) : new Date(a.date);
    const dateB = b.date?.seconds ? new Date(b.date.seconds * 1000) : new Date(b.date);
    return dateB.getTime() - dateA.getTime(); // Sort by date descending for past events
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive updates about our events.",
      });
      setEmail("");
    }
  };

  return (
    <>
      {/* Header Section */}
      <section className="pt-24 pb-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                Club Events
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Events & Activities
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join us for our events, workshops, and activities. Be part of our mission to promote integrity and combat corruption.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-8 bg-muted/30 min-h-[600px]">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="flex justify-center mb-10">
              <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                <TabsTrigger value="upcoming" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Upcoming Events
                </TabsTrigger>
                <TabsTrigger value="past" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Past Events
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Upcoming Events Tab */}
            <TabsContent value="upcoming" className="mt-0">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-10 scroll-animate">
                  <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center">
                    <Calendar className="w-7 h-7 text-gold" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      Upcoming Events
                    </h2>
                    <p className="text-muted-foreground">
                      Mark your calendar for these important activities
                    </p>
                  </div>
                </div>

                <div className="grid gap-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : upcomingEventsList.length === 0 ? (
                    <div className="text-center py-20 bg-muted/20 rounded-xl">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No upcoming events at the moment.</p>
                    </div>
                  ) : (
                    upcomingEventsList.map((event, index) => (
                      <div
                        key={event.id || index}
                        className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all group cursor-pointer shadow-sm hover:shadow-md scroll-animate"
                      >
                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-20 h-20 rounded-xl bg-primary/10 overflow-hidden flex items-center justify-center">
                              {/* @ts-ignore */}
                              {event.imageUrl ? (
                                /* @ts-ignore */
                                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                              ) : (
                                <Calendar className="w-10 h-10 text-primary" />
                              )}
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

                            <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                              {event.title}
                            </h3>

                            <p className="text-muted-foreground mb-4">
                              {event.description}
                            </p>

                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span>
                                  {event.date?.seconds 
                                    ? format(new Date(event.date.seconds * 1000), 'PPP') 
                                    : event.date}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="w-4 h-4 text-primary" />
                                <span>
                                  {event.date?.seconds 
                                    ? format(new Date(event.date.seconds * 1000), 'p') 
                                    : event.time}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span>{event.location}</span>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-border">
                              <Button
                                variant="ghost"
                                className="gap-2 text-primary hover:text-primary/80 p-0 h-auto"
                              >
                                Learn More
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Past Events Tab */}
            <TabsContent value="past" className="mt-0">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-10 scroll-animate">
                  <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center">
                    <Calendar className="w-7 h-7 text-gold" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      Past Events
                    </h2>
                    <p className="text-muted-foreground">
                      Look back at our successful activities and achievements
                    </p>
                  </div>
                </div>

                <div className="grid gap-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : pastEventsList.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-xl border border-border">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No past events to display yet.</p>
                    </div>
                  ) : (
                    pastEventsList.map((event, index) => (
                      <div
                        key={event.id || index}
                        className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all group cursor-pointer shadow-sm hover:shadow-md scroll-animate opacity-80 hover:opacity-100"
                      >
                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden flex items-center justify-center">
                              {/* @ts-ignore */}
                              {event.imageUrl ? (
                                /* @ts-ignore */
                                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                              ) : (
                                <Calendar className="w-10 h-10 text-muted-foreground" />
                              )}
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                                {event.type} • Completed
                              </span>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Users className="w-4 h-4" />
                                <span>{event.attendees} attended</span>
                              </div>
                            </div>

                            <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                              {event.title}
                            </h3>

                            <p className="text-muted-foreground mb-4">
                              {event.description}
                            </p>

                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span>
                                  {event.date?.seconds 
                                    ? format(new Date(event.date.seconds * 1000), 'PPP') 
                                    : event.date}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="w-4 h-4 text-primary" />
                                <span>
                                  {event.date?.seconds 
                                    ? format(new Date(event.date.seconds * 1000), 'p') 
                                    : event.time}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span>{event.location}</span>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-border">
                              <Button
                                variant="ghost"
                                className="gap-2 text-muted-foreground hover:text-primary p-0 h-auto"
                              >
                                View Details
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-primary/95 to-orange-dark overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center scroll-animate-scale">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Subscribe to our mailing list to receive updates about upcoming
              events, workshops, and important announcements directly in your
              inbox.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
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
