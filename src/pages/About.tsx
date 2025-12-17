import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Target,
  Eye,
  BookOpen,
  Scale,
  Users,
  Award,
  Heart,
  Lightbulb,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

const pillars = [
  {
    icon: BookOpen,
    title: "Education",
    description:
      "We conduct workshops, seminars, and awareness campaigns to educate students about ethical conduct, anti-corruption laws, and the importance of integrity in academic and professional life.",
  },
  {
    icon: Scale,
    title: "Policy Advocacy",
    description:
      "We work closely with university administration to review, strengthen, and implement policies that promote transparency, accountability, and ethical governance.",
  },
  {
    icon: Users,
    title: "Support & Reporting",
    description:
      "We provide a safe, confidential channel for students and staff to report concerns about unethical behavior, and offer support throughout the process.",
  },
];

const values = [
  {
    icon: Shield,
    title: "Integrity",
    description: "Upholding honesty and moral principles in all actions",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Promoting openness in institutional processes",
  },
  {
    icon: Heart,
    title: "Accountability",
    description: "Taking responsibility for our actions and decisions",
  },
  {
    icon: Lightbulb,
    title: "Education",
    description: "Continuous learning about ethical standards",
  },
];

const leadership = [
  { role: "President", name: "To Be Announced", placeholder: true },
  { role: "Vice President", name: "To Be Announced", placeholder: true },
  { role: "Secretary", name: "To Be Announced", placeholder: true },
  { role: "Faculty Advisor", name: "To Be Announced", placeholder: true },
];

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[30vh] flex items-center overflow-hidden bg-gray-50">
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
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-medium">
                Established for Integrity
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold text-background mb-6 leading-tight">
              About Our <span className="text-primary">Club</span>
            </h1>

            <p className="text-lg md:text-xl text-background/90 mb-10 mx-auto max-w-2xl leading-relaxed">
              Learn about our mission, vision, and the dedicated team working to
              build a more transparent and ethical university community.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a href="#mission" className="inline-flex">
                <Button
                  size="lg"
                  className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-orange"
                >
                  Our Mission
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <a href="#team" className="inline-flex">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 bg-white/10 backdrop-blur-sm border-white/30 text-background hover:bg-white/20"
                >
                  Meet the Team
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="mission" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                Our Vision
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To establish Haramaya University as a beacon of ethical
                excellence in higher education, where integrity is the
                foundation of all academic, administrative, and social
                interactions, inspiring a generation of principled leaders
                committed to building a corruption-free society.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To cultivate a culture of integrity by educating students about
                ethical conduct, advocating for transparent policies, providing
                secure channels for reporting concerns, and collaborating with
                all stakeholders to prevent and address corruption within our
                university.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History & Founding */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
              <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                Our Story
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Journey So Far
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From humble beginnings to becoming a driving force for ethical
              change at Haramaya University.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Our History & Founding Principles
            </h2>
            <div className="prose prose-lg mx-auto text-muted-foreground">
              <p className="leading-relaxed mb-6">
                The Haramaya University Ethics and Anti-Corruption Club was
                founded by a group of dedicated students who recognized the
                vital importance of ethical conduct in academic settings.
                Inspired by national and international efforts to combat
                corruption, the club was established to serve as a student-led
                initiative promoting integrity.
              </p>
              <p className="leading-relaxed mb-6">
                Our founding principles are rooted in the belief that education
                is not only about academic excellence but also about character
                development. We believe that every student has the right to
                learn in an environment free from corruption and unethical
                practices.
              </p>
              <p className="leading-relaxed">
                Since our establishment, we have worked tirelessly to raise
                awareness, provide educational resources, and create safe spaces
                for dialogue about ethical challenges facing our community. Our
                commitment remains unwavering as we continue to grow and expand
                our impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Three Pillars of Action
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our work is built on three foundational pillars that guide all our
              initiatives and activities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border group"
              >
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <pillar.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                  {pillar.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-gradient-teal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Our Leadership
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Meet the dedicated individuals guiding our mission
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {leadership.map((member, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20"
              >
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <p className="text-primary font-medium text-sm mb-1">
                  {member.role}
                </p>
                <p
                  className={`text-white ${
                    member.placeholder ? "text-sm opacity-60" : "font-semibold"
                  }`}
                >
                  {member.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
