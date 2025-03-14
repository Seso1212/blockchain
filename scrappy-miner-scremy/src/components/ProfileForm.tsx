
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { COUNTRIES } from '@/lib/miningUtils';
import { useCrypto } from '@/contexts/CryptoContext';

interface ProfileFormProps {
  onComplete: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const { updateUserStats } = useCrypto();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
    }
    
    if (!country) {
      newErrors.country = 'Country is required';
    }
    
    // Phone number is optional, but validate format if provided
    if (phoneNumber && !/^\+?[0-9\s\-()]+$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }
    
    // Validate referral code format if provided (optional)
    if (referralCode && !/^[A-Z0-9]{6,10}$/.test(referralCode)) {
      newErrors.referralCode = 'Invalid referral code format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Update user stats with profile information
    updateUserStats({
      firstName,
      lastName,
      username,
      countryCode: country, // Fixed: changed 'country' to 'countryCode' to match UserStats type
      phoneNumber: phoneNumber || undefined,
      referralCode: referralCode || undefined,
      profileCompleted: true
    });
    
    toast({
      title: 'Profile Completed!',
      description: 'Your profile has been set up successfully.',
      duration: 3000,
    });
    
    // Notify parent component that profile setup is complete
    onComplete();
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-background rounded-xl shadow-md">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Complete Your Profile</h1>
        <p className="text-muted-foreground">Set up your ScremyCoin profile to start mining</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={errors.firstName ? "border-destructive" : ""}
            />
            {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={errors.lastName ? "border-destructive" : ""}
            />
            {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="username">Username (minimum 4 characters)</Label>
          <Input
            id="username"
            placeholder="coinhunter"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={errors.username ? "border-destructive" : ""}
          />
          {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger id="country" className={errors.country ? "border-destructive" : ""}>
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {COUNTRIES.map(country => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number (optional)</Label>
          <Input
            id="phoneNumber"
            placeholder="+1 234 567 8900"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={errors.phoneNumber ? "border-destructive" : ""}
          />
          {errors.phoneNumber && <p className="text-xs text-destructive">{errors.phoneNumber}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="referralCode">Referral Code (optional)</Label>
          <Input
            id="referralCode"
            placeholder="ABC123"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            className={errors.referralCode ? "border-destructive" : ""}
          />
          {errors.referralCode && <p className="text-xs text-destructive">{errors.referralCode}</p>}
          {referralCode && !errors.referralCode && (
            <p className="text-xs text-muted-foreground">You'll receive bonus rewards for using a referral code!</p>
          )}
        </div>
        
        <Button type="submit" className="w-full bg-scremy hover:bg-scremy/90 text-white">
          Complete Profile
        </Button>
      </form>
    </div>
  );
};

export default ProfileForm;
