import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, Calendar, Newspaper, BookOpen, Users, UserCog, Vote, User, Image } from 'lucide-react';
import ReportsTab from '@/components/admin/ReportsTab';
import EventsTab from '@/components/admin/EventsTab';
import NewsTab from '@/components/admin/NewsTab';
import GalleryTab from '@/components/admin/GalleryTab';
import ResourcesTab from '@/components/admin/ResourcesTab';
import UsersTab from '@/components/admin/UsersTab';
import ExecutivesTab from '@/components/admin/ExecutivesTab';
import ElectionsTab from '@/components/admin/ElectionsTab';
import CandidatesTab from '@/components/admin/CandidatesTab';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('reports');

  return (
    <Layout>
      <div className="bg-gradient-hero py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-gold" />
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-primary-foreground/80">
            Manage reports, events, news, gallery, resources, elections, candidates, executives, and users
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-9 mb-8">
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              <span className="hidden sm:inline">News</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Resources</span>
            </TabsTrigger>
            <TabsTrigger value="elections" className="flex items-center gap-2">
              <Vote className="h-4 w-4" />
              <span className="hidden sm:inline">Elections</span>
            </TabsTrigger>
            <TabsTrigger value="candidates" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Candidates</span>
            </TabsTrigger>
            <TabsTrigger value="executives" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              <span className="hidden sm:inline">Executives</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <ReportsTab />
          </TabsContent>
          <TabsContent value="events">
            <EventsTab />
          </TabsContent>
          <TabsContent value="news">
            <NewsTab />
          </TabsContent>
          <TabsContent value="gallery">
            <GalleryTab />
          </TabsContent>
          <TabsContent value="resources">
            <ResourcesTab />
          </TabsContent>
          <TabsContent value="elections">
            <ElectionsTab />
          </TabsContent>
          <TabsContent value="candidates">
            <CandidatesTab />
          </TabsContent>
          <TabsContent value="executives">
            <ExecutivesTab />
          </TabsContent>
          <TabsContent value="users">
            <UsersTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
