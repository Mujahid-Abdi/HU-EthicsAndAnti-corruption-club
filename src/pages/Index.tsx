import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FirestoreService, Collections } from "@/lib/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
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
  Trophy,
  Loader2,
  Newspaper,
  User,
} from "lucide-react";
import { useSystemSettings } from "@/hooks/useSystemSettings";

interface LeadershipMember {
  id: string;
  fullName: string;
  position: string;
  email: string | null;
  phone: string | null;
  imageUrl: string | null;
  bio: string | null;
  displayOrder: number;
  isActive: boolean;
}

interface HomePageContent {
  missionTitle: string;
  missionDescription: string;
  visionTitle: string;
  visionDescription: string;
  valuesTitle: string;
  valuesDescription: string;
  achievementsTitle: string;
  achievementsDescription: string;
  leadershipTitle: string;
  leadershipDescription: string;
  leadership: LeadershipMember[];
}

const defaultContent: HomePageContent = {
  missionTitle: "Our Mission",
  missionDescription: "To foster a culture of integrity and ethical behavior within Haramaya University by educating, advocating, and taking action against corruption in all its forms.",
  visionTitle: "Our Vision", 
  visionDescription: "A corruption-free university environment where ethical conduct is the foundation of all academic and administrative activities.",
  valuesTitle: "Our Values",
  valuesDescription: "Integrity, Transparency, Accountability, Justice, and Excellence guide everything we do.",
  achievementsTitle: "Our Latest Achievements",
  achievementsDescription: "Celebrating our recent accomplishments in promoting ethics and fighting corruption.",
  leadershipTitle: "Our Leadership Team",
  leadershipDescription: "Meet the dedicated leaders driving our mission forward.",
  leadership: [
    {
      id: "1",
      fullName: "John Doe",
      position: "President",
      email: "president@huec.edu.et",
      phone: "+251-911-123456",
      imageUrl: "",
      bio: "Leading the fight against corruption with passion and dedication.",
      displayOrder: 1,
      isActive: true
    },
    {
      id: "2", 
      fullName: "Jane Smith",
      position: "Vice President",
      email: "vicepresident@huec.edu.et",
      phone: "+251-911-123457",
      imageUrl: "",
      bio: "Supporting ethical initiatives and student engagement programs.",
      displayOrder: 2,
      isActive: true
    },
    {
      id: "3",
      fullName: "Mike Johnson", 
      position: "Secretary",
      email: "secretary@huec.edu.et",
      phone: "+251-911-123458",
      imageUrl: "",
      bio: "Managing communications and organizational activities.",
      displayOrder: 3,
      isActive: true
    }
  ]
};

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
    title: "Comprehensive Resources",
    description:
      "Access our educational resources, news, and latest updates to stay engaged with our initiatives.",
    link: "/news",
  },
  {
    icon: Scale,
    title: "Policy Advocacy",
    description:
      "Working with administration to strengthen anti-corruption policies and promote transparency.",
    link: "/about",
  },
];

