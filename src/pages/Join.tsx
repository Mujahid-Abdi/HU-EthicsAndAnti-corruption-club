import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  CheckCircle,
  Star,
  Heart,
  Award,
  BookOpen,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const benefits = [
  {
    icon: BookOpen,
    title: "Leadership Training",
    description:
      "Access exclusive workshops on ethical leadership and professional development.",
  },
  {
    icon: Users,
    title: "Networking",
    description:
      "Connect with like-minded students and professionals committed to integrity.",
  },
  {
    icon: Award,
    title: "Recognition",
    description:
      "Earn certificates and recognition for your contributions to ethical initiatives.",
  },
  {
    icon: Heart,
    title: "Make an Impact",
    description: "Be part of meaningful change in our university community.",
  },
];

export default function JoinPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    email: "",
    phone: "",
    department: "",
    year: "",
    motivation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted!",
      description: "Thank you for your interest. We'll contact you soon.",
    });
    setFormData({
      fullName: "",
      studentId: "",
      email: "",
      phone: "",
      department: "",
      year: "",
      motivation: "",
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[400px] flex items-center overflow-hidden bg-gray-50">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/70 to-foreground/60 z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920')] bg-cover bg-center opacity-30" />
        </div>

        {/* Decorative Orange Shapes */}
        <div className="absolute top-10 right-[10%] w-32 h-32 bg-primary/30 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-20 right-[20%] w-48 h-48 bg-primary/20 rounded-[40%] blur-2xl z-0" />

        <div className="container mx-auto px-4 py-24 relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-medium">
                Become a Member
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold text-background mb-6 leading-tight">
              Join Our <span className="text-primary">Community</span>
            </h1>

            <p className="text-lg md:text-xl text-background/90 mb-10 mx-auto max-w-2xl leading-relaxed">
              Become an ambassador for integrity and help us build a more
              ethical and transparent university community.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a href="#application" className="inline-flex">
                <Button
                  size="lg"
                  className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-orange"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <a href="#benefits" className="inline-flex">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 bg-white/10 backdrop-blur-sm border-white/30 text-background hover:bg-white/20"
                >
                  Learn More
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Why Join Us?
              </h2>
              <p className="text-muted-foreground">
                Membership comes with valuable opportunities for growth and
                impact
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-hero flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Membership Application
              </h2>
              <p className="text-muted-foreground">
                Fill out the form below to apply for membership
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-2xl p-8 shadow-card border border-border"
            >
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <Input
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Student ID *
                  </label>
                  <Input
                    required
                    value={formData.studentId}
                    onChange={(e) =>
                      setFormData({ ...formData, studentId: e.target.value })
                    }
                    placeholder="Enter your student ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="your.email@student.edu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+251 xxx xxx xxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Department *
                  </label>
                  <Input
                    required
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    placeholder="Your department"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Year of Study *
                  </label>
                  <Input
                    required
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    placeholder="e.g., 2nd Year"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Why do you want to join? *
                </label>
                <Textarea
                  required
                  rows={4}
                  value={formData.motivation}
                  onChange={(e) =>
                    setFormData({ ...formData, motivation: e.target.value })
                  }
                  placeholder="Tell us about your motivation for joining the club..."
                />
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg mb-6">
                <CheckCircle className="w-5 h-5 text-forest flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  By submitting this form, you agree to uphold the club's values
                  of integrity, transparency, and ethical conduct in all
                  activities.
                </p>
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full gap-2"
              >
                Submit Application
                <ArrowRight className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
