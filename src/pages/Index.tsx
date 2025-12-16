import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { 
  Shield, 
  AlertTriangle, 
  BookOpen, 
  Scale, 
  ArrowRight, 
  Calendar,
  Users,
  Lock
} from "lucide-react";

const services = [
  {
    icon: Lock,
    title: "Secure Reporting",
    description: "Submit concerns anonymously through our encrypted, confidential reporting system. Your identity is protected.",
  },
  {
    icon: BookOpen,
    title: "Ethics Education",
    description: "Workshops, seminars, and resources to foster a culture of integrity and ethical decision-making.",
  },
  {
    icon: Scale,
    title: "Policy Advocacy",
    description: "Working with university administration to strengthen anti-corruption policies and accountability measures.",
  },
];

const upcomingEvents = [
  {
    title: "Ethics Week 2025",
    date: "March 15-22, 2025",
    description: "A week of workshops, panel discussions, and activities promoting ethical conduct.",
  },
  {
    title: "Student Recruitment Drive",
    date: "February 1, 2025",
    description: "Join our club and become an ambassador for integrity on campus.",
  },
  {
    title: "Anti-Corruption Awareness Seminar",
    date: "January 28, 2025",
    description: "Learn about corruption prevention and your role in building transparency.",
  },
];

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/haramaya-gate.jpg)' }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/70" />
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gold blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-gold blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-8 animate-fade-in">
              <Shield className="w-4 h-4 text-gold" />
              <span className="text-sm text-primary-foreground/80">Haramaya University Ethics Club</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-slide-up">
              Integrity First.{" "}
              <span className="text-gradient-gold">Building a Transparent</span>{" "}
              Haramaya.
            </h1>

            <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Student-led initiative dedicated to promoting ethical conduct, combating corruption, 
              and fostering a culture of accountability within our university community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/report">
                <Button variant="alert" size="xl" className="gap-3 w-full sm:w-auto">
                  <AlertTriangle className="w-5 h-5" />
                  Report Anonymously & Securely
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline-light" size="xl" className="gap-2 w-full sm:w-auto">
                  Learn More
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-gold animate-pulse" />
          </div>
        </div>
      </section>

      {/* Mission Summary */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The Haramaya University Ethics and Anti-Corruption Club is committed to creating an environment 
              where integrity thrives. We empower students to stand against corruption, promote ethical leadership, 
              and work collaboratively with administration to build transparent institutional practices that 
              benefit our entire academic community.
            </p>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              What We Do
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three pillars of action driving positive change at Haramaya University
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-border"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-hero flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Events */}
      <section className="py-20 bg-cream-dark">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Latest News & Events
              </h2>
              <p className="text-muted-foreground">
                Stay updated with our upcoming activities and initiatives
              </p>
            </div>
            <Link to="/events">
              <Button variant="outline" className="gap-2">
                View All Events
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border hover:border-gold/50 transition-colors"
              >
                <div className="flex items-center gap-2 text-gold mb-4">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">{event.date}</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {event.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Users className="w-16 h-16 text-gold mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Join Us in Building a Better Haramaya
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Become a member of the Ethics and Anti-Corruption Club. Together, we can create 
              lasting change and uphold the values of integrity in our academic community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/join">
                <Button variant="hero" size="xl">
                  Join the Club Today
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline-light" size="xl">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
