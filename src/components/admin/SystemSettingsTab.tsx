import { useState, useEffect } from 'react';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { FirestoreService, Collections } from '@/lib/firestore';
import { TelegramService } from '@/lib/telegram';
import { seedVotingData, clearVotingData } from '@/lib/seedVotingData';
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
  Search,
  Plus,
  Trash2,
  Send as SendIcon
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
  electionOpen: boolean;
  max_file_size: number;
  session_timeout: number;
  telegramBotToken: string;
  telegramChannelId: string;
  telegramEnabled: boolean;
  homeHeroTitle: string;
  homeHeroSubtitle: string;
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
    electionOpen: systemSettings.electionOpen,
    max_file_size: 5,
    session_timeout: 30,
    telegramBotToken: systemSettings.telegramBotToken || '',
    telegramChannelId: systemSettings.telegramChannelId || '',
    telegramEnabled: systemSettings.telegramEnabled || false,
    homeHeroTitle: systemSettings.homeHeroTitle || 'Integrity and Transparency',
    homeHeroSubtitle: systemSettings.homeHeroSubtitle || 'The Official Ethics and Anti-Corruption Club of Haramaya University',
  });

  // Sync local state with context when system settings change
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      maintenanceMode: systemSettings.maintenanceMode,
      registrationEnabled: systemSettings.registrationEnabled,
      votingEnabled: systemSettings.votingEnabled,
      electionOpen: systemSettings.electionOpen,
      telegramBotToken: systemSettings.telegramBotToken || '',
      telegramChannelId: systemSettings.telegramChannelId || '',
      telegramEnabled: systemSettings.telegramEnabled || false,
      homeHeroTitle: systemSettings.homeHeroTitle || '',
      homeHeroSubtitle: systemSettings.homeHeroSubtitle || '',
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

  const handleElectionToggle = async (checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      electionOpen: checked,
    }));

    try {
      await updateSettings({ electionOpen: checked });
      toast.success(checked ? "Election opened. Users can now vote." : "Election closed. Voting is no longer available.");
    } catch (error: any) {
      toast.error(`Failed to update election status: ${error?.message || "Please try again."}`);
    }
  };

  const handleTestTelegram = async () => {
    if (!settings.telegramBotToken || !settings.telegramChannelId) {
      toast.error("Please enter a Bot Token and at least one Channel ID first.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await TelegramService.testConnection(
        settings.telegramBotToken,
        settings.telegramChannelId
      );
      if (result.success) {
        if (result.successfulCount === result.totalCount) {
          toast.success(`Success! Test message sent to all ${result.totalCount} channels.`);
        } else {
          toast.warning(`Partial Success: Sent to ${result.successfulCount} out of ${result.totalCount} channels. Please check the IDs/permissions for the failed ones.`);
        }
      } else {
        toast.error("Telegram connection failed. Please check your Bot Token and ensure the Bot is an Admin in your channels.");
      }
    } catch (error) {
      toast.error("An error occurred while testing the connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Update system settings including Telegram and Hero content
      await updateSettings({
        maintenanceMode: settings.maintenanceMode,
        registrationEnabled: settings.registrationEnabled,
        votingEnabled: settings.votingEnabled,
        electionOpen: settings.electionOpen,
        telegramEnabled: settings.telegramEnabled,
        telegramBotToken: settings.telegramBotToken,
        telegramChannelId: settings.telegramChannelId,
        homeHeroTitle: settings.homeHeroTitle,
        homeHeroSubtitle: settings.homeHeroSubtitle,
        site_name: settings.site_name,
        contact_email: settings.contact_email,
        site_description: settings.site_description,
      });
      
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
      electionOpen: false,
      max_file_size: 5,
      session_timeout: 30,
      telegramBotToken: '',
      telegramChannelId: '',
      telegramEnabled: false,
      homeHeroTitle: 'Integrity and Transparency',
      homeHeroSubtitle: 'The Official Ethics and Anti-Corruption Club of Haramaya University',
    });
    toast.success("Settings reset. All settings have been reset to defaults.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
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
        <div className="overflow-x-auto pb-2 -mx-2 px-2 ms-0 scrollbar-none">
          <TabsList className="min-w-max flex sm:grid sm:grid-cols-6 gap-2 bg-muted/50 p-1">
            <TabsTrigger value="general" className="gap-2 whitespace-nowrap">
              <Settings className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="home" className="gap-2 whitespace-nowrap">
              <RefreshCw className="w-4 h-4" />
              Home
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 whitespace-nowrap">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2 whitespace-nowrap">
              <UserCog className="w-4 h-4" />
              Admin Roles
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 whitespace-nowrap">
              <Bell className="w-4 h-4" />
              Telegram
            </TabsTrigger>
            <TabsTrigger value="system" className="gap-2 whitespace-nowrap">
              <Database className="w-4 h-4" />
              System
            </TabsTrigger>
          </TabsList>
        </div>

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

        <TabsContent value="home" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Home Page Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero_title">Hero Title</Label>
                <Input
                  id="hero_title"
                  value={settings.homeHeroTitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, homeHeroTitle: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                <Textarea
                  id="hero_subtitle"
                  value={settings.homeHeroSubtitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, homeHeroSubtitle: e.target.value }))}
                  rows={2}
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
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Election Status</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Open/close the current election for voting
                  </p>
                </div>
                <Switch
                  checked={settings.electionOpen}
                  onCheckedChange={handleElectionToggle}
                  disabled={!settings.votingEnabled}
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
                Telegram Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable Telegram Bot</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically post updates to your Telegram channel
                  </p>
                </div>
                <Switch
                  checked={settings.telegramEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, telegramEnabled: checked }))}
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="space-y-2">
                  <Label htmlFor="bot_token">Telegram Bot Token</Label>
                  <Input
                    id="bot_token"
                    type="password"
                    placeholder="723456789:ABCDefgh..."
                    value={settings.telegramBotToken}
                    onChange={(e) => setSettings(prev => ({ ...prev, telegramBotToken: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Get from <a href="https://t.me/botfather" target="_blank" rel="noreferrer" className="text-primary hover:underline">@BotFather</a>
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Telegram Channel IDs</Label>
                  <div className="space-y-2">
                    {settings.telegramChannelId ? (
                      settings.telegramChannelId.split(',').map((id, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="@channel_username or -100123456"
                            value={id}
                            onChange={(e) => {
                              const channels = settings.telegramChannelId.split(',');
                              channels[index] = e.target.value;
                              setSettings(prev => ({ ...prev, telegramChannelId: channels.join(',') }));
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => {
                              const channels = settings.telegramChannelId.split(',').filter((_, i) => i !== index);
                              setSettings(prev => ({ ...prev, telegramChannelId: channels.join(',') }));
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No channels added yet.</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 mt-2"
                    onClick={() => {
                      const current = settings.telegramChannelId?.trim() || '';
                      const newVal = current ? `${current}, ` : ' ';
                      setSettings(prev => ({ ...prev, telegramChannelId: newVal }));
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Channel
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    The bot will broadcast to ALL channels listed above. Make sure the bot is an administrator in each.
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleTestTelegram}
                    disabled={isLoading}
                  >
                    <SendIcon className="w-4 h-4" />
                    Test Bot Connection
                  </Button>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <h4 className="text-sm font-semibold">Automatic Posting Features:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                    <li>Send new News articles as posts</li>
                    <li>Send new Announcements to the channel</li>
                    <li>Synchronize edits from the dashboard to the channel</li>
                    <li>Delete Telegram posts when deleted from dashboard</li>
                  </ul>
                </div>
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Voting System Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Test Data Management</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                  Use these tools to populate or clear voting data for testing purposes.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        await seedVotingData();
                        toast.success("Sample voting data created successfully! Election and candidates are now available.");
                      } catch (error) {
                        toast.error("Failed to create voting data. Please check the console for details.");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Sample Data
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        await clearVotingData();
                        toast.success("All voting data cleared successfully!");
                      } catch (error) {
                        toast.error("Failed to clear voting data. Please check the console for details.");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading}
                    className="gap-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All Data
                  </Button>
                </div>
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