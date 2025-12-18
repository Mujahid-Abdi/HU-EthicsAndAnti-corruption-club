import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ReportForm } from "@/components/report/ReportForm";
import {
  Shield,
  Lock,
  FileCheck,
  Eye,
  MessageSquare,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const steps = [
  {
    number: "01",
    icon: FileCheck,
    title: "Preparation",
    description:
      "Gather all relevant information about the incident. Document dates, times, locations, individuals involved, and any supporting evidence.",
  },
  {
    number: "02",
    icon: MessageSquare,
    title: "Submission",
    description:
      "Use our secure, encrypted form below. You do not need to provide your identity. All submissions are encrypted and stored on protected servers.",
  },
  {
    number: "03",
    icon: Eye,
    title: "Follow-Up",
    description:
      "Your report will be reviewed by our confidential committee. If you provided contact info, we may reach out while protecting your identity.",
  },
];

const faqs = [
  {
    question: "Is my identity really protected?",
    answer:
      "Absolutely. Our reporting system is designed to allow completely anonymous submissions. We do not collect IP addresses, browser information, or any identifying data unless you voluntarily provide it. Even our review committee cannot identify you unless you choose to reveal yourself.",
  },
  {
    question: "What happens after I submit a report?",
    answer:
      "Your report is immediately encrypted and securely stored. Within 48-72 hours, it will be reviewed by our confidential committee. Depending on the nature and severity of the report, appropriate action will be taken, which may include internal investigation or referral to university administration.",
  },
  {
    question: "Can I face retaliation for reporting?",
    answer:
      "Ethiopian law and university policy strictly prohibit retaliation against whistleblowers. Anyone who reports in good faith is protected. If you experience any form of retaliation, please report it immediately—this itself is a serious violation that will be addressed.",
  },
  {
    question: "What types of incidents should I report?",
    answer:
      "You can report any form of unethical conduct, including academic dishonesty, bribery, favoritism, harassment, misuse of university resources, conflicts of interest, or any other behavior that violates ethical standards or university policies.",
  },
  {
    question: "What if I'm not sure something is worth reporting?",
    answer:
      "When in doubt, report it. Our committee will assess the situation professionally. It's better to report a concern that turns out to be minor than to ignore something that could be serious. All reports are treated with equal importance.",
  },
];

export default function ReportPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[30vh] flex items-center overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/70 to-gray-900/60 dark:from-gray-950/90 dark:via-gray-950/80 dark:to-gray-950/70 z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1920')] bg-cover bg-center opacity-30 dark:opacity-20" />
        </div>

        {/* Decorative Orange Shapes */}
        <div className="absolute top-10 right-[10%] w-32 h-32 bg-primary/30 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-20 right-[20%] w-48 h-48 bg-primary/20 rounded-[40%] blur-2xl z-0" />

        <div className="container mx-auto px-4 py-16 relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 animate-fade-in">
              <Lock className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-medium">
                100% Confidential & Secure
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Report an <span className="text-primary">Incident</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-10 mx-auto max-w-2xl leading-relaxed">
              Your voice matters. Report concerns safely and anonymously. We are
              committed to protecting your identity and addressing all reports
              seriously.
            </p>
          </div>
        </div>
      </section>

      {/* Security Assurance */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-primary to-primary/90 rounded-2xl p-8 md:p-12 shadow-xl overflow-hidden relative">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 shadow-inner border border-white/20">
                    <Shield className="w-12 h-12 text-white" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                      Your Security is Our Priority
                    </h2>
                    <p className="text-lg text-white/90 max-w-3xl">
                      We take every measure to ensure your report remains
                      confidential and secure.
                    </p>
                  </div>
                </div>

                <div className="mt-12 grid md:grid-cols-3 gap-8">
                  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                    <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                      <Lock className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      100% Confidential
                    </h3>
                    <p className="text-white/80">
                      Your identity is protected with end-to-end encryption. We
                      don't track or store any identifying information.
                    </p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                    <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-gold" />
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">No IP Tracking</span>
                    </div>
                    <div className="flex items-center gap-2 text-gold">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">Anonymous Submission</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How to Report
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these three simple steps to submit your report securely
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-gold to-transparent -translate-x-8 z-0" />
                )}
                <div className="relative bg-card rounded-xl p-6 shadow-card border border-border hover:border-gold/50 transition-colors z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl font-display font-bold text-gold/30">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-gold" />
                    </div>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Form Section */}
      <section id="submit-form" className="py-20 bg-cream-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Submit Your Report
              </h2>
              <p className="text-muted-foreground">
                Complete the secure form below. All fields marked with * are
                required.
              </p>
            </div>
            <ReportForm />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest/10 mb-4">
                <HelpCircle className="w-4 h-4 text-forest" />
                <span className="text-sm text-forest font-medium">
                  Frequently Asked Questions
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Common Concerns About Reporting
              </h2>
              <p className="text-muted-foreground">
                We understand you may have questions. Here are answers to the
                most common concerns.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-card rounded-xl border border-border px-6 shadow-sm"
                >
                  <AccordionTrigger className="text-left font-medium text-foreground hover:text-forest py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="font-display text-xl font-semibold text-foreground mb-6">
              Need More Information?
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/programs">
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Resources & Policies
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" className="gap-2">
                  Learn About Our Process
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
