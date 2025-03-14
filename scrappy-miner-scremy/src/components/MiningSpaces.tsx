
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Play, Lock, Eye, Award, Gem, Plus } from 'lucide-react';
import { 
  formatTime, 
  MAX_SPACE_MINING_TIME, 
  SPACE_AD_DURATION, 
  SCOINS_PER_AD,
  SCOINS_PER_HOUR 
} from '@/lib/miningUtils';
import { useToast } from "@/components/ui/use-toast";
import { useCrypto } from '@/contexts/CryptoContext';

interface MiningSpaceProps {
  onMiningUpdate: (data: {
    isMining: boolean;
    wasSuccessful?: boolean;
    reward?: number;
    isSpace?: boolean;
  }) => void;
}

const MiningSpaces: React.FC<MiningSpaceProps> = ({ 
  onMiningUpdate
}) => {
  const { toast } = useToast();
  const { userData, updateMiningSpace, addScoins } = useCrypto();
  
  // Initialize spaces from userData
  const [spaces, setSpaces] = useState<Array<{
    id: number;
    unlocked: boolean;
    timeRemaining: number;
    active: boolean;
    premium: boolean;
    accruedScoins: number;
  }>>(userData.miningSpaces.map(space => ({
    id: space.id,
    unlocked: space.unlocked,
    timeRemaining: space.expiresAt ? Math.max(0, Math.floor((space.expiresAt - Date.now()) / 1000)) : 0,
    active: space.active,
    premium: space.isPremium,
    accruedScoins: space.scoinsEarned
  })));
  
  const [timers, setTimers] = useState<number[]>([]);
  const [scoinTimers, setScoinTimers] = useState<number[]>([]);
  const [totalScoins, setTotalScoins] = useState(userData.userStats.scoins || 0);

  // Sync spaces with userData when it changes
  useEffect(() => {
    setSpaces(userData.miningSpaces.map(space => ({
      id: space.id,
      unlocked: space.unlocked,
      timeRemaining: space.expiresAt ? Math.max(0, Math.floor((space.expiresAt - Date.now()) / 1000)) : 0,
      active: space.active,
      premium: space.isPremium,
      accruedScoins: space.scoinsEarned
    })));
    setTotalScoins(userData.userStats.scoins || 0);
  }, [userData]);

  // Handle watching an ad to unlock a space
  const handleWatchAd = (spaceId: number) => {
    // Award scoins for watching ad
    addScoins(SCOINS_PER_AD);
    setTotalScoins(prev => prev + SCOINS_PER_AD);
    
    // Calculate expiration time (current time + duration in hours)
    const expiresAt = Date.now() + (SPACE_AD_DURATION * 60 * 60 * 1000);
    
    // Update the space in context
    updateMiningSpace(spaceId, {
      unlocked: true,
      expiresAt,
      active: true, // Auto-start mining when unlocked
    });
    
    // Update local state
    setSpaces(currentSpaces => 
      currentSpaces.map(space => 
        space.id === spaceId 
          ? { ...space, unlocked: true, timeRemaining: SPACE_AD_DURATION * 60 * 60, active: true } 
          : space
      )
    );
    
    // Start the mining process automatically
    startSpaceMining(spaceId);
    
    toast({
      title: "Space Unlocked!",
      description: `Mining space ${spaceId} has been unlocked for ${SPACE_AD_DURATION} hours and started automatically.`,
      duration: 3000,
    });
  };

  // Purchase premium for a space
  const handlePremiumOffer = () => {
    toast({
      title: "Premium Offer",
      description: "Buy SCR worth $10 to get an extra space and 7000 XP!",
      duration: 5000,
    });
  };

  // Start mining in a specific space (automatically accrues SCoins)
  const startSpaceMining = (spaceId: number) => {
    const space = spaces.find(s => s.id === spaceId);
    if (!space || !space.unlocked) return;
    
    // Update in context
    updateMiningSpace(spaceId, {
      active: true
    });
    
    // Update local state
    setSpaces(currentSpaces => 
      currentSpaces.map(space => 
        space.id === spaceId 
          ? { ...space, active: true } 
          : space
      )
    );
    
    onMiningUpdate({ 
      isMining: true,
      isSpace: true
    });
    
    // Set up scoin accrual timer for this space
    const scoinTimer = window.setInterval(() => {
      // Calculate the amount of scoins earned per second
      const scoinsPerSecond = SCOINS_PER_HOUR / 3600;
      
      // Update local state
      setSpaces(currentSpaces => 
        currentSpaces.map(space => 
          space.id === spaceId && space.active
            ? { ...space, accruedScoins: space.accruedScoins + scoinsPerSecond }
            : space
        )
      );
      
      // Add scoins directly to user stats every second
      addScoins(scoinsPerSecond);
      setTotalScoins(prev => prev + scoinsPerSecond);
      
    }, 1000); // Update every second
    
    setScoinTimers(prev => [...prev, scoinTimer]);
    
    toast({
      title: "Space Mining Started",
      description: `Mining in space ${spaceId} has begun. You'll earn ${SCOINS_PER_HOUR} scoins per hour automatically.`,
      duration: 3000,
    });
  };

  // Auto-start mining for first space if available and not active
  useEffect(() => {
    const firstSpace = spaces.find(s => s.id === 1);
    if (firstSpace && !firstSpace.active) {
      startSpaceMining(1);
    }
  }, []);

  // Update timers for spaces
  useEffect(() => {
    // Clear existing timers
    timers.forEach(timerId => clearInterval(timerId));
    
    const newTimers = spaces
      .filter(space => space.unlocked && !space.premium && space.timeRemaining > 0)
      .map(space => {
        return window.setInterval(() => {
          setSpaces(currentSpaces => 
            currentSpaces.map(s => 
              s.id === space.id && s.timeRemaining > 0
                ? { ...s, timeRemaining: s.timeRemaining - 1 }
                : s.id === space.id && s.timeRemaining <= 0 && !s.premium
                  ? { ...s, unlocked: false, active: false, accruedScoins: 0 }
                  : s
            )
          );
          
          // If time just expired, update in context too
          if (space.timeRemaining === 1) {
            updateMiningSpace(space.id, {
              unlocked: false,
              active: false,
              scoinsEarned: 0,
              expiresAt: undefined
            });
          }
        }, 1000);
      });
    
    setTimers(newTimers);
    
    // Cleanup on unmount
    return () => {
      newTimers.forEach(timerId => clearInterval(timerId));
      scoinTimers.forEach(timerId => clearInterval(timerId));
    };
  }, [spaces.map(s => `${s.id}-${s.unlocked}-${s.premium}`).join(',')]);

  return (
    <div className="glass-card rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Mining Spaces</h2>
        <div className="flex items-center gap-2">
          <Gem className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-medium">{Math.floor(totalScoins)} Scoins</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4 text-center">
        Unlock mining spaces that automatically generate Scoins over time
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {spaces.map((space) => (
          <div 
            key={space.id}
            className={`glass-card p-4 rounded-lg flex flex-col items-center justify-center gap-2 ${
              space.unlocked 
                ? space.premium 
                  ? 'border border-amber-400/30' 
                  : 'border border-scremy/20'
                : 'border border-muted/10'
            }`}
          >
            <div className="text-lg font-medium flex items-center gap-2">
              {space.premium && <Award className="h-4 w-4 text-amber-400" />}
              Space {space.id}
            </div>
            
            {space.unlocked ? (
              <>
                {!space.premium && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {space.timeRemaining > 0 
                        ? `Expires in: ${formatTime(space.timeRemaining)}`
                        : 'Expired'}
                    </span>
                  </div>
                )}
                
                {space.premium && (
                  <div className="text-xs text-amber-400 flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    <span>Premium Space</span>
                  </div>
                )}
                
                {(space.timeRemaining > 0 || space.premium) ? (
                  <div className="space-y-2 w-full">
                    <div className="flex items-center justify-between text-xs">
                      <span>Status:</span>
                      <span className="font-medium text-green-500">Mining Active</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Rate:</span>
                      <span className="font-medium">{SCOINS_PER_HOUR} Scoins/hour</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Mining continues even when you're away!
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 w-full">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="w-full"
                      onClick={() => handleWatchAd(space.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Watch Ad
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                      onClick={handlePremiumOffer}
                    >
                      <Award className="h-4 w-4 mr-1" />
                      Upgrade to Premium
                    </Button>
                  </div>
                )}
              </>
            ) : (
              space.id === 1 ? (
                <Button 
                  size="sm" 
                  className="mt-2 bg-amber-500 hover:bg-amber-600 text-white"
                  onClick={() => {
                    // First space is free and always active
                    updateMiningSpace(1, {
                      unlocked: true,
                      active: true
                    });
                    
                    setSpaces(currentSpaces => 
                      currentSpaces.map(s => 
                        s.id === 1 
                          ? { ...s, unlocked: true, active: true } 
                          : s
                      )
                    );
                    
                    startSpaceMining(1);
                  }}
                >
                  <Play className="h-4 w-4 mr-1" />
                  Free Mining Space
                </Button>
              ) : (
                space.id === 5 ? (
                  <Button 
                    size="sm" 
                    className="mt-2 bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={handlePremiumOffer}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Premium Space
                  </Button>
                ) : (
                  <>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      <span>Locked</span>
                    </div>
                    <div className="space-y-2 w-full mt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full"
                        onClick={() => handleWatchAd(space.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Watch Ad to Unlock
                      </Button>
                    </div>
                  </>
                )
              )
            )}
          </div>
        ))}
      </div>
      
      <div className="flex flex-col items-center text-xs text-muted-foreground mt-4 gap-1">
        <p>Premium users get permanently unlocked spaces</p>
        <p>Mining continues even when you leave the app!</p>
      </div>
    </div>
  );
};

export default MiningSpaces;
