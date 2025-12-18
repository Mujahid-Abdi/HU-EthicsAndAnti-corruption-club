import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, AlertTriangle, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { toast } from "sonner";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Achievements", path: "/achievements" },
  { name: "Programs", path: "/programs" },
  { name: "Vote", path: "/vote" },
  { name: "Contact", path: "/contact" },
];

const adminNavLinks = [
  { name: "Dashboard", path: "/" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const { isVotingEnabled } = useSystemSettings();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/20 dark:bg-gray-900/30 backdrop-blur-lg border-b border-white/30 dark:border-gray-700/30 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
              <img 
                src="/haramaya-logo.jpg" 
                alt="Haramaya University Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <p className="font-display font-bold text-gray-900 dark:text-white leading-tight">
                HUEC
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-300">Ethics Club</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {isAdmin ? (
              // Admin navigation - only Dashboard
              adminNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "text-primary bg-white/15 dark:bg-gray-800/25 hover:bg-white/20 dark:hover:bg-gray-800/30"
                      : "text-gray-800 dark:text-gray-200 hover:text-primary hover:bg-white/10 dark:hover:bg-gray-800/20"
                  }`}
                >
                  {link.name}
                </Link>
              ))
            ) : (
              // Regular user navigation
              navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "text-primary bg-white/15 dark:bg-gray-800/25 hover:bg-white/20 dark:hover:bg-gray-800/30"
                      : "text-gray-800 dark:text-gray-200 hover:text-primary hover:bg-white/10 dark:hover:bg-gray-800/20"
                  }`}
                >
                  {link.name}
                </Link>
              ))
            )}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {!isAdmin && (
              <Link to="/report">
                <Button
                  variant="alert"
                  size="default"
                  className="gap-2 rounded-full"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Report
                </Button>
              </Link>
            )}
            {user ? (
              <Button
                variant="ghost"
                size="default"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button
                  variant="glass"
                  size="default"
                  className="gap-2 rounded-full"
                >
                  Get started
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-white/30 dark:border-gray-700/30 animate-fade-in bg-white/20 dark:bg-gray-900/30 backdrop-blur-lg">
            <div className="flex flex-col gap-2">
              {isAdmin ? (
                // Admin mobile navigation - only Dashboard
                adminNavLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? "bg-primary/20 text-primary hover:bg-primary/25"
                        : "text-gray-800 dark:text-gray-200 hover:text-primary hover:bg-white/15 dark:hover:bg-gray-800/15"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))
              ) : (
                // Regular user mobile navigation
                navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? "bg-primary/20 text-primary hover:bg-primary/25"
                        : "text-gray-800 dark:text-gray-200 hover:text-primary hover:bg-white/15 dark:hover:bg-gray-800/15"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))
              )}
              <div className="flex flex-col gap-2 pt-4 border-t border-white/20 dark:border-gray-800/20 mt-2">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
                {!isAdmin && (
                  <Link to="/report" onClick={() => setIsOpen(false)}>
                    <Button variant="alert" className="w-full gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Report Anonymously
                    </Button>
                  </Link>
                )}
                {user ? (
                  <Button
                    variant="ghost"
                    className="w-full gap-2"
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="glass" className="w-full gap-2">
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
