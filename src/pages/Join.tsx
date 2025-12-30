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
  ArrowRight
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const benefits = [
  {
    icon: BookOpen,
    title: "Leadership Training",
    description: "Access exclusive workshops on ethical leadership and professional development.",
  },
  {
    icon: Users,
    title: "Networking",
    description: "Connect with like-minded students and professionals committed to integrity.",
  },
  {
    icon: Award,
    title: "Recognition",
    description: "Earn certificates and recognition for your contributions to ethical initiatives.",
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
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6">
              <Star className="w-4 h-4 text-gold" />
              <span className="text-sm text-primary-foreground/80">Become a Member</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 text-gradient-hero">
              Join Our Club
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Become an ambassador for integrity and help us build a more ethical 
              and transparent university community.
            </p>
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
                Membership comes with valuable opportunities for growth and impact
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-hero flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
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

            <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-card border border-border">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <Input
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@student.edu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  placeholder="Tell us about your motivation for joining the club..."
                />
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg mb-6">
                <CheckCircle className="w-5 h-5 text-forest flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  By submitting this form, you agree to uphold the club's values of integrity, 
                  transparency, and ethical conduct in all activities.
                </p>
              </div>

              <Button type="submit" variant="gold" size="lg" className="w-full gap-2">
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
