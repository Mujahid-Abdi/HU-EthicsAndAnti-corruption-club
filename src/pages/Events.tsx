import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Mail,
  Bell,
  ArrowRight,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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

export default function EventsPage() {
  const [email, setEmail] = useState("");

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
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[30vh] flex items-center overflow-hidden bg-gray-50">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/70 to-foreground/60 z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=1920')] bg-cover bg-center opacity-30" />
        </div>

        {/* Decorative Orange Shapes */}
        <div className="absolute top-10 right-[10%] w-32 h-32 bg-primary/30 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-20 right-[20%] w-48 h-48 bg-primary/20 rounded-[40%] blur-2xl z-0" />

        <div className="container mx-auto px-4 py-16 relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 animate-fade-in">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-medium">
                Upcoming Events
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-bold text-background mb-4 leading-tight">
              Upcoming <span className="text-primary">Events</span>
            </h1>

            <p className="text-lg md:text-xl text-background/90 mb-10 max-w-2xl leading-relaxed">
              Join us for our upcoming events, workshops, and activities. Be part of our mission to promote integrity and combat corruption.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="upcoming" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-10">
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

                      <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>

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
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
              <Bell className="w-8 h-8 text-gold" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Subscribe to our mailing list to receive updates about upcoming
              events, workshops, and important announcements directly in your
              inbox.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                  required
                />
              </div>
              <Button type="submit" variant="hero" size="lg">
                Subscribe
              </Button>
            </form>

            <p className="text-sm text-primary-foreground/60 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
