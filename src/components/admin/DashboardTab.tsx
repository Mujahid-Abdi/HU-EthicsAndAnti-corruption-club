import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Collections } from '@/lib/firestore';
import { 
  FileText, 
  Calendar, 
  Newspaper, 
  Users, 
  Vote, 
  UserCheck, 
  AlertTriangle,
  TrendingUp,
  Activity,
  BarChart3
} from 'lucide-react';

interface DashboardStats {
  totalReports: number;
  totalEvents: number;
  totalNews: number;
  totalUsers: number;
  totalVotes: number;
  activeElections: number;
  recentReports: number;
  publishedNews: number;
}

export default function DashboardTab() {
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 0,
    totalEvents: 0,
    totalNews: 0,
    totalUsers: 0,
    totalVotes: 0,
    activeElections: 0,
    recentReports: 0,
    publishedNews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    
    try {
      // Fetch all stats in parallel using Firebase
      const [
        reportsSnapshot,
        eventsSnapshot,
        newsSnapshot,
        usersSnapshot,
        votesSnapshot,
        electionsSnapshot,
        publishedNewsSnapshot
      ] = await Promise.all([
        getDocs(collection(db, Collections.REPORTS)),
        getDocs(collection(db, Collections.EVENTS)),
        getDocs(collection(db, Collections.NEWS)),
        getDocs(collection(db, Collections.USERS)),
        getDocs(collection(db, Collections.VOTES)),
        getDocs(query(collection(db, Collections.ELECTIONS), where('status', '==', 'open'))),
        getDocs(query(collection(db, Collections.NEWS), where('published', '==', true)))
      ]);

      // Get recent reports (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentReportsSnapshot = await getDocs(
        query(
          collection(db, Collections.REPORTS),
          where('createdAt', '>=', Timestamp.fromDate(sevenDaysAgo))
        )
      );

      setStats({
        totalReports: reportsSnapshot.size,
        totalEvents: eventsSnapshot.size,
        totalNews: newsSnapshot.size,
        totalUsers: usersSnapshot.size,
        totalVotes: votesSnapshot.size,
        activeElections: electionsSnapshot.size,
        recentReports: recentReportsSnapshot.size,
        publishedNews: publishedNewsSnapshot.size,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Reports',
      value: stats.totalReports,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      description: `${stats.recentReports} new this week`
    },
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      description: 'All events created'
    },
    {
      title: 'Published News',
      value: stats.publishedNews,
      icon: Newspaper,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      description: `${stats.totalNews} total articles`
    },
    {
      title: 'Registered Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      description: 'Active members'
    },
    {
      title: 'Total Votes',
      value: stats.totalVotes,
      icon: Vote,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      description: 'Across all elections'
    },
    {
      title: 'Active Elections',
      value: stats.activeElections,
      icon: UserCheck,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      description: 'Currently open'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard Overview</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your ethics club system performance and activity
          </p>
        </div>
        <Badge variant="outline" className="gap-2">
          <Activity className="w-4 h-4" />
          Live Data
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor} transition-transform duration-300 hover:scale-110`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Database Connection</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Authentication Service</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Email Service</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Operational
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">File Storage</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Available
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">
                  {stats.recentReports} new reports submitted this week
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">
                  {stats.activeElections} elections currently active
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">
                  {stats.publishedNews} news articles published
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">
                  {stats.totalUsers} users registered in system
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}