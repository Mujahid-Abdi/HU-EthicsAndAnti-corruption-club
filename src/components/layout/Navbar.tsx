import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, AlertTriangle, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { toast } from "sonner";

// Define navigation structure with dropdowns
const navigationStructure = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  {
    name: "Main",
    path: "/gallery",
    subItems: [
      { name: "Gallery", path: "/gallery" },
      { name: "Achievements", path: "/achievements" },
      { name: "Events", path: "/events", subItems: [
        { name: "Upcoming Events", path: "/events#upcoming" },
        { name: "Past Events", path: "/events#past" },
      ]},
    ]
  },
  {
    name: "News",
    path: "/news",
    subItems: [
      { name: "News", path: "/news#news" },
      { name: "Blogs", path: "/news#blogs" },
      { name: "Announcements", path: "/news#announcements" },
      { name: "Resources", path: "/news#resources" },
    ]
  },
  { name: "Contact", path: "/contact" },
];

const adminNavLinks = [
  { name: "Home", path: "/" },
  { name: "Admin", path: "/admin" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const { isRegistrationEnabled, isVotingEnabled } = useSystemSettings();

  const guestCta = (() => {
    if (isRegistrationEnabled) {
      return { to: "/auth?tab=signup", label: "Register" };
    }
    return { to: "/auth", label: "Sign In" };
  })();

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const newIsScrolled = scrollTop > 10;
      setIsScrolled(newIsScrolled);
    };

    // Set initial state
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getNavLinks = () => {
    let links = [...navigationStructure];
    
    // Add Vote link only if voting is enabled
    if (isVotingEnabled) {
      // Insert Vote before Contact
      links = [
        ...links.slice(0, -1),
        { name: "Vote", path: "/vote" },
        links[links.length - 1]
      ];
    }
    
    return links;
  };

  const isActive = (path: string) => {
    if (path === "#") return false;
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'bg-white/90 dark:bg-black/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg' 
          : 'bg-white/20 dark:bg-black/20 backdrop-blur-md border-b border-gray-200/30 dark:border-gray-700/30'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-12 h-12 rounded-full overflow-hidden group-hover:scale-105 transition-all duration-300 flex-shrink-0 ${
              isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
            }`}>
              <img 
                src="/haramaya-logo.jpg" 
                alt="Haramaya University Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <p className={`font-display font-bold leading-tight transition-colors duration-300 ${
                isScrolled 
                  ? 'text-black dark:text-white' 
                  : 'text-black dark:text-white drop-shadow-lg'
              }`}>
                HUEC
              </p>
              <p className={`text-xs transition-colors duration-300 ${
                isScrolled 
                  ? 'text-gray-700 dark:text-gray-300' 
                  : 'text-gray-800 dark:text-gray-200 drop-shadow-md'
              }`}>Ethics Club</p>
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
                      ? "text-primary bg-primary/10 hover:bg-primary/15"
                      : isScrolled 
                        ? "text-black dark:text-white hover:text-primary hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                        : "text-black dark:text-white hover:text-primary hover:bg-white/10 dark:hover:bg-black/10 drop-shadow-md"
                  }`}
                >
                  {link.name}
                </Link>
              ))
            ) : (
              // Regular user navigation with dropdowns
              getNavLinks().map((link: any) => (
                <div
                  key={link.path}
                  className="relative group"
                  onMouseEnter={() => link.subItems && setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {link.subItems ? (
                    // Dropdown menu item - clickable if has valid path
                    link.path !== "#" ? (
                      <Link
                        to={link.path}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                          isActive(link.path)
                            ? "text-primary bg-primary/10 hover:bg-primary/15"
                            : isScrolled 
                              ? "text-black dark:text-white hover:text-primary hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                              : "text-black dark:text-white hover:text-primary hover:bg-white/10 dark:hover:bg-black/10 drop-shadow-md"
                        }`}
                      >
                        {link.name}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                      </Link>
                    ) : (
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                          isActive(link.path)
                            ? "text-primary bg-primary/10 hover:bg-primary/15"
                            : isScrolled 
                              ? "text-black dark:text-white hover:text-primary hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                              : "text-black dark:text-white hover:text-primary hover:bg-white/10 dark:hover:bg-black/10 drop-shadow-md"
                        }`}
                      >
                        {link.name}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                      </button>
                    )
                  ) : (
                    // Regular link
                    <Link
                      to={link.path}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive(link.path)
                          ? "text-primary bg-primary/10 hover:bg-primary/15"
                          : isScrolled 
                            ? "text-black dark:text-white hover:text-primary hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                            : "text-black dark:text-white hover:text-primary hover:bg-white/10 dark:hover:bg-black/10 drop-shadow-md"
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                  
                  {/* Dropdown menu */}
                  {link.subItems && activeDropdown === link.name && (
                    <div className="absolute top-full left-0 pt-2 w-56 z-50">
                      <div className={`rounded-lg shadow-lg border overflow-hidden ${
                        isScrolled 
                          ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700' 
                          : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50'
                      }`}>
                        {link.subItems.map((subItem: any) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => setActiveDropdown(null)}
                            className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
              <>
                {isVotingEnabled && (
                  <Link to="/vote">
                    <Button
                      variant="glass"
                      size="default"
                      className="gap-2 rounded-full"
                    >
                      Vote Now
                    </Button>
                  </Link>
                )}
                <Link to={guestCta.to}>
                  <Button
                    variant={isVotingEnabled ? "outline" : "glass"}
                    size="default"
                    className="gap-2 rounded-full"
                  >
                    {guestCta.label}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled 
                ? 'text-black dark:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                : 'text-black dark:text-white hover:bg-white/10 dark:hover:bg-black/10 drop-shadow-md'
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className={`lg:hidden py-4 border-t animate-fade-in transition-all duration-300 ${
            isScrolled 
              ? 'border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-black/90 backdrop-blur-lg' 
              : 'border-gray-200/30 dark:border-gray-700/30 bg-white/20 dark:bg-black/20 backdrop-blur-md'
          }`}>
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
                        : "text-black dark:text-white hover:text-primary hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))
              ) : (
                // Regular user mobile navigation with expandable dropdowns
                getNavLinks().map((link: any) => (
                  <div key={link.path}>
                    {link.subItems ? (
                      // Dropdown menu item
                      <div>
                        <div className="flex items-center gap-1">
                          {link.path !== "#" ? (
                            // Clickable header with separate dropdown toggle
                            <>
                              <Link
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex-1 px-4 py-3 rounded-l-lg text-sm font-medium transition-colors text-left ${
                                  isActive(link.path)
                                    ? "bg-primary/20 text-primary hover:bg-primary/25"
                                    : "text-black dark:text-white hover:text-primary hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                                }`}
                              >
                                {link.name}
                              </Link>
                              <button
                                onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                                className={`px-3 py-3 rounded-r-lg text-sm font-medium transition-colors ${
                                  isActive(link.path)
                                    ? "bg-primary/20 text-primary hover:bg-primary/25"
                                    : "text-black dark:text-white hover:text-primary hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                                }`}
                              >
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                              </button>
                            </>
                          ) : (
                            // Non-clickable header (Main menu)
                            <button
                              onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                              className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                                isActive(link.path)
                                  ? "bg-primary/20 text-primary hover:bg-primary/25"
                                  : "text-black dark:text-white hover:text-primary hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                              }`}
                            >
                              {link.name}
                              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                            </button>
                          )}
                        </div>
                        {activeDropdown === link.name && (
                          <div className="ml-4 mt-2 space-y-1">
                            {link.subItems.map((subItem: any) => (
                              <Link
                                key={subItem.path}
                                to={subItem.path}
                                onClick={() => {
                                  setIsOpen(false);
                                  setActiveDropdown(null);
                                }}
                                className="block px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Regular link
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isActive(link.path)
                            ? "bg-primary/20 text-primary hover:bg-primary/25"
                            : "text-black dark:text-white hover:text-primary hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                        }`}
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))
              )}
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200/30 dark:border-gray-700/30 mt-2">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
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
                  <>
                    {isVotingEnabled && (
                      <Link to="/vote" onClick={() => setIsOpen(false)}>
                        <Button variant="glass" className="w-full gap-2">
                          Vote Now
                        </Button>
                      </Link>
                    )}
                    <Link to={guestCta.to} onClick={() => setIsOpen(false)}>
                      <Button variant={isVotingEnabled ? "outline" : "glass"} className="w-full gap-2">
                        {guestCta.label}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
