import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Mail, Lock, User, Loader2, ArrowLeft, GraduationCap, Building, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  department: z.string().trim().min(2, 'Department is required').max(100),
  batch: z.string().trim().min(4, 'Batch year is required (e.g., 2024)').max(10),
  position: z.string().trim().optional(),
});

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupDepartment, setSignupDepartment] = useState('');
  const [signupBatch, setSignupBatch] = useState('');
  const [signupPosition, setSignupPosition] = useState('');
  const [customPosition, setCustomPosition] = useState('');
  const [isOtherPosition, setIsOtherPosition] = useState(false);
  
  const { user, signIn, signUp } = useAuth();
  const { isRegistrationEnabled, settings } = useSystemSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const redirectTo = new URLSearchParams(location.search).get('redirectTo') || '/';

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (tab === 'signup' && isRegistrationEnabled) return 'signup';
    return 'login';
  });

  // Debug logging
  useEffect(() => {
    console.log('Auth page - Registration enabled:', isRegistrationEnabled);
    console.log('Auth page - All settings:', settings);
  }, [isRegistrationEnabled, settings]);

  useEffect(() => {
    if (user) {
      navigate(redirectTo);
    }
  }, [user, navigate, redirectTo]);

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (tab === 'signup' && isRegistrationEnabled) {
      setActiveTab('signup');
      return;
    }
    setActiveTab('login');
  }, [location.search, isRegistrationEnabled]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setIsLoading(false);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Welcome back!');
      navigate(redirectTo);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = signupSchema.safeParse({ 
      fullName: signupName, 
      email: signupEmail, 
      password: signupPassword,
      department: signupDepartment,
      batch: signupBatch,
      position: isOtherPosition ? customPosition : signupPosition
    });
    
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    const finalPosition = isOtherPosition ? customPosition : signupPosition;
    const { error } = await signUp(signupEmail, signupPassword, signupName, signupDepartment, signupBatch, finalPosition);
    setIsLoading(false);

    if (error) {
      if (error.message.includes('User already registered')) {
        toast.error('An account with this email already exists');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Account created successfully!');
      navigate(redirectTo);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex-1" />
          </div>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-display text-primary">
            Ethics & Anti-Corruption Club
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Haramaya University
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')} className="w-full">
            <TabsList className={`grid w-full ${isRegistrationEnabled ? 'grid-cols-2' : 'grid-cols-1'} mb-6`}>
              <TabsTrigger value="login">Sign In</TabsTrigger>
              {isRegistrationEnabled && (
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              )}
            </TabsList>
            
            {!isRegistrationEnabled && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Registration is currently disabled. Please sign in with your existing account.
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  Status: {isRegistrationEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            )}
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full hover:bg-primary/90 hover:scale-[1.02] transition-all duration-200" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your full name"
                      className="pl-10"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-department">Department</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-department"
                        type="text"
                        placeholder="e.g., Computer Science"
                        className="pl-10"
                        value={signupDepartment}
                        onChange={(e) => setSignupDepartment(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-batch">Batch</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-batch"
                        type="text"
                        placeholder="e.g., 2024"
                        className="pl-10"
                        value={signupBatch}
                        onChange={(e) => setSignupBatch(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-position">Club Position (if any)</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                      <Select
                        value={isOtherPosition ? 'other' : signupPosition}
                        onValueChange={(value) => {
                          if (value === 'other') {
                            setIsOtherPosition(true);
                          } else {
                            setIsOtherPosition(false);
                            setSignupPosition(value);
                          }
                        }}
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select your position" />
                        </SelectTrigger>
                        <SelectContent className="z-[100]">
                          <SelectItem value="Member">Normal Member</SelectItem>
                          <SelectItem value="President">President</SelectItem>
                          <SelectItem value="Vice President">Vice President</SelectItem>
                          <SelectItem value="Secretary">Secretary</SelectItem>
                          <SelectItem value="Treasurer">Treasurer</SelectItem>
                          <SelectItem value="Public Relations">Public Relations</SelectItem>
                          <SelectItem value="other">Other (Specify below)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {isOtherPosition && (
                    <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                      <Label htmlFor="custom-position">Specify Position *</Label>
                      <Input
                        id="custom-position"
                        placeholder="Enter your specific position"
                        value={customPosition}
                        onChange={(e) => setCustomPosition(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full hover:bg-primary/90 hover:scale-[1.02] transition-all duration-200" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
