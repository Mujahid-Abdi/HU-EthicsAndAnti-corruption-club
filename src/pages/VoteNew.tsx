import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { 
  Vote as VoteIcon, 
  User, 
  CheckCircle, 
  AlertTriangle, 
  Lock,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';

// Simple interfaces
interface Election {
  id: string;
  title: string;
  description: string;
  status: string;
}

interface Candidate {
  id: string;
  fullName: string;
  position: string;
  department: string;
  batch: string;
  manifesto: string;
  photoUrl?: string;
}

export default function VoteNew() {
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // Mock data for testing
  useEffect(() => {
    setLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setElection({
        id: '1',
        title: 'HU Ethics Club Executive Elections 2025',
        description: 'Annual elections for club executive positions',
        status: 'open'
      });
      
      setCandidates([
        {
          id: '1',
          fullName: 'Ahmed Hassan Mohammed',
          position: 'president',
          department: 'Computer Science',
          batch: '2024',
          manifesto: 'Committed to promoting transparency and fighting corruption.',
          photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
        },
        {
          id: '2',
          fullName: 'Fatima Ali Yusuf',
          position: 'president',
          department: 'Business Administration',
          batch: '2023',
          manifesto: 'Working to ensure our club becomes a beacon of integrity.',
          photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
        },
        {
          id: '3',
          fullName: 'Mohammed Ibrahim Seid',
          position: 'vice_president',
          department: 'Engineering',
          batch: '2024',
          manifesto: 'Supporting initiatives that promote ethical conduct.',
          photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  // Redirect if not logged in
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading || authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading election...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[25vh] flex items-center overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/70 to-gray-900/60 dark:from-gray-950/90 dark:via-gray-950/80 dark:to-gray-950/70 z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=1920')] bg-cover bg-center opacity-30 dark:opacity-20" />
        </div>

        <div className="container mx-auto px-4 pt-16 pb-16 relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <VoteIcon className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-medium">
                Club Elections
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Cast Your <span className="text-primary">Vote</span>
            </h1>

            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Exercise your democratic right and help choose the next leaders of our ethics club.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {!election ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Active Election</h3>
              <p className="text-muted-foreground">
                There are currently no open elections. Check back later or contact the admin for more information.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Election Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{election.title}</CardTitle>
                    <p className="text-muted-foreground mt-2">{election.description}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Open
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Voter Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Voter Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Please provide accurate information. This will be used to verify your eligibility to vote.
                  </AlertDescription>
                </Alert>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <Input placeholder="Enter your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Student ID *</label>
                    <Input placeholder="Enter your student ID" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Department *</label>
                    <Input placeholder="Enter your department" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Batch *</label>
                    <Input placeholder="Enter your batch year" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Candidates */}
            {['president', 'vice_president', 'secretary'].map((position) => {
              const positionCandidates = candidates.filter(c => c.position === position);
              const positionLabel = position === 'president' ? 'President' : 
                                   position === 'vice_president' ? 'Vice President' : 'Secretary';

              return (
                <Card key={position}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <VoteIcon className="w-5 h-5" />
                      Vote for {positionLabel}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {positionCandidates.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No candidates available for this position.
                      </p>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        {positionCandidates.map((candidate) => (
                          <div
                            key={candidate.id}
                            className="border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
                          >
                            <div className="flex items-start gap-3 mb-4">
                              {candidate.photoUrl ? (
                                <img
                                  src={candidate.photoUrl}
                                  alt={candidate.fullName}
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="w-8 h-8 text-primary" />
                                </div>
                              )}
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground mb-1">{candidate.fullName}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {candidate.department} • {candidate.batch}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {candidate.manifesto}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {/* Submit Vote */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">Your vote is secure and anonymous</span>
                  </div>
                  
                  <Button
                    onClick={() => toast.success('Vote submitted successfully!')}
                    size="lg"
                    className="gap-2"
                  >
                    <VoteIcon className="w-5 h-5" />
                    Submit Vote
                  </Button>
                  
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    By submitting your vote, you confirm that the information provided is accurate and that you are eligible to vote in this election.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}