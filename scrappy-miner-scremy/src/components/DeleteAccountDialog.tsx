
import React, { useState, useEffect } from 'react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent,
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCrypto } from '@/contexts/CryptoContext';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({ open, onOpenChange }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [expectedCode, setExpectedCode] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();
  const { resetData, logout } = useCrypto();

  // Generate a random 6-digit code when the dialog opens
  useEffect(() => {
    if (open) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setExpectedCode(code);
      setVerificationCode('');
      setError('');
    }
  }, [open]);

  const handleDelete = () => {
    if (verificationCode !== expectedCode) {
      setError('Incorrect verification code. Please try again.');
      return;
    }

    // Reset user data and log out
    resetData();
    logout();
    
    toast({
      title: "Account Deleted",
      description: "Your account has been permanently deleted",
      duration: 3000,
    });
    
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. It will permanently delete your account 
            and remove all your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="my-6 space-y-4">
          <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-destructive">Warning</h4>
              <p className="text-sm text-muted-foreground">
                This action will delete all your crypto holdings, mining progress, and account information.
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="verificationCode">
              Enter the following verification code to confirm: <span className="font-bold">{expectedCode}</span>
            </Label>
            <div className="flex justify-center my-4">
              <InputOTP maxLength={6} value={verificationCode} onChange={setVerificationCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountDialog;
