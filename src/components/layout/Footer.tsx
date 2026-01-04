import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { cn } from "@/lib/utils";

export function Footer() {
  const { isAdmin } = useAuth();
  const { isVotingEnabled } = useSystemSettings();
  const [openSections, setOpenSections] = useState<string[]>([]);

  // Don't show footer for admin users
  if (isAdmin) {
    return null;
  }

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section) 
        : [...prev, section]
    );
  };

  const getQuickLinks = () => {
    const baseLinks = [
      { name: "Home", path: "/" },
      { name: "About Us", path: "/about" },
      { name: "Achievements", path: "/achievements" },
      { name: "Programs", path: "/programs" },
      { name: "Report Incident", path: "/report" },
    ];
    
    // Add Vote link only if voting is enabled
    if (isVotingEnabled) {
      baseLinks.push({ name: "Vote", path: "/vote" });
    }
    
    return baseLinks;
  };

  return (
    <footer className="relative bg-gray-300 dark:bg-gray-800 border-t border-gray-400/80 dark:border-gray-600/50 transition-colors duration-300">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 dark:opacity-15">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-300/40 to-indigo-300/40 dark:from-blue-500/25 dark:to-indigo-500/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-gradient-to-tl from-purple-300/40 to-blue-300/40 dark:from-purple-500/25 dark:to-blue-500/25 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand - Always Expanded */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white dark:bg-gray-700 shadow-lg border-2 border-gray-300 dark:border-gray-500 flex-shrink-0 transition-transform hover:scale-105 duration-300">
                <img 
                  src="/haramaya-logo.jpg" 
                  alt="Haramaya University Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-display font-bold text-xl text-gray-700 dark:text-gray-100 leading-tight tracking-tight">HUEC</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <p className="text-xs uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400">Ethics Club</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
              Empowering students through integrity, transparency, and accountability. We are committed to building a cleaner, more ethical future for Haramaya University.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 shadow-sm transition-all hover:bg-blue-100 dark:hover:bg-blue-900/30">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] uppercase tracking-wider font-bold text-blue-800 dark:text-blue-300 italic">Official Campus Organization</span>
              </div>
            </div>
          </div>

          {/* Quick Links - Collapsible on Mobile */}
          <div className="border-t border-gray-400/50 dark:border-gray-700/50 pt-6 md:border-0 md:pt-0">
            <button 
              onClick={() => toggleSection('links')}
              className="flex items-center justify-between w-full md:cursor-default"
            >
              <h4 className="font-display font-bold text-lg text-gray-800 dark:text-gray-100 flex items-center gap-2 group">
                Quick Links
                <div className="hidden md:block h-px w-12 bg-gradient-to-r from-primary to-transparent" />
              </h4>
              <ChevronDown className={cn(
                "w-5 h-5 text-gray-500 transition-transform duration-300 md:hidden",
                openSections.includes('links') && "rotate-180"
              )} />
            </button>
            <div className={cn(
              "overflow-hidden transition-all duration-300 md:block mt-5",
              openSections.includes('links') ? "max-h-96 opacity-100" : "max-h-0 opacity-0 md:max-h-96 md:opacity-100"
            )}>
              <ul className="grid grid-cols-2 md:grid-cols-1 gap-y-3 gap-x-4">
                {getQuickLinks().map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors inline-flex items-center gap-2 group py-0.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600 group-hover:bg-primary group-hover:scale-125 transition-all duration-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact - Collapsible on Mobile */}
          <div className="border-t border-gray-400/50 dark:border-gray-700/50 pt-6 md:border-0 md:pt-0">
            <button 
              onClick={() => toggleSection('contact')}
              className="flex items-center justify-between w-full md:cursor-default"
            >
              <h4 className="font-display font-bold text-lg text-gray-800 dark:text-gray-100 flex items-center gap-2 group">
                Contact Us
                <div className="hidden md:block h-px w-12 bg-gradient-to-r from-primary to-transparent" />
              </h4>
              <ChevronDown className={cn(
                "w-5 h-5 text-gray-500 transition-transform duration-300 md:hidden",
                openSections.includes('contact') && "rotate-180"
              )} />
            </button>
            <div className={cn(
              "overflow-hidden transition-all duration-300 md:block mt-5",
              openSections.includes('contact') ? "max-h-96 opacity-100" : "max-h-0 opacity-0 md:max-h-96 md:opacity-100"
            )}>
              <ul className="space-y-4">
                <li className="flex items-start gap-4 text-sm text-gray-600 dark:text-gray-400 group">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0 group-hover:border-primary/50 transition-colors">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <span className="pt-1 leading-relaxed">Haramaya University<br />Dire Dawa, Ethiopia</span>
                </li>
                <li className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 group">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0 group-hover:border-primary/50 transition-colors">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <a href="mailto:ethics@haramaya.edu.et" className="hover:text-primary transition-colors font-medium">
                    ethics@haramaya.edu.et
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social - Collapsible on Mobile */}
          <div className="border-t border-gray-400/50 dark:border-gray-700/50 pt-6 md:border-0 md:pt-0">
            <button 
              onClick={() => toggleSection('social')}
              className="flex items-center justify-between w-full md:cursor-default"
            >
              <h4 className="font-display font-bold text-lg text-gray-800 dark:text-gray-100 flex items-center gap-2 group">
                Stay Connected
                <div className="hidden md:block h-px w-12 bg-gradient-to-r from-primary to-transparent" />
              </h4>
              <ChevronDown className={cn(
                "w-5 h-5 text-gray-500 transition-transform duration-300 md:hidden",
                openSections.includes('social') && "rotate-180"
              )} />
            </button>
            <div className={cn(
              "overflow-hidden transition-all duration-300 md:block mt-5",
              openSections.includes('social') ? "max-h-96 opacity-100" : "max-h-0 opacity-0 md:max-h-96 md:opacity-100"
            )}>
              <div className="flex gap-4 mb-6">
                {[
                  { Icon: Facebook, label: "Facebook" },
                  { Icon: Twitter, label: "Twitter" },
                  { Icon: Linkedin, label: "LinkedIn" }
                ].map(({ Icon, label }, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label={label}
                    className="w-11 h-11 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-primary hover:border-primary dark:hover:bg-primary dark:hover:border-primary hover:text-white transition-all hover:scale-110 hover:shadow-lg hover:shadow-primary/25 shadow-sm"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic opacity-80">
                "Small acts of integrity lead to big changes."
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-400 dark:border-gray-600">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center md:text-left">
              © {new Date().getFullYear()} Haramaya University Ethics and Anti-Corruption Club. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-300">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <span className="text-gray-400 dark:text-gray-500">•</span>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Use</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}