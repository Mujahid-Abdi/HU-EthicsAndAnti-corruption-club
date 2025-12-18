import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Newspaper,
  Mail,
  Bell,
  ArrowRight,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const newsArticles = [
  {
    title: "Club Successfully Hosts First Annual Integrity Forum",
    date: "December 10, 2024",
    summary:
      "Over 300 students and faculty members participated in our inaugural Integrity Forum, featuring keynote speeches and breakout sessions on ethical leadership.",
    category: "Event Recap",
  },
  {
    title: "New Partnership with National Anti-Corruption Body",
    date: "November 25, 2024",
    summary:
      "The club has formalized a partnership with the Federal Ethics and Anti-Corruption Commission to enhance our educational programs and reporting mechanisms.",
    category: "Announcement",
  },
  {
    title: "Ethics Training Program Launches for Student Leaders",
    date: "November 15, 2024",
    summary:
      "A new comprehensive training program has been developed to equip student organization leaders with ethical leadership skills and integrity tools.",
    category: "Program Launch",
  },
  {
    title: "Club Recognized at National Student Conference",
    date: "October 30, 2024",
    summary:
      "Our club received recognition at the National Student Leadership Conference for outstanding contributions to promoting academic integrity.",
    category: "Achievement",
  },
  {
    title: "Monthly Integrity Workshop Series Announced",
    date: "October 15, 2024",
    summary:
      "Starting in November, we will host monthly workshops covering various aspects of ethical conduct, transparency, and anti-corruption strategies.",
    category: "Announcement",
  },
  {
    title: "Student Survey Reveals Strong Support for Anti-Corruption Initiatives",
    date: "September 28, 2024",
    summary:
      "A recent campus-wide survey shows that 87% of students support stronger measures to combat corruption and promote integrity in academic settings.",
    category: "Research",
  },
];

export default function NewsPage() {
  const [email, setEmail] = useState("");
  useScrollAnimation();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive our latest news and updates.",
      });
      setEmail("");
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[30vh] flex items-center overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/70 to-gray-900/60 dark:from-gray-950/90 dark:via-gray-950/80 dark:to-gray-950/70 z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920')] bg-cover bg-center opacity-30 dark:opacity-20" />
        </div>

        {/* Decorative Orange Shapes */}
        <div className="absolute top-10 right-[10%] w-32 h-32 bg-primary/30 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-20 right-[20%] w-48 h-48 bg-primary/20 rounded-[40%] blur-2xl z-0" />

        <div className="container mx-auto px-4 py-16 relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 animate-fade-in">
              <Newspaper className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-medium">
                Latest Updates
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              News & <span className="text-primary">Updates</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl leading-relaxed">
              Stay informed with the latest news, announcements, and achievements from our club and the anti-corruption movement.
            </p>
          </div>
        </div>
      </section>

      {/* News Articles */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8 scroll-animate">
              <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center shadow-md">
                <Newspaper className="w-7 h-7 text-gold" />
              </div>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Latest News
                </h2>
                <p className="text-muted-foreground">
                  Recent updates and announcements from our club
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {newsArticles.map((article, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-5 border border-border hover:border-forest/50 transition-all duration-300 group cursor-pointer shadow-md hover:shadow-xl scroll-animate"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-medium">
                      {article.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {article.date}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-forest transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {article.summary}
                  </p>
                  <span className="text-sm text-forest font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-light/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl border border-gray-200/50 scroll-animate-scale">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-orange-dark mb-6 shadow-orange">
                  <Bell className="w-10 h-10 text-white" />
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Stay Informed
                </h2>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  Subscribe to our newsletter to receive the latest news, updates, and announcements directly in your inbox.
                </p>
              </div>

              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
              >
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 bg-white border-2 border-gray-200 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl shadow-sm transition-all"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg"
                  className="h-14 px-8 bg-gradient-to-r from-primary to-orange-dark text-white hover:shadow-orange transition-all rounded-xl font-semibold"
                >
                  Subscribe
                </Button>
              </form>

              <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>We respect your privacy. Unsubscribe at any time.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
