import { Link } from "react-router-dom";
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
    <>
      {/* Header Section */}
      <section className="pt-24 pb-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
              <Lock className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                100% Confidential & Secure
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Report an Incident
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your voice matters. Report concerns safely and anonymously. We are
              committed to protecting your identity and addressing all reports
              seriously.
            </p>
          </div>
        </div>
      </section>

      {/* Security Assurance */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-6">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                  Security & Privacy Guaranteed
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Your Security is Our Priority
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We implement industry-leading security measures to protect your identity and ensure your report remains completely confidential.
              </p>
            </div>

            {/* Security Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  End-to-End Encryption
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  All data is encrypted using AES-256 encryption before transmission and storage. Your information is protected at every step.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No IP Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  We do not log IP addresses, browser fingerprints, or any metadata that could identify your device or location.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Anonymous by Default
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  No registration required. Submit reports without providing any personal information unless you choose to.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                  <FileCheck className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Secure File Storage
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Evidence files are encrypted and stored on secure servers with restricted access limited to authorized personnel only.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Legal Protection
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Ethiopian whistleblower laws protect you from retaliation. Your rights are legally safeguarded when reporting in good faith.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Confidential Review
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Only authorized ethics committee members can access reports. All reviewers sign strict confidentiality agreements.
                </p>
              </div>
            </div>

            {/* Security Agreement */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Our Security Commitment to You
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    By using our reporting system, you can trust that we adhere to the highest security standards:
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Technical Safeguards:</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      SSL/TLS encryption for all data transmission
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      AES-256 encryption for data at rest
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      Regular security audits and penetration testing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      Multi-factor authentication for admin access
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      Automated backup with encryption
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Privacy Guarantees:</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      No personal data collection without consent
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      Anonymous submission options available
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      Data retention policies strictly enforced
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      Right to request data deletion
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      No sharing with third parties without consent
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Legal Compliance & Standards
                    </h5>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Our system complies with Ethiopian data protection laws, international privacy standards (GDPR principles), 
                      and university confidentiality policies. We are committed to maintaining the highest ethical standards 
                      in handling your sensitive information.
                    </p>
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
    </>
  );
}
