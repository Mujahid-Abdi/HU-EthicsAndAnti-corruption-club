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
  Lock,
  ChevronRight,
  MessageSquare,
  Mail,
  Phone
} from "lucide-react";

const services = [
  {
    icon: Lock,
    title: "Secure Reporting",
    description: "Submit concerns anonymously through our encrypted, confidential reporting system.",
    link: "/report"
  },
  {
    icon: BookOpen,
    title: "Ethics Education",
    description: "Workshops and seminars to foster a culture of integrity and ethical decision-making.",
    link: "/resources"
  },
  {
    icon: Scale,
    title: "Policy Advocacy",
    description: "Working with administration to strengthen anti-corruption policies.",
    link: "/about"
  },
  {
    icon: Users,
    title: "Community Building",
    description: "Building a network of integrity ambassadors across the university.",
    link: "/join"
  },
];

const teamMembers = [
  {
    name: "Dr. Amina Tadesse",
    role: "Faculty Advisor",
    description: "Guiding our club with expertise in ethics and governance.",
  },
  {
    name: "Bekele Hailu",
    role: "Club President",
    description: "Leading initiatives for transparency and accountability.",
  },
  {
    name: "Fatima Mohammed",
    role: "Vice President",
    description: "Coordinating events and member engagement activities.",
  },
];

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(222,47%,12%)] via-[hsl(217,50%,20%)] to-[hsl(222,47%,8%)]" />
        
        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-[20%] w-72 h-72 rounded-full bg-primary/20 blur-[100px] animate-pulse-slow" />
          <div className="absolute bottom-40 left-[10%] w-96 h-96 rounded-full bg-accent/15 blur-[120px] animate-pulse-slow" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 right-[5%] w-64 h-64 rounded-full bg-secondary/10 blur-[80px] animate-float" />
        </div>

        {/* 3D Decorative Elements */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-60 hidden lg:block">
          <div className="relative w-full h-full">
            {/* Abstract 3D shapes */}
            <div className="absolute top-[20%] right-[20%] w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-2xl transform rotate-12 shadow-glow animate-float" />
            <div className="absolute top-[40%] right-[35%] w-24 h-24 bg-gradient-to-br from-secondary/50 to-primary/50 rounded-xl transform -rotate-6 shadow-lg animate-float" style={{ animationDelay: "0.5s" }} />
            <div className="absolute top-[60%] right-[15%] w-20 h-20 bg-gradient-to-br from-accent/60 to-secondary/60 rounded-lg transform rotate-45 shadow-md animate-float" style={{ animationDelay: "1s" }} />
            <div className="absolute top-[30%] right-[5%] w-16 h-16 bg-primary/30 rounded-full blur-sm animate-pulse-slow" />
            <div className="absolute top-[70%] right-[40%] w-12 h-12 bg-accent/40 rounded-full blur-sm animate-pulse-slow" style={{ animationDelay: "0.7s" }} />
          </div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground/80">Haramaya University Ethics Club</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight animate-slide-up">
              Integrity.{" "}
              <span className="text-gradient-blue">Transparency.</span>{" "}
              Trust.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl animate-slide-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
              Student-led initiative dedicated to promoting ethical conduct, combating corruption, 
              and fostering accountability within our university community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/report">
                <Button variant="alert" size="xl" className="gap-3 w-full sm:w-auto">
                  <AlertTriangle className="w-5 h-5" />
                  Report Anonymously
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="glass" size="xl" className="gap-2 w-full sm:w-auto">
                  Explore Our Services
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-background relative">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <span className="text-sm text-foreground">PRODUCTS</span>
              <ChevronRight className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">SERVICES</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link
                key={index}
                to={service.link}
                className="group glass-card rounded-2xl p-6 hover:shadow-glow transition-all duration-500 hover:-translate-y-2"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Our Services</span>
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {service.description}
                </p>
                
                <div className="flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(222,47%,10%)] to-[hsl(217,50%,15%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-alert/20 border border-alert/30 mb-6">
                <MessageSquare className="w-4 h-4 text-alert" />
                <span className="text-sm text-alert">Our Mission</span>
              </div>
              
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                Building a Culture of{" "}
                <span className="text-gradient-blue">Integrity & Transparency</span>
              </h2>
              
              <p className="text-muted-foreground leading-relaxed mb-8">
                The Haramaya University Ethics and Anti-Corruption Club empowers students to stand against corruption, 
                promote ethical leadership, and work collaboratively with administration to build transparent institutional 
                practices that benefit our entire academic community.
              </p>

              <Link to="/about">
                <Button variant="outline" className="gap-2">
                  Learn More About Us
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { number: "100%", label: "Confidential Reports" },
                { number: "500+", label: "Students Reached" },
                { number: "50+", label: "Events Hosted" },
                { number: "24/7", label: "Support Available" },
              ].map((stat, index) => (
                <div key={index} className="glass-card rounded-2xl p-6 text-center">
                  <div className="text-3xl font-display font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="glass-card rounded-2xl p-8 hover:shadow-glow transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-foreground font-bold text-xl">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-primary">{member.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(222,47%,10%)] to-[hsl(217,50%,15%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">Contact Us</h2>
                <p className="text-muted-foreground">Get in touch with our team for any questions or concerns</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Link to="/contact" className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-foreground font-medium">Send us a message</div>
                    <div className="text-sm text-muted-foreground">We'll respond within 24 hours</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                </Link>

                <Link to="/report" className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <AlertTriangle className="w-5 h-5 text-alert" />
                  <div>
                    <div className="text-foreground font-medium">Anonymous Report</div>
                    <div className="text-sm text-muted-foreground">100% confidential</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                </Link>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/join">
                  <Button variant="default" size="lg" className="gap-2">
                    <Users className="w-4 h-4" />
                    Join Our Club
                  </Button>
                </Link>
                <Link to="/events">
                  <Button variant="glass" size="lg" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    View Events
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}