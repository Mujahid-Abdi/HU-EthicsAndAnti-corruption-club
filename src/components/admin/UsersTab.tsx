import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Users, CheckCircle, XCircle, Shield } from 'lucide-react';
import { format } from 'date-fns';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  department: string | null;
  year_of_study: string | null;
  is_approved: boolean | null;
  created_at: string | null;
}

interface UserRole {
  user_id: string;
  role: 'admin' | 'member';
}

export default function UsersTab() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('user_roles').select('user_id, role'),
    ]);

    if (profilesRes.error) {
      toast.error('Failed to fetch profiles');
    } else {
      setProfiles(profilesRes.data || []);
    }

    if (!rolesRes.error) {
      setUserRoles(rolesRes.data || []);
    }
    setIsLoading(false);
  };

  const isUserAdmin = (userId: string) => {
    return userRoles.some((r) => r.user_id === userId && r.role === 'admin');
  };

  const handleApprovalToggle = async (userId: string, currentApproval: boolean) => {
    setUpdatingUsers((prev) => new Set(prev).add(userId));

    const { error } = await supabase
      .from('profiles')
      .update({ is_approved: !currentApproval })
      .eq('id', userId);

    if (error) {
      toast.error('Failed to update user approval');
    } else {
      toast.success(`User ${!currentApproval ? 'approved' : 'unapproved'} successfully`);
      setProfiles((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, is_approved: !currentApproval } : p))
      );
    }
    setUpdatingUsers((prev) => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
  };

  const handleAdminToggle = async (userId: string) => {
    const isAdmin = isUserAdmin(userId);
    setUpdatingUsers((prev) => new Set(prev).add(userId));

    if (isAdmin) {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');

      if (error) {
        toast.error('Failed to remove admin role');
      } else {
        toast.success('Admin role removed');
        setUserRoles((prev) => prev.filter((r) => !(r.user_id === userId && r.role === 'admin')));
      }
    } else {
      const { error } = await supabase.from('user_roles').insert({ user_id: userId, role: 'admin' });

      if (error) {
        toast.error('Failed to add admin role');
      } else {
        toast.success('Admin role added');
        setUserRoles((prev) => [...prev, { user_id: userId, role: 'admin' }]);
      }
    }
    setUpdatingUsers((prev) => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">User Management</h2>
        <Badge variant="outline">{profiles.length} users</Badge>
      </div>

      {profiles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No users registered yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {profiles.map((profile) => (
            <Card key={profile.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {profile.full_name || 'No name'}
                      {isUserAdmin(profile.id) && (
                        <Shield className="h-4 w-4 text-gold" />
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                  <Badge variant={profile.is_approved ? 'default' : 'secondary'}>
                    {profile.is_approved ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Approved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        Pending
                      </span>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  {profile.department && <span>{profile.department}</span>}
                  {profile.year_of_study && <span>• Year {profile.year_of_study}</span>}
                  {profile.created_at && (
                    <span>• Joined {format(new Date(profile.created_at), 'PP')}</span>
                  )}
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Approved</span>
                    <Switch
                      checked={profile.is_approved || false}
                      onCheckedChange={() => handleApprovalToggle(profile.id, profile.is_approved || false)}
                      disabled={updatingUsers.has(profile.id)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Admin</span>
                    <Switch
                      checked={isUserAdmin(profile.id)}
                      onCheckedChange={() => handleAdminToggle(profile.id)}
                      disabled={updatingUsers.has(profile.id)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
