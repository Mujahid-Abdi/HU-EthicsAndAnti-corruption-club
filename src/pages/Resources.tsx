import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Download,
  ExternalLink,
  BookOpen,
  Scale,
  Building,
  Globe,
  ChevronRight,
  ArrowRight,
  Bookmark,
  Search,
  FileQuestion,
  Lightbulb,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const universityPolicies = [
  {
    title: "University Code of Conduct",
    description:
      "Comprehensive guidelines for ethical behavior expected of all students, faculty, and staff.",
    type: "PDF",
    size: "1.2 MB",
  },
  {
    title: "Academic Integrity Policy",
    description:
      "Detailed policy on academic honesty, plagiarism prevention, and disciplinary procedures.",
    type: "PDF",
    size: "890 KB",
  },
  {
    title: "Disciplinary Procedures Manual",
    description:
      "Step-by-step guide to the university's disciplinary process and appeal mechanisms.",
    type: "PDF",
    size: "1.5 MB",
  },
  {
    title: "Anti-Harassment Policy",
    description:
      "Policy addressing all forms of harassment and the reporting/response procedures.",
    type: "PDF",
    size: "720 KB",
  },
];

const clubDocuments = [
  {
    title: "Club Constitution",
    description:
      "The founding document outlining our mission, structure, and operational guidelines.",
    type: "PDF",
    size: "450 KB",
  },
  {
    title: "Annual Report 2024",
    description:
      "Summary of our activities, achievements, and impact over the past year.",
    type: "PDF",
    size: "2.1 MB",
  },
  {
    title: "Membership Guidelines",
    description: "Requirements and benefits of becoming a club member.",
    type: "PDF",
    size: "320 KB",
  },
];

const externalLinks = [
  {
    title: "Federal Ethics and Anti-Corruption Commission",
    description: "Ethiopia's national body for combating corruption",
    url: "https://www.feacc.gov.et/",
  },
  {
    title: "Transparency International",
    description: "Global coalition against corruption",
    url: "https://www.transparency.org/",
  },
  {
    title: "United Nations Office on Drugs and Crime",
    description: "UN resources on anti-corruption",
    url: "https://www.unodc.org/unodc/en/corruption/",
  },
  {
    title: "African Union Anti-Corruption Framework",
    description: "Continental anti-corruption initiatives",
    url: "https://au.int/",
  },
];

const glossary = [
  {
    term: "Corruption",
    definition:
      "The abuse of entrusted power for private gain. It can be classified as grand, petty, or political depending on the amounts involved and the sector.",
  },
  {
    term: "Bribery",
    definition:
      "The offering, giving, receiving, or soliciting of any item of value to influence the actions of an official or other person in charge of a public or legal duty.",
  },
  {
    term: "Whistleblower",
    definition:
      "A person who exposes information about activity within an organization that is deemed illegal, unethical, or not correct.",
  },
  {
    term: "Conflict of Interest",
    definition:
      "A situation in which a person's private interests interfere with their professional duties and responsibilities.",
  },
  {
    term: "Academic Integrity",
    definition:
      "The commitment to and demonstration of honest and moral behavior in an academic setting, including avoiding plagiarism and cheating.",
  },
  {
    term: "Due Diligence",
    definition:
      "The investigation or exercise of care that a reasonable person or organization is expected to take before entering into an agreement or decision.",
  },
];

export default function ResourcesPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[30vh] flex items-center overflow-hidden bg-gray-50">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/70 to-foreground/60 z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1920')] bg-cover bg-center opacity-30" />
        </div>

        {/* Decorative Orange Shapes */}
        <div className="absolute top-10 right-[10%] w-32 h-32 bg-primary/30 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-20 right-[20%] w-48 h-48 bg-primary/20 rounded-[40%] blur-2xl z-0" />

        <div className="container mx-auto px-4 py-24 relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-medium">
                Knowledge Base
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold text-background mb-6 leading-tight">
              Resources & <span className="text-primary">Materials</span>
            </h1>

            <p className="text-lg md:text-xl text-background/90 mb-10 mx-auto max-w-2xl leading-relaxed">
              Access our collection of policies, documents, and external
              resources to learn more about ethics, integrity, and
              anti-corruption efforts.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a href="#policies" className="inline-flex">
                <Button
                  size="lg"
                  className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-orange"
                >
                  View Resources
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <a href="#glossary" className="inline-flex">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 bg-white/10 backdrop-blur-sm border-white/30 text-background hover:bg-white/20"
                >
                  Browse Glossary
                  <Bookmark className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* University Policies */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
              <Scale className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                Official Documents
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              University Policies
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Official documents and guidelines from Haramaya University
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {universityPolicies.map((doc, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                  </div>
                  <CardDescription>{doc.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {doc.size} • {doc.type}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 group-hover:bg-primary/5"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Glossary */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Key Terminology Glossary
              </h2>
              <p className="text-muted-foreground">
                Understanding the language of ethics and anti-corruption
              </p>
            </div>

            <div className="space-y-4">
              {glossary.map((item, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 border border-border hover:border-gold/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <ChevronRight className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-display font-semibold text-foreground mb-2">
                        {item.term}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.definition}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
