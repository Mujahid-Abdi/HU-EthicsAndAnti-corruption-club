import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import ReportsTab from '@/components/admin/ReportsTab';
import EventsTab from '@/components/admin/EventsTab';
import NewsTab from '@/components/admin/NewsTab';
import BlogsTab from '@/components/admin/BlogsTab';
import AnnouncementsTab from '@/components/admin/AnnouncementsTab';
import GalleryTab from '@/components/admin/GalleryTab';
import AchievementsTab from '@/components/admin/AchievementsTab';
import ResourcesTab from '@/components/admin/ResourcesTab';
import AboutTab from '@/components/admin/AboutTab';
import ContactTab from '@/components/admin/ContactTab';
import UsersTab from '@/components/admin/UsersTab';
import ExecutivesTab from '@/components/admin/ExecutivesTab';
import VoteManagementTab from '@/components/admin/VoteManagementTab';
import ContentManagementTab from '@/components/admin/ContentManagementTab';
import HomeManagementTab from '@/components/admin/HomeManagementTab';
import SystemSettingsTab from '@/components/admin/SystemSettingsTab';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Reports</h3>
                <p className="text-3xl font-bold text-primary">24</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">+3 this week</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Active Events</h3>
                <p className="text-3xl font-bold text-primary">8</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">2 upcoming</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">News Articles</h3>
                <p className="text-3xl font-bold text-primary">15</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">5 published</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-primary">156</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">+12 this month</p>
              </div>
            </div>
          </div>
        );
      case 'reports':
        return <ReportsTab />;
      case 'events':
        return <EventsTab />;
      case 'news':
        return <NewsTab />;
      case 'blogs':
        return <BlogsTab />;
      case 'announcements':
        return <AnnouncementsTab />;
      case 'gallery':
        return <GalleryTab />;
      case 'achievements':
        return <AchievementsTab />;
      case 'resources':
        return <ResourcesTab />;
      case 'about':
        return <AboutTab />;
      case 'contact':
        return <ContactTab />;
      case 'vote-management':
        return <VoteManagementTab />;
      case 'executives':
        return <ExecutivesTab />;
      case 'users':
        return <UsersTab />;
      case 'home-management':
        return <HomeManagementTab />;
      case 'settings':
        return <SystemSettingsTab />;
      default:
        return <ReportsTab />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderTabContent()}
    </AdminLayout>
  );
}
