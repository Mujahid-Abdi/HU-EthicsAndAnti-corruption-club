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
    name: 'Dashboard',
    id: 'dashboard',
    roles: ['admin', 'president', 'vice_president', 'secretary'],
    items: [
      { id: 'dashboard', label: 'Overview', icon: Shield },
    ]
  },
  {
    name: 'Content Management',
    id: 'content',
    roles: ['admin', 'president', 'vice_president', 'secretary'],
    items: [
      { id: 'news', label: 'News', icon: Newspaper },
      { id: 'blogs', label: 'Blogs', icon: FileText },
      { id: 'announcements', label: 'Announcements', icon: Lightbulb },
      { id: 'resources', label: 'Resources', icon: BookOpen },
    ]
  },
  {
    name: 'Events & Activities',
    id: 'events_activities',
    roles: ['admin', 'president', 'vice_president', 'secretary'],
    items: [
      { id: 'events', label: 'Events', icon: Calendar },
      { id: 'gallery', label: 'Gallery', icon: Image },
      { id: 'achievements', label: 'Achievements', icon: Award },
    ]
  },
  {
    name: 'User Management',
    id: 'users',
    roles: ['admin', 'president', 'vice_president', 'secretary'],
    items: [
      { id: 'users', label: 'Users', icon: User },
    ]
  },
  {
    name: 'Reports & Voting',
    id: 'reports_voting',
    roles: ['admin', 'president', 'vice_president'],
    items: [
      { id: 'reports', label: 'Reports', icon: FileText },
      { id: 'vote-management', label: 'Vote Management', icon: Vote },
    ]
  },
  {
    name: 'System Settings',
    id: 'system_settings',
    roles: ['admin', 'president'],
    items: [
      { id: 'home-management', label: 'Home Page', icon: Shield },
      { id: 'about', label: 'About Page', icon: Info },
      { id: 'contact', label: 'Contact Page', icon: Phone },
      { id: 'executives', label: 'Executives', icon: UserCog },
      { id: 'settings', label: 'General Settings', icon: Settings },
    ]
  }
];

export function AdminLayout({ children, activeTab, onTabChange }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    dashboard: false, // Keep dashboard open by default
    content: true,
    events_activities: true,
    users: true,
    reports_voting: true,
    system_settings: true
  });
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
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-white hover:bg-white/10 transition-colors p-2"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white truncate">
                  Admin Dashboard
                </h1>
                <p className="text-white/80 text-xs sm:text-sm truncate">
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
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-primary/5 to-orange-dark/5 dark:from-primary/10 dark:to-orange-dark/10">
              <div className="flex items-center gap-2 justify-center">
                <Shield className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Navigation</h2>
              </div>
            </div>
            
            <ScrollArea className="flex-1 p-3">
              <nav className="space-y-3">
                {filteredGroups.map((group) => {
                  // Assign icons to groups
                  const groupIcons: Record<string, any> = {
                    dashboard: Shield,
                    content: FileText,
                    events_activities: Calendar,
                    users: Users,
                    reports_voting: Scale,
                    system_settings: Settings
                  };
                  const GroupIcon = groupIcons[group.id] || Shield;
                  
                  return (
                    <div key={group.id} className="space-y-1">
                      <button
                        onClick={() => toggleGroup(group.id)}
                        className="flex items-center justify-between w-full px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-all duration-200 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 group"
                      >
                        <div className="flex items-center gap-2">
                          <GroupIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
                          <span>{group.name}</span>
                        </div>
                        <ChevronRight className={cn(
                          "h-3.5 w-3.5 transition-transform duration-200",
                          !collapsedGroups[group.id] && "rotate-90"
                        )} />
                      </button>
                      {!collapsedGroups[group.id] && (
                        <div className="space-y-1 mt-1 ml-2 pl-3 border-l-2 border-gray-200 dark:border-gray-700">
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
                                    ? "bg-primary text-white shadow-md hover:bg-primary/90 scale-[1.02]" 
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:translate-x-1"
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
        <main className="flex-1 w-full bg-gray-50 dark:bg-gray-900 transition-colors overflow-hidden">
          <div className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}