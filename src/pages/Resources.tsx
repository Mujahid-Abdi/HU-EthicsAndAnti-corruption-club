import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Download,
  ExternalLink,
  BookOpen,
  Scale,
  Building,
  Globe,
  ChevronRight,
  ArrowRight,
  Bookmark,
  Search,
  FileQuestion,
  Lightbulb,
  Loader2,
  Lock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { FirestoreService, Collections } from '@/lib/firestore';
import { Badge } from "@/components/ui/badge";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string | null;
  category: string | null;
  isMemberOnly: boolean | null;
  createdAt: any;
  // Legacy support
  file_url?: string;
  is_member_only?: boolean;
  // Additional fields for different resource types
  type?: string; // 'document' | 'link' | 'glossary'
  size?: string; // For documents
  url?: string; // For external links
  term?: string; // For glossary items
  definition?: string; // For glossary items
}

// Static data removed. All resources are now managed dynamically via the Admin Panel.

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const data = await FirestoreService.getAll(Collections.RESOURCES);
      const mappedData = data.map((item: any) => ({
        ...item,
        fileUrl: item.fileUrl || item.file_url || null,
        isMemberOnly: item.isMemberOnly || item.is_member_only || false,
        createdAt: item.createdAt || item.created_at || null,
      }));
      setResources(mappedData as Resource[]);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
    setIsLoading(false);
  };

  // Filter resources based on search term
  const filteredResources = resources.filter(resource => {
    const searchLower = searchTerm.toLowerCase();
    return (
      resource.title.toLowerCase().includes(searchLower) ||
      (resource.description && resource.description.toLowerCase().includes(searchLower)) ||
      (resource.category && resource.category.toLowerCase().includes(searchLower)) ||
      (resource.term && resource.term.toLowerCase().includes(searchLower)) ||
      (resource.definition && resource.definition.toLowerCase().includes(searchLower))
    );
  });

  // Group resources by category
  const resourcesByCategory = filteredResources.reduce((acc, resource) => {
    const category = resource.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  // Separate glossary items
  const glossaryItems = filteredResources.filter(resource => resource.type === 'glossary');

  const renderResourceCard = (resource: Resource) => {
    // Handle documents (default)
    return (
      <Card key={resource.id} className="group hover:shadow-xl transition-all duration-300 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-bold">{resource.title}</CardTitle>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {resource.isMemberOnly && (
                  <Badge variant="secondary" className="text-[10px] h-5">
                    <Lock className="w-2.5 h-2.5 mr-1" />
                    Members Only
                  </Badge>
                )}
                <Badge variant="outline" className="text-[10px] h-5 bg-gray-50/50 dark:bg-gray-800/50">
                  {resource.size || 'Document'}
                </Badge>
              </div>
            </div>
          </div>
          {resource.description && (
            <CardDescription className="text-sm line-clamp-3 leading-relaxed">
              {resource.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardFooter className="flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/30 py-3 mt-4">
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            {resource.createdAt && new Date(resource.createdAt.seconds * 1000).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </span>
          {resource.fileUrl && (
            <Button
              variant="default"
              size="sm"
              className="gap-2 h-8 rounded-full shadow-sm"
              onClick={() => {
                const url = resource.fileUrl || resource.file_url;
                if (url?.startsWith('http') || url?.startsWith('/') || url?.startsWith('uploaded_')) {
                  window.open(url, '_blank');
                } else {
                  console.log('Resource access:', url);
                }
              }}
            >
              <Download className="w-3.5 h-3.5" />
              Access
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <>
      {/* Header Section */}
      <section className="pt-24 pb-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                Knowledge Center
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Resources & Materials
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access our comprehensive collection of documents, policies, and
              educational materials on ethics and anti-corruption.
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb and Search Bar Section */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <Breadcrumb 
            items={[
              { label: "News", href: "/news" },
              { label: "Resources" }
            ]} 
          />
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <Input
              type="search"
              placeholder="Search resources, policies, and documents..."
              className="pl-12 h-14 bg-white border-2 border-gray-200 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Resources Lists */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {Object.entries(resourcesByCategory)
            .filter(([category]) => category !== 'Glossary')
            .map(([category, categoryResources]) => (
              <div key={category} className="mb-20">
                <div className="flex items-center gap-3 mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Scale className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    {category}
                  </h3>
                  <Badge variant="secondary" className="ml-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {categoryResources.length} Items
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryResources.map(resource => renderResourceCard(resource))}
                </div>
              </div>
          ))}

          {/* If no resources were found at all */}
          {!isLoading && Object.keys(resourcesByCategory).length === 0 && (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
              <FileQuestion className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No resources found</h3>
              <p className="text-muted-foreground">Try adjusting your search term or check back later.</p>
            </div>
          )}
        </div>
      </section>

      {/* Glossary Section (Sticky bottom styling) */}
      {glossaryItems.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 mb-4">
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Key Concepts</span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Terminology Glossary
                </h2>
                <p className="text-muted-foreground">
                  The fundamental language of ethics and anti-corruption at Haramaya University.
                </p>
              </div>

              <div className="grid gap-6">
                {glossaryItems.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-900/50 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-5">
                      <div className="mt-1 p-2 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-500 transform group-hover:rotate-12 transition-transform">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 transition-colors">
                          {item.term || item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">
                          {item.definition || item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
