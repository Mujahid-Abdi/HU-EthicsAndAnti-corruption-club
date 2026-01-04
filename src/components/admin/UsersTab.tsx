import { useState, useEffect } from 'react';
import { FirestoreService, Collections } from '@/lib/firestore';
import { User as UserType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Loader2, Users, CheckCircle, XCircle, Shield, User, UserCog, Search, Filter, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function UsersTab({ adminOnly = false }: { adminOnly?: boolean }) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterBatch, setFilterBatch] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [promoteEmail, setPromoteEmail] = useState('');
  const [promoteRole, setPromoteRole] = useState<UserType['role']>('admin');
  const [isPromoting, setIsPromoting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Get unique departments and batches for filter options
  const departments = Array.from(new Set(users.map(user => user.department).filter(Boolean)));
  const batches = Array.from(new Set(users.map(user => user.batch).filter(Boolean)));

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and filter criteria
  useEffect(() => {
    let filtered = users;

    // Filter by role if in Admin Management mode (including all administrative roles)
    if (adminOnly) {
      filtered = filtered.filter(user => 
        ['admin', 'president', 'vice_president', 'secretary'].includes(user.role || '')
      );
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.batch?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Department filter
    if (filterDepartment !== 'all') {
      filtered = filtered.filter(user => user.department === filterDepartment);
    }

    // Batch filter
    if (filterBatch !== 'all') {
      filtered = filtered.filter(user => user.batch === filterBatch);
    }

    // Status filter
    if (filterStatus !== 'all') {
      if (filterStatus === 'approved') {
        filtered = filtered.filter(user => user.isApproved);
      } else if (filterStatus === 'pending') {
        filtered = filtered.filter(user => !user.isApproved);
      }
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, filterDepartment, filterBatch, filterStatus, adminOnly]);

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

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.setTextColor(40);
      doc.text('Haramaya University Ethics Club', 20, 20);
      
      doc.setFontSize(16);
      doc.text(adminOnly ? 'Administrator Report' : 'User Report', 20, 30);
      
      // Add generation date
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 20, 40);
      
      // Add filter information
      let filterInfo = [];
      if (searchTerm) filterInfo.push(`Search: "${searchTerm}"`);
      if (filterDepartment !== 'all') filterInfo.push(`Department: ${filterDepartment}`);
      if (filterBatch !== 'all') filterInfo.push(`Batch: ${filterBatch}`);
      if (filterStatus !== 'all') filterInfo.push(`Status: ${filterStatus}`);
      
      if (filterInfo.length > 0) {
        doc.text(`Filters Applied: ${filterInfo.join(', ')}`, 20, 50);
      }
      
      // Prepare table data
      const tableColumns = [
        'Name',
        'Email',
        'Department',
        'Batch/Year',
        'Status',
        'Role',
        'Joined Date'
      ];
      
      const tableRows = filteredUsers.map(user => [
        user.fullName || 'No name',
        user.email || 'No email',
        user.department || 'Not specified',
        user.batch || 'Not specified',
        user.isApproved ? 'Approved' : 'Pending',
        (user.role || 'member').replace('_', ' ').toUpperCase(),
        user.createdAt ? format(
          user.createdAt.seconds 
            ? new Date(user.createdAt.seconds * 1000) 
            : new Date(user.createdAt as any), 
          'PP'
        ) : 'Unknown'
      ]);
      
      // Add table
      (doc as any).autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: filterInfo.length > 0 ? 60 : 50,
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [255, 140, 0], // Orange color matching the theme
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 60 },
      });
      
      // Add summary at the bottom
      const finalY = (doc as any).lastAutoTable.finalY || 60;
      doc.setFontSize(10);
      doc.setTextColor(40);
      doc.text(`Total Users: ${filteredUsers.length}`, 20, finalY + 20);
      
      const approvedCount = filteredUsers.filter(u => u.isApproved).length;
      const pendingCount = filteredUsers.length - approvedCount;
      
      doc.text(`Approved: ${approvedCount}`, 20, finalY + 30);
      doc.text(`Pending: ${pendingCount}`, 20, finalY + 40);
      
      if (adminOnly) {
        const adminCount = filteredUsers.filter(u => ['admin', 'president', 'vice_president', 'secretary'].includes(u.role || '')).length;
        doc.text(`Administrators: ${adminCount}`, 20, finalY + 50);
      }
      
      // Generate filename
      const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm');
      const filename = adminOnly 
        ? `HUEC_Administrators_${timestamp}.pdf`
        : `HUEC_Users_${timestamp}.pdf`;
      
      // Save the PDF
      doc.save(filename);
      
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
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

  const handleRoleChange = async (userId: string, newRole: UserType['role']) => {
    setUpdatingUsers((prev) => new Set(prev).add(userId));

    try {
      await FirestoreService.update(Collections.USERS, userId, {
        role: newRole
      });
      
      toast.success(`User role updated to ${newRole.replace('_', ' ')} successfully`);
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

  const handlePromoteByEmail = async () => {
    if (!promoteEmail) {
      toast.error('Please enter an email address');
      return;
    }

    const userToPromote = users.find(u => u.email?.toLowerCase() === promoteEmail.toLowerCase());
    
    if (!userToPromote) {
      toast.error('User not found. Please ensure the email is correct and the user has registered.');
      return;
    }

    if (userToPromote.role === 'admin') {
      toast.info('User is already an admin');
      return;
    }

    setIsPromoting(true);
    try {
      await handleRoleChange(userToPromote.id, promoteRole);
      setPromoteEmail('');
    } finally {
      setIsPromoting(false);
    }
  };

  // Remove the handleAdminToggle function since only admins can promote users from settings

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            {adminOnly ? 'Admin Management' : 'User Management'}
          </h2>
          <p className="text-muted-foreground">
            {adminOnly ? 'Manage admin users and their permissions' : 'Manage user approvals and view user information'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={exportToPDF}
            disabled={isExporting || filteredUsers.length === 0}
            variant="outline"
            className="gap-2"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export PDF
              </>
            )}
          </Button>
          <Badge variant="outline" className="gap-2 w-fit">
            <Shield className="w-4 h-4" />
            {filteredUsers.length} {adminOnly ? 'Administrators' : 'Users'}
          </Badge>
        </div>
      </div>

      {/* Promote User Form - Only in Admin Management */}
      {adminOnly && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <UserCog className="w-5 h-5" />
              Promote New Administrator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <Input 
                  placeholder="Enter user email address..."
                  value={promoteEmail}
                  onChange={(e) => setPromoteEmail(e.target.value)}
                  className="bg-white dark:bg-gray-950"
                />
              </div>
              <div className="w-full md:w-48">
                <Select 
                  value={promoteRole}
                  onValueChange={(val) => setPromoteRole(val as any)}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-950">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="president">President</SelectItem>
                    <SelectItem value="vice_president">Vice President</SelectItem>
                    <SelectItem value="secretary">Secretary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handlePromoteByEmail} 
                disabled={isPromoting || !promoteEmail}
                className="gap-2"
              >
                {isPromoting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                Promote User
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              The user must already have a registered account to be promoted. 
            </p>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {!adminOnly && (
              <>
                {/* Department Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Batch/Year Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Batch/Year</label>
                  <Select value={filterBatch} onValueChange={setFilterBatch}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Batches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Batches</SelectItem>
                      {batches.map(batch => (
                        <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || filterDepartment !== 'all' || filterBatch !== 'all' || filterStatus !== 'all') && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setFilterDepartment('all');
                setFilterBatch('all');
                setFilterStatus('all');
              }}
              className="w-full md:w-auto"
            >
              Clear Filters
            </Button>
          )}

          {/* Export Section */}
          <div className="border-t pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Export Data</h4>
                <p className="text-xs text-muted-foreground">
                  Export filtered user data to PDF format
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={exportToPDF}
                  disabled={isExporting || filteredUsers.length === 0}
                  className="gap-2"
                  size="sm"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Export as PDF ({filteredUsers.length} users)
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {users.length === 0 ? 'No users registered yet' : 'No users match the current filters'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {adminOnly ? 'Active Administrators' : 'Registered Users'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Batch/Year</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
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
                        {user.createdAt ? (
                          format(
                            user.createdAt.seconds 
                              ? new Date(user.createdAt.seconds * 1000) 
                              : new Date(user.createdAt as any), 
                            'PP'
                          )
                        ) : 'Unknown'}
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
                      <Select 
                        value={user.role || 'member'} 
                        onValueChange={(value) => handleRoleChange(user.id, value as UserType['role'])}
                        disabled={updatingUsers.has(user.id)}
                      >
                        <SelectTrigger className="w-[140px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3" />
                              Member
                            </div>
                          </SelectItem>
                          <SelectItem value="secretary">
                            <div className="flex items-center gap-2 text-blue-600">
                              <UserCog className="h-3 w-3" />
                              Secretary
                            </div>
                          </SelectItem>
                          <SelectItem value="vice_president">
                            <div className="flex items-center gap-2 text-orange-600">
                              <Shield className="h-3 w-3" />
                              Vice President
                            </div>
                          </SelectItem>
                          <SelectItem value="president">
                            <div className="flex items-center gap-2 text-purple-600">
                              <Shield className="h-3 w-3" />
                              President
                            </div>
                          </SelectItem>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2 text-red-600">
                              <Shield className="h-3 w-3" />
                              Admin
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{user.isApproved ? 'Approved' : 'Approve'}</span>
                        <Switch
                          checked={user.isApproved || false}
                          onCheckedChange={() => handleApprovalToggle(user.id, user.isApproved || false)}
                          disabled={updatingUsers.has(user.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
