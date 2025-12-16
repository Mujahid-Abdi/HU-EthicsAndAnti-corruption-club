import { Link } from "react-router-dom";
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-forest-dark text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                <Shield className="w-7 h-7 text-gold" />
              </div>
              <div>
                <p className="font-display font-bold text-lg">Ethics & Anti-Corruption</p>
                <p className="text-xs text-primary-foreground/60">Haramaya University</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Building a culture of integrity, transparency, and accountability within our university community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4 text-gold">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Report Incident", path: "/report" },
                { name: "Resources", path: "/resources" },
                { name: "Events", path: "/events" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4 text-gold">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="w-4 h-4 mt-0.5 text-gold" />
                <span>Haramaya University<br />Dire Dawa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail className="w-4 h-4 text-gold" />
                <a href="mailto:ethics@haramaya.edu.et" className="hover:text-gold transition-colors">
                  ethics@haramaya.edu.et
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Phone className="w-4 h-4 text-gold" />
                <span>+251-25-553-0006</span>
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4 text-gold">Stay Connected</h4>
            <div className="flex gap-3 mb-6">
              {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-gold hover:text-forest-dark transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <p className="text-sm text-primary-foreground/60">
              Follow us for updates on events, workshops, and ethics initiatives.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/50">
              © {new Date().getFullYear()} Haramaya University Ethics and Anti-Corruption Club. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-primary-foreground/50">
              <Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-gold transition-colors">Terms of Use</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
