
import { Button } from "@/components/ui/button";
import { StickyEthicsPrinciples } from "@/components/layout/StickyEthicsPrinciples";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState, useEffect } from "react";
import { FirestoreService, Collections } from "@/lib/firestore";
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
  Mail,
  Phone,
} from "lucide-react";

interface AboutContent {
  id: string;
  mission: string;
  vision: string;
  history: string;
  values: string[];
  pillars: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

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
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [executives, setExecutives] = useState<any[]>([]);

  useScrollAnimation();

  useEffect(() => {
    fetchAboutContent();
    fetchExecutives();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const data = await FirestoreService.get(Collections.CONTENT, 'about-content');
      if (data) {
        setAboutContent(data as AboutContent);
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExecutives = async () => {
    try {
      const data = await FirestoreService.getAll('executives');
      const activeExecutives = data
        .filter((item: any) => item.is_active !== false)
        .filter((exec: any) => ['President', 'Vice President', 'Secretary'].includes(exec.position))
        .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
        .slice(0, 3); // Only show top 3 key positions
      setExecutives(activeExecutives);
    } catch (error) {
      console.error('Error fetching executives:', error);
    }
  };

  // Use fetched content or fallback to default
  const mission = aboutContent?.mission || 'To cultivate a culture of integrity by educating students about ethical conduct, advocating for transparent policies, providing secure channels for reporting concerns, and collaborating with all stakeholders to prevent and address corruption within our university.';
  const vision = aboutContent?.vision || 'To establish Haramaya University as a beacon of ethical excellence in higher education, where integrity is the foundation of all academic, administrative, and social interactions, inspiring a generation of principled leaders committed to building a corruption-free society.';
  const history = aboutContent?.history || 'The Haramaya University Ethics and Anti-Corruption Club was founded by a group of dedicated students who recognized the vital importance of ethical conduct in academic settings. Inspired by national and international efforts to combat corruption, the club was established to serve as a student-led initiative promoting integrity.';
  const displayValues = aboutContent?.values || ['Integrity', 'Transparency', 'Accountability', 'Education'];
  const displayPillars = aboutContent?.pillars || pillars;

  return (
    <>
      {/* Vision & Mission */}
      <section id="mission" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                About Our Club
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Mission & Vision
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Learn about our mission, vision, and the dedicated team working to
              build a more transparent and ethical university community.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="scroll-fade-up bg-card rounded-2xl p-8 shadow-card border border-border">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Eye className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                    Our Vision
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {vision}
                  </p>
                </div>

                <div className="scroll-fade-up-delay bg-card rounded-2xl p-8 shadow-card border border-border">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Target className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                    Our Mission
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {mission}
                  </p>
                </div>
              </div>
            </div>

            {/* Sticky Ethics Principles */}
            <div className="lg:col-span-1">
              <StickyEthicsPrinciples />
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
                {history}
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
          <div className="text-center mb-16 scroll-fade-up">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Three Pillars of Action
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our work is built on three foundational pillars that guide all our
              initiatives and activities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {displayPillars.map((pillar, index) => {
              const IconComponent = pillar.icon === 'BookOpen' ? BookOpen : 
                                   pillar.icon === 'Scale' ? Scale : 
                                   pillar.icon === 'Users' ? Users : BookOpen;
              return (
                <div
                  key={index}
                  className="scroll-fade-up bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border group"
                >
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                    {pillar.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
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
            {displayValues.map((valueName, index) => {
              const value = values.find(v => v.title === valueName) || values[index % values.length];
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {valueName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              );
            })}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {executives.length === 0 ? (
               <p className="text-white/60 text-center col-span-full italic">Leadership information will be updated shortly.</p>
            ) : (
              executives.map((member) => (
                <div
                  key={member.id}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 shadow-xl group hover:bg-white/15 transition-all duration-300"
                >
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-4 border-white/30 relative z-10">
                      {member.image_url ? (
                        <img 
                          src={member.image_url} 
                          alt={member.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/10 flex items-center justify-center">
                          <Users className="w-10 h-10 text-white/50" />
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-primary font-bold text-sm uppercase tracking-widest mb-2">
                    {member.position}
                  </p>
                  <h3 className="text-white font-display text-xl font-bold mb-4">
                    {member.full_name}
                  </h3>
                  {member.bio && (
                    <p className="text-white/70 text-sm mb-6 leading-relaxed line-clamp-3 italic">
                      "{member.bio}"
                    </p>
                  )}
                  <div className="flex justify-center gap-4">
                    {member.email && (
                      <a 
                        href={`mailto:${member.email}`}
                        className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 text-white/70 hover:text-white transition-all"
                        title={member.email}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                    {member.phone && (
                      <div 
                        className="p-2 rounded-lg bg-white/5 text-white/70"
                        title={member.phone}
                      >
                        <Phone className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
