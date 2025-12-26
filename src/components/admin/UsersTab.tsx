import { useState, useEffect } from 'react';
import { FirestoreService, Collections } from '@/lib/firestore';
import { User as UserType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Loader2, Users, CheckCircle, XCircle, Shield, User } from 'lucide-react';
import { format } from 'date-fns';

export default function UsersTab() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const userData = await FirestoreService.getAll(Collections.USERS);
      setUsers(userData as UserType[]);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovalToggle = async (userId: string, currentApproval: boolean) => {
    setUpdatingUsers((prev) => new Set(prev).add(userId));

    try {
      await FirestoreService.update(Collections.USERS, userId, {
        isApproved: !currentApproval
      });
      
      toast.success(`User ${!currentApproval ? 'approved' : 'unapproved'} successfully`);
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, isApproved: !currentApproval } : user))
      );
    } catch (error) {
      console.error('Error updating user approval:', error);
      toast.error('Failed to update user approval');
    } finally {
      setUpdatingUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  const handleAdminToggle = async (userId: string, currentRole: string) => {
    setUpdatingUsers((prev) => new Set(prev).add(userId));

    try {
      const newRole = currentRole === 'admin' ? 'member' : 'admin';
      await FirestoreService.update(Collections.USERS, userId, {
        role: newRole
      });
      
      toast.success(`User role updated to ${newRole}`);
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
      );
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    } finally {
      setUpdatingUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">User Management</h2>
          <p className="text-muted-foreground">Manage user approvals and admin roles</p>
        </div>
        <Badge variant="outline" className="gap-2">
          <Users className="w-4 h-4" />
          {users.length} users
        </Badge>
      </div>

      {users.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No users registered yet</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Registered Users
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground flex items-center gap-2">
                            {user.fullName || 'No name'}
                            {user.role === 'admin' && (
                              <Shield className="h-3 w-3 text-gold" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {user.department || 'Not specified'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {user.batch || 'Not specified'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {user.createdAt ? format(new Date(user.createdAt.seconds * 1000), 'PP') : 'Unknown'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isApproved ? 'default' : 'secondary'} className="gap-1">
                        {user.isApproved ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Approved
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            Pending
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'outline'} className="gap-1">
                        {user.role === 'admin' ? (
                          <>
                            <Shield className="h-3 w-3" />
                            Admin
                          </>
                        ) : (
                          'Member'
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">Approve</span>
                          <Switch
                            checked={user.isApproved || false}
                            onCheckedChange={() => handleApprovalToggle(user.id, user.isApproved || false)}
                            disabled={updatingUsers.has(user.id)}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">Admin</span>
                          <Switch
                            checked={user.role === 'admin'}
                            onCheckedChange={() => handleAdminToggle(user.id, user.role)}
                            disabled={updatingUsers.has(user.id)}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
