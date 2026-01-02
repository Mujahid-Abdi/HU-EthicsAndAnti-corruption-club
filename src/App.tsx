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
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Achievements from "./pages/Achievements";
import Programs from "./pages/Programs";
import Report from "./pages/Report";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Gallery from "./pages/Gallery";
import Join from "./pages/Join";
import Contact from "./pages/Contact";
import Vote from "./pages/Vote";
import VoteNew from "./pages/VoteNew";
import SimpleVote from "./pages/SimpleVote";
import TestVote from "./pages/TestVote";
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
              
              {/* Auth route without sidebar */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Voting routes with VoteLayout */}
              <Route path="/vote" element={
                <VotingProtectedRoute>
                  <VoteNew />
                </VotingProtectedRoute>
              } />
              <Route path="/vote-simple" element={
                <VotingProtectedRoute>
                  <SimpleVote />
                </VotingProtectedRoute>
              } />
              <Route path="/vote-full" element={
                <VotingProtectedRoute>
                  <Vote />
                </VotingProtectedRoute>
              } />
              <Route path="/test-vote" element={
                <VotingProtectedRoute>
                  <TestVote />
                </VotingProtectedRoute>
              } />
              
              {/* All other routes with SidebarLayout */}
              <Route path="/*" element={
                <SidebarLayout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/achievements" element={<Achievements />} />
                    <Route path="/programs" element={<Programs />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/news/:id" element={<NewsDetail />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/report" element={<Report />} />
                    <Route path="/join" element={<Join />} />
                    <Route path="/contact" element={<Contact />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </SidebarLayout>
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
