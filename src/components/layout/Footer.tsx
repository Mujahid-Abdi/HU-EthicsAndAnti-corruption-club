import { Link } from "react-router-dom";
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Footer() {
  const { isAdmin } = useAuth();

  // Don't show footer for admin users
  if (isAdmin) {
    return null;
  }

  return (
    <footer className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-black border-t border-gray-200/80 dark:border-gray-800">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60 dark:opacity-100">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-orange-light/10 dark:from-primary/10 dark:to-orange-light/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-gradient-to-tl from-orange-dark/10 to-primary/10 dark:from-orange-dark/10 dark:to-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white shadow-lg flex-shrink-0">
                <img 
                  src="/haramaya-logo.jpg" 
                  alt="Haramaya University Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-display font-bold text-xl text-gray-900 dark:text-white">HUEC</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Ethics Club</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Building a culture of integrity, transparency, and accountability within our university community.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-medium text-primary dark:text-primary">Active Since 2024</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5 text-gray-900 dark:text-white flex items-center gap-2">
              Quick Links
              <div className="h-px flex-1 bg-gradient-to-r from-gray-300 dark:from-gray-700 to-transparent" />
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Achievements", path: "/achievements" },
                { name: "Programs", path: "/programs" },
                { name: "Report Incident", path: "/report" },
                { name: "Vote", path: "/vote" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600 group-hover:bg-primary transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5 text-gray-900 dark:text-white flex items-center gap-2">
              Contact Us
              <div className="h-px flex-1 bg-gradient-to-r from-gray-300 dark:from-gray-700 to-transparent" />
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 dark:group-hover:bg-primary/30 transition-colors shadow-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="pt-1">Haramaya University<br />Dire Dawa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 dark:group-hover:bg-primary/30 transition-colors shadow-sm">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <a href="mailto:ethics@haramaya.edu.et" className="hover:text-primary transition-colors">
                  ethics@haramaya.edu.et
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 dark:group-hover:bg-primary/30 transition-colors shadow-sm">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span>+251-25-553-0006</span>
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5 text-gray-900 dark:text-white flex items-center gap-2">
              Stay Connected
              <div className="h-px flex-1 bg-gradient-to-r from-gray-300 dark:from-gray-700 to-transparent" />
            </h4>
            <div className="flex gap-3 mb-6">
              {[
                { Icon: Facebook, label: "Facebook" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Linkedin, label: "LinkedIn" }
              ].map(({ Icon, label }, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={label}
                  className="w-11 h-11 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-primary hover:border-primary dark:hover:bg-primary dark:hover:border-primary hover:text-white transition-all hover:scale-110 hover:shadow-lg hover:shadow-primary/25 shadow-sm"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Follow us for updates on events, workshops, and ethics initiatives.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} Haramaya University Ethics and Anti-Corruption Club. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <span className="text-gray-400 dark:text-gray-600">•</span>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Use</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}