
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCrypto } from '@/contexts/CryptoContext';
import { User, Settings, Award, FileText, Share2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { formatTime } from '@/lib/miningUtils';
import ChangePasswordDialog from '@/components/ChangePasswordDialog';
import DeleteAccountDialog from '@/components/DeleteAccountDialog';

const Profile = () => {
  const { userData, updateUserStats, addExp } = useCrypto();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  
  // Profile form
  const form = useForm({
    defaultValues: {
      firstName: userData.userStats.firstName || '',
      lastName: userData.userStats.lastName || '',
      username: userData.userStats.username || '',
      countryCode: userData.userStats.countryCode || '',
      phoneNumber: userData.userStats.phoneNumber || '',
      referralCode: userData.userStats.referralCode || '',
    }
  });
  
  const onSubmit = (data: any) => {
    updateUserStats({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      countryCode: data.countryCode,
      phoneNumber: data.phoneNumber,
      referralCode: data.referralCode,
    });
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully",
    });
  };
  
  // Share on social media handler
  const handleShare = (platform: string) => {
    // Simulate sharing
    toast({
      title: `Shared on ${platform}`,
      description: "Thanks for sharing ScremyCoin!",
    });
    
    // Award experience points
    addExp(25);
  };
  
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
          <TabsTrigger value="referrals" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Referrals</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your profile information. Your username will be visible to other miners.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormDescription>
                            Must be at least 4 characters and unique
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="countryCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="Optional" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 123 456 7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="referralCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Referral Code (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="FRIEND123" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter a friend's referral code
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">Save Changes</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Stats Tab */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Miner Statistics</CardTitle>
              <CardDescription>
                Your mining achievements and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-secondary/20 p-6 rounded-lg">
                  <div className="text-muted-foreground mb-2">Level</div>
                  <div className="text-3xl font-bold">{userData.userStats.level}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {userData.userStats.exp} / {userData.userStats.expRequired} EXP
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-2">
                    <div 
                      className="bg-scremy h-2 rounded-full"
                      style={{ width: `${(userData.userStats.exp / userData.userStats.expRequired) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-secondary/20 p-6 rounded-lg">
                  <div className="text-muted-foreground mb-2">Mining Success</div>
                  <div className="text-3xl font-bold">{userData.userStats.successfulMines}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {userData.userStats.totalAttempts} total attempts
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Success rate: {userData.userStats.totalAttempts > 0 
                      ? ((userData.userStats.successfulMines / userData.userStats.totalAttempts) * 100).toFixed(1)
                      : 0}%
                  </div>
                </div>
                
                <div className="bg-secondary/20 p-6 rounded-lg">
                  <div className="text-muted-foreground mb-2">Mining Time</div>
                  <div className="text-3xl font-bold">{formatTime(userData.userStats.activeMiningTime)}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Total active mining time
                  </div>
                </div>
                
                <div className="bg-secondary/20 p-6 rounded-lg col-span-1 md:col-span-3">
                  <div className="text-muted-foreground mb-2">Badges & Achievements</div>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center gap-2 bg-secondary/30 rounded-full px-4 py-2">
                      <Award className="w-4 h-4 text-scremy" />
                      <span>Early Adopter</span>
                    </div>
                    {userData.userStats.successfulMines >= 10 && (
                      <div className="flex items-center gap-2 bg-secondary/30 rounded-full px-4 py-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>Novice Miner</span>
                      </div>
                    )}
                    {userData.userStats.successfulMines >= 100 && (
                      <div className="flex items-center gap-2 bg-secondary/30 rounded-full px-4 py-2">
                        <Award className="w-4 h-4 text-blue-400" />
                        <span>Advanced Miner</span>
                      </div>
                    )}
                    {userData.userStats.level >= 5 && (
                      <div className="flex items-center gap-2 bg-secondary/30 rounded-full px-4 py-2">
                        <Award className="w-4 h-4 text-purple-400" />
                        <span>Senior Miner</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive updates about your mining activity</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">Change Password</h3>
                    <p className="text-sm text-muted-foreground">Update your account password</p>
                  </div>
                  <Button variant="outline" onClick={() => setChangePasswordOpen(true)}>Change</Button>
                </div>
                
                <div className="flex items-center justify-between pb-4">
                  <div>
                    <h3 className="font-medium">Delete Account</h3>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={() => setDeleteAccountOpen(true)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Referrals Tab */}
        <TabsContent value="referrals">
          <Card>
            <CardHeader>
              <CardTitle>Referrals & Social Sharing</CardTitle>
              <CardDescription>
                Earn rewards by sharing ScremyCoin with friends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="font-medium mb-2">Your Referral Code</h3>
                  <div className="flex gap-2">
                    <Input value={`SCREMY${userData.userStats.username?.toUpperCase() || '1234'}`} readOnly />
                    <Button variant="outline" onClick={() => {
                      toast({
                        title: "Copied to Clipboard",
                        description: "Referral code has been copied to clipboard",
                      });
                    }}>Copy</Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Share this code with friends. You'll earn 20% of their Scoins!
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Share ScremyCoin</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => handleShare('Twitter')}>
                      Twitter
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleShare('Facebook')}>
                      Facebook
                    </Button>
                    <Button className="bg-pink-600 hover:bg-pink-700" onClick={() => handleShare('Instagram')}>
                      Instagram
                    </Button>
                    <Button className="bg-green-500 hover:bg-green-600" onClick={() => handleShare('WhatsApp')}>
                      WhatsApp
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Earn 25 EXP for each platform you share ScremyCoin on!
                  </p>
                </div>
                
                <div className="bg-secondary/20 p-6 rounded-lg">
                  <h3 className="font-medium mb-2">Referral Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-muted-foreground text-sm">Total Referrals</div>
                      <div className="text-2xl font-bold">0</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-sm">Scoins Earned</div>
                      <div className="text-2xl font-bold">0</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <ChangePasswordDialog 
        open={changePasswordOpen} 
        onOpenChange={setChangePasswordOpen} 
      />
      
      <DeleteAccountDialog 
        open={deleteAccountOpen} 
        onOpenChange={setDeleteAccountOpen}
      />
    </div>
  );
};

export default Profile;