export default function HomePage() {
  useScrollAnimation();
  const { settings: systemSettings } = useSystemSettings();
  const [homeContent, setHomeContent] = useState<HomePageContent>(defaultContent);
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  const [latestNews, setLatestNews] = useState<
    {
      id: string;
      title: string;
      excerpt: string | null;
      imageUrl: string | null;
      createdAt: any;
    }[]
  >([]);
  const [isLatestNewsLoading, setIsLatestNewsLoading] = useState(true);

  const [latestAchievements, setLatestAchievements] = useState<
    {
      id: string;
      title: string;
      description: string | null;
      imageUrl: string | null;
      createdAt: any;
    }[]
  >([]);
  const [isAchievementsLoading, setIsAchievementsLoading] = useState(true);

  const [executives, setExecutives] = useState<LeadershipMember[]>([]);
  const [isExecutivesLoading, setIsExecutivesLoading] = useState(true);

  useEffect(() => {
    const fetchLatestNews = async () => {
      setIsLatestNewsLoading(true);
      try {
        const data = await FirestoreService.getAll(Collections.NEWS);
        const publishedNews = data
          .filter((item: any) => item.published)
          .map((item: any) => ({
            ...item,
            imageUrl: item.imageUrl || item.image_url,
            createdAt: item.createdAt || item.created_at,
          }))
          .sort((a: any, b: any) => {
            const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(0);
            const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(0);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 3);

        setLatestNews(publishedNews);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
      setIsLatestNewsLoading(false);
    };

    const fetchLatestAchievements = async () => {
      setIsAchievementsLoading(true);
      try {
        const data = await FirestoreService.getAll(Collections.ACHIEVEMENTS);
        const publishedAchievements = data
          .filter((item: any) => item.published)
          .map((item: any) => ({
            ...item,
            imageUrl: item.imageUrl || item.image_url,
            createdAt: item.createdAt || item.created_at,
          }))
          .sort((a: any, b: any) => {
            const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(0);
            const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(0);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 3);

        setLatestAchievements(publishedAchievements);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      }
      setIsAchievementsLoading(false);
    };

    const fetchHomeContent = async () => {
      try {
        const data = await FirestoreService.get('settings', 'home-page-content');
        if (data) {
          setHomeContent({ ...defaultContent, ...data });
        }
      } catch (error) {
        console.error('Error fetching home content:', error);
      }
      setIsLoadingContent(false);
    };

    const fetchExecutives = async () => {
      setIsExecutivesLoading(true);
      try {
        const data = await FirestoreService.getAll('executives');
        
        // Map data to ensure consistency and handle potential legacy fields
        const mappedExecutives = data
          .map((exec: any) => ({
            id: exec.id,
            fullName: exec.fullName || exec.full_name || exec.name,
            position: exec.position,
            email: exec.email,
            phone: exec.phone,
            imageUrl: exec.imageUrl || exec.image_url || exec.image,
            bio: exec.bio,
            displayOrder: exec.displayOrder || exec.display_order || 0,
            isActive: exec.isActive !== undefined ? exec.isActive : (exec.is_active !== undefined ? exec.is_active : true)
          }));

        const activeExecutives = mappedExecutives
          .filter((exec) => exec.isActive)
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .slice(0, 3); // Only show top 3 key positions on home page
        
        setExecutives(activeExecutives as LeadershipMember[]);
      } catch (error) {
        console.error('Error fetching executives:', error);
      }
      setIsExecutivesLoading(false);
    };

    fetchLatestNews();
    fetchLatestAchievements();
    fetchHomeContent();
    fetchExecutives();
  }, []);

  // Show regular homepage
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm scale-105" 
            style={{
              backgroundImage: "url('/ethics-hero.png'), url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920')",
              backgroundSize: 'cover',
              backgroundPosition: 'center center'
            }} 
          />
        </div>

        {/* Decorative Orange Shapes */}
        <div className="absolute top-10 right-[10%] w-32 h-32 bg-primary/30 rounded-full z-0" />
        <div className="absolute bottom-20 right-[20%] w-48 h-48 bg-primary/20 rounded-[40%] z-0" />

        <div className="container mx-auto px-4 pt-16 pb-24 relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 dark:bg-gray-900/40 border border-white/30 dark:border-gray-700/50 backdrop-blur-sm mb-6 animate-fade-in">
              <Shield className="w-4 h-4 text-white dark:text-gray-200" />
              <span className="text-sm text-white dark:text-gray-200 font-medium">
                Haramaya University Ethics Club
              </span>
            </div>

            <h1 className="font-display text-2xl md:text-4xl font-bold mb-6 leading-tight animate-slide-up text-white dark:text-gray-100 drop-shadow-lg">
              Building Integrity, Fighting Corruption
            </h1>

            <p
              className="text-lg md:text-xl text-white/95 dark:text-gray-200/90 mb-10 max-w-2xl animate-slide-up leading-relaxed drop-shadow-md"
              style={{ animationDelay: "0.1s" }}
            >
              Empowering students and faculty to promote ethical conduct, transparency, and accountability within our university community.
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
                  className="gap-2 w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
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
          <div className="text-center mb-12 scroll-fade-up">
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
                className="scroll-fade-up group bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-border"
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

      {/* Latest Achievements Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between gap-4 mb-12 scroll-fade-up">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                  {homeContent.achievementsTitle}
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {homeContent.achievementsDescription}
              </h2>
            </div>
            <Link to="/achievements" className="shrink-0">
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isAchievementsLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          ) : latestAchievements.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="py-12 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No achievements yet. Check back soon.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {latestAchievements.map((item) => (
                <Link
                  key={item.id}
                  to={`/achievements/${item.id}`}
                  className="scroll-fade-up group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border"
                >
                  {item.imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className={`p-6 ${!item.imageUrl ? 'pt-8' : ''}`}>
                    {item.createdAt && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4" />
                        {format(
                          item.createdAt.seconds 
                            ? new Date(item.createdAt.seconds * 1000) 
                            : new Date(item.createdAt), 
                          'MMMM d, yyyy'
                        )}
                      </div>
                    )}
                    <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-muted-foreground line-clamp-3 mb-4">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-primary text-sm font-medium">
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between gap-4 mb-12 scroll-fade-up">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
                <Newspaper className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                  Latest News
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Updates & Announcements
              </h2>
            </div>
            <Link to="/news" className="shrink-0">
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLatestNewsLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          ) : latestNews.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="py-12 text-center">
                <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No news yet. Check back soon.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {latestNews.map((item) => (
                <Link
                  key={item.id}
                  to={`/news/${item.id}`}
                  className="scroll-fade-up group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border"
                >
                  {item.imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className={`p-6 ${!item.imageUrl ? 'pt-8' : ''}`}>
                    {item.createdAt && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4" />
                        {format(
                          item.createdAt.seconds 
                            ? new Date(item.createdAt.seconds * 1000) 
                            : new Date(item.createdAt), 
                          'MMMM d, yyyy'
                        )}
                      </div>
                    )}
                    <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p className="text-muted-foreground line-clamp-3 mb-4">
                        {item.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-primary text-sm font-medium">
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Mission, Vision & Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Image Side */}
            <div className="relative scroll-fade-up">
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
            <div className="scroll-fade-up-delay space-y-8">
              {/* Mission */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-semibold">
                    {homeContent.missionTitle}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {homeContent.missionDescription}
                </p>
              </div>

              {/* Vision */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-semibold">
                    {homeContent.visionTitle}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {homeContent.visionDescription}
                </p>
              </div>

              {/* Values */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-semibold">
                    {homeContent.valuesTitle}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {homeContent.valuesDescription}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/about">
                  <Button variant="default" className="gap-2">
                    About Us
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/achievements">
                  <Button variant="outline" className="gap-2">
                    Our Achievements
                    <Trophy className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
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
                className="scroll-fade-up bg-card rounded-2xl p-8 text-center shadow-card border border-border"
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
          <div className="text-center mb-16 scroll-fade-up">
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
              <div key={index} className="text-center scroll-fade-up">
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

      {/* Leadership Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 scroll-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                {homeContent.leadershipTitle}
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {homeContent.leadershipDescription}
            </h2>
          </div>

          {isExecutivesLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : executives.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-2xl border-2 border-dashed">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
              <p className="text-muted-foreground">Leadership team information will be updated shortly.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {executives.map((member) => (
                <div
                  key={member.id}
                  className="scroll-fade-up group bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-border text-center"
                >
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.fullName}
                        className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-primary/20 relative z-10"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full mx-auto bg-primary/10 flex items-center justify-center border-4 border-primary/20 relative z-10">
                        <User className="w-12 h-12 text-primary" />
                      </div>
                    )}
                  </div>

                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {member.fullName}
                  </h3>
                  <p className="text-primary font-medium mb-3">
                    {member.position}
                  </p>
                  {member.bio && (
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
                      {member.bio}
                    </p>
                  )}

                  <div className="space-y-2 text-sm">
                    {member.email && (
                      <div className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${member.email}`}>{member.email}</a>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
