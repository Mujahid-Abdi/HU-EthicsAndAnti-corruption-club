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
  Phone,
  CheckCircle2,
} from "lucide-react";

const services = [
  {
    icon: Lock,
    title: "Secure Reporting",
    description:
      "Submit concerns anonymously through our encrypted, confidential reporting system.",
    link: "/report",
  },
  {
    icon: BookOpen,
    title: "Ethics Education",
    description:
      "Workshops and seminars to foster a culture of integrity and ethical decision-making.",
    link: "/resources",
  },
  {
    icon: Scale,
    title: "Policy Advocacy",
    description:
      "Working with administration to strengthen anti-corruption policies.",
    link: "/about",
  },
];

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden bg-gray-50">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/70 to-foreground/60 z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920')] bg-cover bg-center opacity-30" />
        </div>

        {/* Decorative Orange Shapes */}
        <div className="absolute top-10 right-[10%] w-32 h-32 bg-primary/30 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-20 right-[20%] w-48 h-48 bg-primary/20 rounded-[40%] blur-2xl z-0" />

        <div className="container mx-auto px-4 py-24 relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-medium">
                Haramaya University Ethics Club
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold text-background mb-6 leading-tight animate-slide-up">
              Guiding Your Path to{" "}
              <span className="text-primary">Integrity</span>
            </h1>

            <p
              className="text-lg md:text-xl text-background/90 mb-10 max-w-2xl animate-slide-up leading-relaxed"
              style={{ animationDelay: "0.1s" }}
            >
              We are committed to promoting ethical conduct, combating
              corruption, and fostering accountability within our university
              community through education, advocacy, and action.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 animate-slide-up justify-center"
              style={{ animationDelay: "0.2s" }}
            >
              <Link
                to="/report"
                className="flex justify-center sm:justify-start"
              >
                <Button
                  size="lg"
                  className="gap-3 w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-orange"
                >
                  <AlertTriangle className="w-5 h-5" />
                  Report Anonymously
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/30 text-background hover:bg-white/20"
                >
                  Learn More
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
              <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                Our Services
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Committed to Your Ethical Success
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive support to ensure a culture of integrity
              and transparency throughout our university community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <Link
                key={index}
                to={service.link}
                className="group bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-border"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>

                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
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

      {/* Mission Section with Image */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Image Side */}
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 rounded-[40%] -z-10" />
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary/10 rounded-[50%] -z-10" />
              <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                  alt="Team collaboration"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>

            {/* Content Side */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-semibold">
                  Our Mission
                </span>
              </div>

              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                Committed to Your{" "}
                <span className="text-gradient-orange">
                  Ethical Success and Security
                </span>
              </h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                The Haramaya University Ethics and Anti-Corruption Club empowers
                students to stand against corruption, promote ethical
                leadership, and work collaboratively with administration to
                build transparent institutional practices.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "100% Confidential Reporting",
                  "Expert Guidance and Support",
                  "Active Student Community",
                  "Transparent Processes",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <Link to="/about">
                <Button variant="default" className="gap-2">
                  About Us
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { number: "100%", label: "Confidential" },
              { number: "500+", label: "Students Reached" },
              { number: "50+", label: "Events Hosted" },
              { number: "24/7", label: "Support Available" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 text-center shadow-card border border-border"
              >
                <div className="text-4xl font-display font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Operate Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
              <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                Our Process
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              How We Operate
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                number: "1",
                title: "Initial Consultation",
                description:
                  "Share your concerns with us through our secure platform",
              },
              {
                number: "2",
                title: "Assessment",
                description: "We carefully review and assess the situation",
              },
              {
                number: "3",
                title: "Action Planning",
                description: "Develop a strategic plan to address the issue",
              },
              {
                number: "4",
                title: "Resolution",
                description: "Work towards a fair and transparent resolution",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-orange flex items-center justify-center text-white font-display font-bold text-2xl shadow-orange">
                    {step.number}
                  </div>
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-teal">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Contact Info */}
              <div className="text-white">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                  Schedule Your Free Consultation
                </h2>
                <p className="text-white/80 mb-8 leading-relaxed">
                  Have questions or concerns? Get in touch with our team. We're
                  here to help you navigate ethical challenges and promote
                  transparency.
                </p>

                <div className="space-y-4">
                  <Link
                    to="/contact"
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-white font-medium">
                        Send us a message
                      </div>
                      <div className="text-sm text-white/70">
                        We'll respond within 24 hours
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/70 ml-auto" />
                  </Link>

                  <Link
                    to="/report"
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    <AlertTriangle className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-white font-medium">
                        Anonymous Report
                      </div>
                      <div className="text-sm text-white/70">
                        100% confidential
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/70 ml-auto" />
                  </Link>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <form className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Your message..."
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
