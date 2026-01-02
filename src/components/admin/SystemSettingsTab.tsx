import { useState, useEffect } from 'react';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { FirestoreService, Collections } from '@/lib/firestore';
import { User as UserType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Settings, 
  Database, 
  Mail, 
  Shield, 
  Users, 
  Bell,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  UserCog,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import UsersTab from './UsersTab';

interface SystemSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  votingEnabled: boolean;
  max_file_size: number;
  session_timeout: number;
}

export default function SystemSettingsTab() {
  const { settings: systemSettings, updateSettings } = useSystemSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [settings, setSettings] = useState<SystemSettings>({
    site_name: 'Haramaya University Ethics Club',
    site_description: 'Promoting integrity, transparency, and accountability',
    contact_email: 'ethics@haramaya.edu.et',
    maintenanceMode: systemSettings.maintenanceMode,
    registrationEnabled: systemSettings.registrationEnabled,
    votingEnabled: systemSettings.votingEnabled,
    max_file_size: 5,
    session_timeout: 30,
  });

  // Sync local state with context when system settings change
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      maintenanceMode: systemSettings.maintenanceMode,
      registrationEnabled: systemSettings.registrationEnabled,
      votingEnabled: systemSettings.votingEnabled,
    }));
  }, [systemSettings]);

  const handleRegistrationToggle = async (checked: boolean) => {
    if (checked && settings.votingEnabled) {
      toast.error('Cannot enable registration. Disable voting first. Registration and voting cannot run at the same time.');
      return;
    }

    setSettings((prev) => ({
      ...prev,
      registrationEnabled: checked,
    }));

    try {
      await updateSettings({ registrationEnabled: checked });
      toast.success(checked ? "Registration enabled. Users can now create new accounts." : "Registration disabled. Users can no longer create new accounts.");
    } catch (error: any) {
      toast.error(`Failed to update registration: ${error?.message || "Please try again."}`);
    }
  };

  const handleVotingToggle = async (checked: boolean) => {
    if (checked && settings.registrationEnabled) {
      toast.error('Cannot enable voting. Disable registration first. Voting can start after registration is finished.');
      return;
    }

    setSettings((prev) => ({
      ...prev,
      votingEnabled: checked,
    }));

    try {
      await updateSettings({ votingEnabled: checked });
      toast.success(checked ? "Voting enabled. Voting is now active." : "Voting disabled. Voting routes are now blocked.");
    } catch (error: any) {
      toast.error(`Failed to update voting: ${error?.message || "Please try again."}`);
    }
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Update system settings
      await updateSettings({
        maintenanceMode: settings.maintenanceMode,
        registrationEnabled: settings.registrationEnabled,
        votingEnabled: settings.votingEnabled,
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastSaved(new Date());
      toast.success("Settings saved successfully. System settings have been updated.");
    } catch (error: unknown) {
      toast.error(`Error saving settings: ${(error as Error).message || "Please try again later."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSettings = () => {
    setSettings({
      site_name: 'Haramaya University Ethics Club',
      site_description: 'Promoting integrity, transparency, and accountability',
      contact_email: 'ethics@haramaya.edu.et',
      maintenanceMode: false,
      registrationEnabled: true,
      votingEnabled: false,
      max_file_size: 5,
      session_timeout: 30,
    });
    toast.success("Settings reset. All settings have been reset to defaults.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Configure system-wide settings and preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lastSaved && (
            <Badge variant="outline" className="gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Last saved: {lastSaved.toLocaleTimeString()}
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <UserCog className="w-4 h-4" />
            Admin Roles
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Database className="w-4 h-4" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={settings.site_name}
                    onChange={(e) => setSettings(prev => ({ ...prev, site_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => setSettings(prev => ({ ...prev, contact_email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_description">Site Description</Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description}
                  onChange={(e) => setSettings(prev => ({ ...prev, site_description: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Registration Enabled</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Allow new users to register accounts
                  </p>
                </div>
                <Switch
                  checked={settings.registrationEnabled}
                  onCheckedChange={handleRegistrationToggle}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Voting System</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enable voting functionality
                  </p>
                </div>
                <Switch
                  checked={settings.votingEnabled}
                  onCheckedChange={handleVotingToggle}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session_timeout"
                    type="number"
                    value={settings.session_timeout}
                    onChange={(e) => setSettings(prev => ({ ...prev, session_timeout: parseInt(e.target.value) || 30 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_file_size">Max File Size (MB)</Label>
                  <Input
                    id="max_file_size"
                    type="number"
                    value={settings.max_file_size}
                    onChange={(e) => setSettings(prev => ({ ...prev, max_file_size: parseInt(e.target.value) || 5 }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UsersTab adminOnly={true} />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Notification settings will be available in future updates.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                System Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-orange-200 dark:border-orange-800 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      Temporarily disable site access for maintenance
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold">Active Users</h3>
                    <p className="text-2xl font-bold text-blue-600">24</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <Database className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-semibold">Database Size</h3>
                    <p className="text-2xl font-bold text-green-600">2.4 GB</p>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          onClick={handleResetSettings}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Reset to Defaults
        </Button>
        <Button
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Settings
        </Button>
      </div>
    </div>
  );
}