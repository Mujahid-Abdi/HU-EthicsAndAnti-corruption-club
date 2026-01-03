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

const adminGroups = [
  {
    name: 'General',
    id: 'general',
    roles: ['admin', 'president', 'vice_president', 'secretary'],
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: Shield },
    ]
  },
  {
    name: 'Secretary',
    id: 'secretary',
    roles: ['admin', 'president', 'vice_president', 'secretary'],
    items: [
      { id: 'users', label: 'Users', icon: User },
      { id: 'events', label: 'Events', icon: Calendar },
      { id: 'news', label: 'News', icon: Newspaper },
      { id: 'announcements', label: 'Announcements', icon: Lightbulb },
      { id: 'resources', label: 'Resources', icon: BookOpen },
      { id: 'gallery', label: 'Gallery', icon: Image },
    ]
  },
  {
    name: 'Vice Role',
    id: 'vice_role',
    roles: ['admin', 'president', 'vice_president'],
    items: [
      { id: 'reports', label: 'Reports', icon: FileText },
      { id: 'achievements', label: 'Achievements', icon: Award },
      { id: 'vote-management', label: 'Vote Management', icon: Vote },
    ]
  },
  {
    name: 'System Settings',
    id: 'system_settings',
    roles: ['admin', 'president'],
    items: [
      { id: 'settings', label: 'General Settings', icon: Settings },
      { id: 'about', label: 'About Page', icon: Info },
      { id: 'contact', label: 'Contact Page', icon: Phone },
      { id: 'executives', label: 'Executives', icon: UserCog },
    ]
  }
];

export function AdminLayout({ children, activeTab, onTabChange }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const { signOut, userProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isVotingEnabled } = useSystemSettings();
  const navigate = useNavigate();

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Filter groups and items based on role and settings
  const filteredGroups = adminGroups.filter(group => {
    // Check if user has access to this group
    const userRole = userProfile?.role || 'member';
    if (!group.roles.includes(userRole)) return false;

    // Further filter items within the group
    group.items = group.items.filter(item => {
      if (item.id === 'vote-management' && !isVotingEnabled) return false;
      return true;
    });

    return group.items.length > 0;
  });

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
                  {userProfile?.role ? `${userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1).replace('_', ' ')} Panel` : 'Loading...'}
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
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-center">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Main Navigation</h2>
            </div>
            
            <ScrollArea className="flex-1 p-3">
              <nav className="space-y-4">
                {filteredGroups.map((group) => (
                  <div key={group.id} className="space-y-1">
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors duration-200"
                    >
                      <span>{group.name}</span>
                      <ChevronRight className={cn(
                        "h-3 w-3 transition-transform duration-200",
                        !collapsedGroups[group.id] && "rotate-90"
                      )} />
                    </button>
                    {!collapsedGroups[group.id] && (
                      <div className="space-y-1 mt-1">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = activeTab === item.id;
                          return (
                            <Button
                              key={item.id}
                              variant={isActive ? "default" : "ghost"}
                              className={cn(
                                "w-full justify-start gap-3 h-10 transition-all duration-300 group rounded-lg px-4",
                                isActive 
                                  ? "bg-primary text-white shadow-md hover:bg-primary/90" 
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                              )}
                              onClick={() => {
                                onTabChange(item.id);
                                setSidebarOpen(false);
                              }}
                            >
                              <Icon className={cn(
                                "h-4 w-4 transition-transform duration-300",
                                isActive ? "scale-110" : "group-hover:scale-110"
                              )} />
                              <span className="text-sm font-medium">{item.label}</span>
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
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