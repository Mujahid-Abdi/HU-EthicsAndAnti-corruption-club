import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  ExternalLink, 
  BookOpen,
  Scale,
  Building,
  Globe,
  ChevronRight
} from "lucide-react";

const universityPolicies = [
  {
    title: "University Code of Conduct",
    description: "Comprehensive guidelines for ethical behavior expected of all students, faculty, and staff.",
    type: "PDF",
    size: "1.2 MB",
  },
  {
    title: "Academic Integrity Policy",
    description: "Detailed policy on academic honesty, plagiarism prevention, and disciplinary procedures.",
    type: "PDF",
    size: "890 KB",
  },
  {
    title: "Disciplinary Procedures Manual",
    description: "Step-by-step guide to the university's disciplinary process and appeal mechanisms.",
    type: "PDF",
    size: "1.5 MB",
  },
  {
    title: "Anti-Harassment Policy",
    description: "Policy addressing all forms of harassment and the reporting/response procedures.",
    type: "PDF",
    size: "720 KB",
  },
];

const clubDocuments = [
  {
    title: "Club Constitution",
    description: "The founding document outlining our mission, structure, and operational guidelines.",
    type: "PDF",
    size: "450 KB",
  },
  {
    title: "Annual Report 2024",
    description: "Summary of our activities, achievements, and impact over the past year.",
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
    definition: "The abuse of entrusted power for private gain. It can be classified as grand, petty, or political depending on the amounts involved and the sector.",
  },
  {
    term: "Bribery",
    definition: "The offering, giving, receiving, or soliciting of any item of value to influence the actions of an official or other person in charge of a public or legal duty.",
  },
  {
    term: "Whistleblower",
    definition: "A person who exposes information about activity within an organization that is deemed illegal, unethical, or not correct.",
  },
  {
    term: "Conflict of Interest",
    definition: "A situation in which a person's private interests interfere with their professional duties and responsibilities.",
  },
  {
    term: "Academic Integrity",
    definition: "The commitment to and demonstration of honest and moral behavior in an academic setting, including avoiding plagiarism and cheating.",
  },
  {
    term: "Due Diligence",
    definition: "The investigation or exercise of care that a reasonable person or organization is expected to take before entering into an agreement or decision.",
  },
];

export default function ResourcesPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6">
              <BookOpen className="w-4 h-4 text-gold" />
              <span className="text-sm text-primary-foreground/80">Knowledge Hub</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
              Resources & Policy Center
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Access official university policies, club documentation, and educational 
              resources to support your understanding of ethical conduct.
            </p>
          </div>
        </div>
      </section>

      {/* University Policies */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center">
                <Building className="w-7 h-7 text-gold" />
              </div>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  University Policy Downloads
                </h2>
                <p className="text-muted-foreground">Official Haramaya University policies and guidelines</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {universityPolicies.map((doc, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 border border-border hover:border-gold/50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-forest" />
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">
                          {doc.type} • {doc.size}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground">{doc.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="group-hover:bg-gold/10">
                      <Download className="w-5 h-5 text-forest" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Club Documentation */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center">
                <Scale className="w-7 h-7 text-gold" />
              </div>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Club Documentation
                </h2>
                <p className="text-muted-foreground">Our organizational documents and reports</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {clubDocuments.map((doc, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 border border-border hover:border-gold/50 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-gold" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      {doc.type} • {doc.size}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{doc.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{doc.description}</p>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* External Links */}
      <section className="py-20 bg-cream-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center">
                <Globe className="w-7 h-7 text-gold" />
              </div>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  External Educational Links
                </h2>
                <p className="text-muted-foreground">Trusted resources from national and international bodies</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {externalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-card rounded-xl p-6 border border-border hover:border-forest/50 transition-all group flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-forest transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-forest flex-shrink-0 ml-4" />
                </a>
              ))}
            </div>
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
                      <h3 className="font-display font-semibold text-foreground mb-2">{item.term}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.definition}</p>
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
