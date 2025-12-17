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
      <section className="relative min-h-[30vh] flex items-center overflow-hidden bg-gray-50">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/70 to-foreground/60 z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920')] bg-cover bg-center opacity-30" />
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

            <h1 className="font-display text-3xl md:text-5xl font-bold text-background mb-4 leading-tight">
              News & <span className="text-primary">Updates</span>
            </h1>

            <p className="text-lg md:text-xl text-background/90 mb-10 max-w-2xl leading-relaxed">
              Stay informed with the latest news, announcements, and achievements from our club and the anti-corruption movement.
            </p>
          </div>
        </div>
      </section>

      {/* News Articles */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center">
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
                  className="bg-card rounded-xl p-6 border border-border hover:border-forest/50 transition-all group cursor-pointer shadow-sm hover:shadow-md"
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
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
              <Bell className="w-8 h-8 text-gold" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Stay Informed
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Subscribe to our newsletter to receive the latest news, updates, and announcements directly in your inbox.
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
