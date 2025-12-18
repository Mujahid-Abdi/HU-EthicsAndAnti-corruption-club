import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { toast } from "sonner";

interface VoteLayoutProps {
  children: React.ReactNode;
}

export function VoteLayout({ children }: VoteLayoutProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Voting Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/20 dark:bg-gray-900/30 backdrop-blur-lg border-b border-white/30 dark:border-gray-700/30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
                <img 
                  src="/haramaya-logo.jpg" 
                  alt="Haramaya University Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <p className="font-display font-bold text-gray-900 dark:text-white leading-tight">
                  HUEC
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-300">Voting System</p>
              </div>
            </Link>

            {/* Voting Status */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Voting Active
                </span>
              </div>
              
              <ThemeToggle />
              
              {user && (
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleSignOut}
                  className="gap-2 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 md:pt-20">
        {children}
      </main>

      {/* Voting Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Secure Voting System
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your vote is anonymous and secure
                </p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Haramaya University Ethics Club
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                © {new Date().getFullYear()} All rights reserved
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}