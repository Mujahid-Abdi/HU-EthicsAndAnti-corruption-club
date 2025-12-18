import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  Award,
  Trophy,
  Medal,
  Star,
  Users,
  Calendar,
  Target,
  BookOpen,
  Handshake,
  Globe,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const achievements = [
  {
    id: 1,
    title: "National Ethics Excellence Award",
    description: "Recognized by the Federal Ethics and Anti-Corruption Commission for outstanding contribution to promoting integrity in higher education.",
    date: "December 2024",
    category: "National Recognition",
    icon: Trophy,
    impact: "First university club to receive this prestigious award",
    image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800",
  },
  {
    id: 2,
    title: "Successfully Hosted First Annual Integrity Forum",
    description: "Organized a comprehensive forum with over 300 participants including students, faculty, and external stakeholders.",
    date: "November 2024",
    category: "Event Success",
    icon: Users,
    impact: "300+ participants, 15 speakers, 5 workshops",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800",
  },
  {
    id: 3,
    title: "Partnership with National Anti-Corruption Body",
    description: "Established formal collaboration with the Federal Ethics and Anti-Corruption Commission for enhanced educational programs.",
    date: "October 2024",
    category: "Strategic Partnership",
    icon: Handshake,
    impact: "Access to expert resources and training materials",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800",
  },
  {
    id: 4,
    title: "Ethics Training Program Launch",
    description: "Developed and launched comprehensive ethics training curriculum for student leaders across all departments.",
    date: "September 2024",
    category: "Program Development",
    icon: BookOpen,
    impact: "50+ student leaders trained, 12 departments covered",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
  },
  {
    id: 5,
    title: "Student Leadership Conference Recognition",
    description: "Received outstanding club award at the National Student Leadership Conference for innovative anti-corruption initiatives.",
    date: "August 2024",
    category: "Conference Award",
    icon: Medal,
    impact: "Recognized among 200+ student organizations nationwide",
    image: "https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=800",
  },
  {
    id: 6,
    title: "Campus-Wide Ethics Survey Success",
    description: "Conducted comprehensive survey revealing 87% student support for stronger anti-corruption measures.",
    date: "July 2024",
    category: "Research Impact",
    icon: Target,
    impact: "1,200+ responses, influenced university policy changes",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
  },
];

const milestones = [
  { number: "500+", label: "Students Engaged", icon: Users },
  { number: "25", label: "Events Organized", icon: Calendar },
  { number: "6", label: "Major Awards", icon: Award },
  { number: "3", label: "Strategic Partnerships", icon: Handshake },
];

const upcomingGoals = [
  {
    title: "International Ethics Conference",
    description: "Planning to host the first East African University Ethics Conference in 2025",
    timeline: "March 2025",
    status: "In Planning",
  },
  {
    title: "Ethics Certification Program",
    description: "Developing accredited ethics certification for graduating students",
    timeline: "June 2025",
    status: "Development Phase",
  },
  {
    title: "Regional Club Network",
    description: "Establishing network of ethics clubs across Ethiopian universities",
    timeline: "September 2025",
    status: "Initial Outreach",
  },
];

export default function AchievementsPage() {
  useScrollAnimation();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[30vh] flex items-center overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/70 to-gray-900/60 dark:from-gray-950/90 dark:via-gray-950/80 dark:to-gray-950/70 z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1920')] bg-cover bg-center opacity-30 dark:opacity-20" />
        </div>

        {/* Decorative Orange Shapes */}
        <div className="absolute top-10 right-[10%] w-32 h-32 bg-primary/30 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-20 right-[20%] w-48 h-48 bg-primary/20 rounded-[40%] blur-2xl z-0" />

        <div className="container mx-auto px-4 py-16 relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 animate-fade-in">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-medium">
                Our Success Story
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Our <span className="text-primary">Achievements</span>
            </h1>

            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Celebrating our journey of promoting ethics, integrity, and transparency within our university community and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 scroll-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                Key Milestones
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Impact by Numbers
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Measurable outcomes from our commitment to ethical excellence
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="scroll-fade-up bg-card rounded-xl p-6 text-center shadow-card border border-border hover:shadow-card-hover transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <milestone.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-display font-bold text-primary mb-2">
                  {milestone.number}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {milestone.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Major Achievements */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-fade-up">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Major Achievements
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Highlighting our most significant accomplishments and recognitions
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.id}
                className={`scroll-fade-up grid lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                {/* Image */}
                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={achievement.image}
                      alt={achievement.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center">
                      <achievement.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {achievement.category}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {achievement.date}
                    </span>
                  </div>
                  
                  <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                    {achievement.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {achievement.description}
                  </p>
                  
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Impact</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {achievement.impact}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Goals */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                Looking Ahead
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Upcoming Goals & Initiatives
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our roadmap for expanding impact and continuing our mission of promoting ethics and integrity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {upcomingGoals.map((goal, index) => (
              <div
                key={index}
                className="scroll-fade-up bg-card rounded-xl p-6 shadow-card border border-border hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-orange-light/10 text-orange-dark text-xs font-medium">
                    {goal.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {goal.timeline}
                  </span>
                </div>
                
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                  {goal.title}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {goal.description}
                </p>
                
                <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary/80 p-0 h-auto">
                  Learn More
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-primary via-primary/95 to-orange-dark overflow-hidden relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center scroll-fade-up">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Be Part of Our Success Story
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join us in our mission to promote ethics and integrity. Together, we can achieve even greater milestones and create lasting positive change.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shadow-lg"
              >
                Join Our Club
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                View All Events
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}