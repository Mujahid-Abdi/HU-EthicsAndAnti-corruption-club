import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Clock,
  Mail,
  Phone,
  Send,
  Building2,
  ChevronRight,
  MessageSquare,
  Calendar,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { FirestoreService, Collections } from "@/lib/firestore";

const officeHours = [
  { day: "Monday - Friday", hours: "8:00 AM - 5:00 PM" },
  { day: "Saturday", hours: "9:00 AM - 12:00 PM" },
  { day: "Sunday", hours: "Closed" },
];

interface ExecutiveMember {
  id: string;
  fullName: string;
  position: string;
  email: string | null;
  phone: string | null;
  bio: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
}

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [executives, setExecutives] = useState<ExecutiveMember[]>([]);

  useEffect(() => {
    fetchExecutives();
  }, []);

  const fetchExecutives = async () => {
    try {
      const data = await FirestoreService.getAll(Collections.EXECUTIVES, [
        // Add any filters if needed, e.g., where('isActive', '==', true)
      ]);
      
      if (data) {
        // Sort by display order
        const sortedData = (data as ExecutiveMember[])
          .filter(exec => exec.isActive !== false)
          .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        setExecutives(sortedData);
      }
    } catch (error) {
      console.error('Error fetching executives:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description:
        "Thank you for reaching out. We'll respond within 2-3 business days.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* Header Section */}
      <section className="pt-24 pb-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
              <Send className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                Get in Touch
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Contact Us
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fill out the form below for general inquiries. For anonymous
              reports, please use our secure reporting system.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section id="contact-form" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Send className="w-7 h-7 text-primary" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="bg-background"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this regarding?"
                    className="bg-background"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please describe your inquiry in detail..."
                    rows={5}
                    className="bg-background resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="forest"
                  size="lg"
                  className="w-full gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info & Office Hours */}
            <div className="space-y-8">
              {/* Office Hours */}
              <div className="bg-card rounded-2xl p-8 shadow-elegant border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Office Hours
                  </h3>
                </div>
                <div className="space-y-4">
                  {officeHours.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 border-b border-border last:border-0"
                    >
                      <span className="font-medium text-foreground">
                        {schedule.day}
                      </span>
                      <span
                        className={`text-sm ${
                          schedule.hours === "Closed"
                            ? "text-alert"
                            : "text-muted-foreground"
                        }`}
                      >
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  * Hours may vary during holidays and examination periods.
                </p>
              </div>

              {/* Contact Info */}
              <div id="contact-info" className="space-y-8">
                <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                    Contact Information
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Office Location
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Student Center Building, Room 204
                          <br />
                          Haramaya University Main Campus
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Address</p>
                        <p className="text-sm text-muted-foreground">
                          Haramaya University
                          <br />
                          P.O. Box 138, Dire Dawa, Ethiopia
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Email</p>
                        <p className="text-sm text-muted-foreground">
                          ethics.club@haramaya.edu.et
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Phone</p>
                        <p className="text-sm text-muted-foreground">
                          +251 25 553 0325
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Response Time
                        </p>
                        <p className="text-sm text-muted-foreground">
                          2-3 business days for general inquiries
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Members Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                Our Leadership
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Executive Committee
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the dedicated individuals leading our mission to promote ethics and combat corruption
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {executives.map((member) => (
              <div
                key={member.id}
                className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border text-center"
              >
                <div className="mb-4">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.fullName}
                      className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-primary/10"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto border-4 border-primary/20">
                      <Users className="w-12 h-12 text-primary" />
                    </div>
                  )}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                  {member.fullName}
                </h3>
                <p className="text-sm text-primary font-medium mb-3">
                  {member.position}
                </p>
                {member.bio && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {member.bio}
                  </p>
                )}
                {(member.email || member.phone) && (
                  <div className="pt-4 border-t border-border space-y-2">
                    {member.email && (
                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <a href={`mailto:${member.email}`} className="hover:text-primary transition-colors">
                          {member.email}
                        </a>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <a href={`tel:${member.phone}`} className="hover:text-primary transition-colors">
                          {member.phone}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {executives.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                Executive committee members will be announced soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Contact;
