import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { toast } from 'sonner';
import { 
  Shield,
  FileText,
  Calendar,
  Newspaper,
  BookOpen,
  Scale,
  Users,
  Award,
  Heart,
  Lightbulb,
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Moon,
  Sun,
  Image,
  Award as AwardIcon,
  Settings,
  UserCog,
  User,
  Vote,
  Info,
  Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const adminNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Shield },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'achievements', label: 'Achievements', icon: Award },
  { id: 'resources', label: 'Resources', icon: BookOpen },
  { id: 'about', label: 'About Page', icon: Info },
  { id: 'contact', label: 'Contact Page', icon: Phone },
  { id: 'executives', label: 'Executives', icon: UserCog },
  { id: 'users', label: 'Users', icon: User },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

const votingNavItems = [
  { id: 'vote-management', label: 'Vote Management', icon: Vote },
];

export function AdminLayout({ children, activeTab, onTabChange }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isVotingEnabled } = useSystemSettings();
  const navigate = useNavigate();

  // Combine navigation items based on voting system status
  const navigationItems = [
    ...adminNavItems.slice(0, 7), // Dashboard through Resources
    ...(isVotingEnabled ? votingNavItems : []), // Elections and Candidates only if voting enabled
    ...adminNavItems.slice(7), // Executives, Users, Settings
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
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
              <Shield className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
                  Admin Dashboard
                </h1>
                <p className="text-white/80 text-sm">
                  Manage your ethics club system
                </p>
              </div>
            </div>
            
            {/* Theme Toggle in Header */}
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full w-10 h-10 text-white hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? (
                    <Moon className="w-5 h-5 transition-transform duration-300" />
                  ) : (
                    <Sun className="w-5 h-5 transition-transform duration-300" />
                  )}
                </Button>
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
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-11 transition-all duration-300 group",
                        activeTab === item.id 
                          ? "bg-primary text-white shadow-md hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02]" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:scale-[1.01] hover:shadow-sm"
                      )}
                      onClick={() => {
                        onTabChange(item.id);
                        setSidebarOpen(false);
                      }}
                    >
                      <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
            </ScrollArea>

            {/* Sign Out Button */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full justify-start gap-3 h-11 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-md group"
              >
                <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                Sign Out
              </Button>
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
        <main className="flex-1 lg:ml-0 bg-gray-50 dark:bg-gray-900 transition-colors">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}