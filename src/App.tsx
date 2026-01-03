import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { SystemSettingsProvider } from "@/hooks/useSystemSettings";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { VotingProtectedRoute } from "@/components/auth/VotingProtectedRoute";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Achievements from "./pages/Achievements";
import Programs from "./pages/Programs";
import Report from "./pages/Report";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Announcements from "./pages/Announcements";
import Gallery from "./pages/Gallery";
import Join from "./pages/Join";
import Contact from "./pages/Contact";
import Vote from "./pages/Vote";
import VoteProgress from "./pages/VoteProgress";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <SystemSettingsProvider>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Routes>
              {/* Admin route with its own layout */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              
              {/* Auth route without navbar */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Voting route moved to regular layout */}
              
              {/* All other routes with Layout */}
              <Route path="/*" element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/achievements" element={<Achievements />} />
                    <Route path="/programs" element={<Programs />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/news/:id" element={<NewsDetail />} />
                    <Route path="/announcements" element={<Announcements />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/report" element={<Report />} />
                    <Route path="/vote" element={
                      <VotingProtectedRoute>
                        <Vote />
                      </VotingProtectedRoute>
                    } />
                    <Route path="/join" element={<Join />} />
                    <Route path="/contact" element={<Contact />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SystemSettingsProvider>
    </AuthProvider>
  </ThemeProvider>
</QueryClientProvider>
);

export default App;
