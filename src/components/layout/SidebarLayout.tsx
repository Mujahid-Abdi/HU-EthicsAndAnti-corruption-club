import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { toast } from 'sonner';
import { 
  Home,
  Info,
  Newspaper,
  Image,
  Award,
  Calendar,
  Phone,
  Vote,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  const { isVotingEnabled } = useSystemSettings();

  const getNavItems = () => {
    const baseItems = [
      { name: "Home", path: "/", icon: Home },
      { name: "About", path: "/about", icon: Info },
      { name: "News", path: "/news", icon: Newspaper },
      { name: "Gallery", path: "/gallery", icon: Image },
      { name: "Achievements", path: "/achievements", icon: Award },
      { name: "Events", path: "/programs", icon: Calendar },
    ];
    
    // Add Vote link only if voting is enabled
    if (isVotingEnabled) {
      baseItems.push({ name: "Vote", path: "/vote", icon: Vote });
    }
    
    baseItems.push({ name: "Contact", path: "/contact", icon: Phone });
    
    // Add admin link for admins
    if (isAdmin) {
      baseItems.push({ name: "Admin", path: "/admin", icon: Shield });
    }
    
    return baseItems;
  };

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary/95 to-orange-dark shadow-lg">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-white hover:bg-white/10 transition-colors"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
                  <img 
                    src="/haramaya-logo.jpg" 
                    alt="Haramaya University Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
                    HUEC
                  </h1>
                  <p className="text-white/80 text-sm">
                    Ethics & Anti-Corruption Club
                  </p>
                </div>
              </Link>
            </div>
            
            {/* Theme Toggle in Header */}
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200 dark:border-gray-700",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">Navigation</h2>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <nav className="space-y-2">
                {getNavItems().map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Button
                        variant={isActive(item.path) ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3 h-11 transition-all duration-300 group",
                          isActive(item.path) 
                            ? "bg-primary text-white shadow-md hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02]" 
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:scale-[1.01] hover:shadow-sm"
                        )}
                      >
                        <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </ScrollArea>

            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              {!isAdmin && (
                <Link to="/report">
                  <Button
                    variant="alert"
                    className="w-full justify-start gap-3 h-11 transition-all duration-300 hover:scale-[1.02] hover:shadow-md group"
                  >
                    <AlertTriangle className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    Report Issue
                  </Button>
                </Link>
              )}
              
              {user && (
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="w-full justify-start gap-3 h-11 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-md group"
                >
                  <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 bg-gray-50 dark:bg-gray-900 transition-colors min-h-screen">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}