
import React from 'react';
import { 
  Bitcoin, 
  Clock, 
  Award,
  Gem,
  Star
} from 'lucide-react';
import { formatNumber, formatTime, MAX_MINING_TIME, formatFloat } from '@/lib/miningUtils';

interface StatsDisplayProps {
  balance: number;
  successfulMines: number;
  totalAttempts: number;
  level: number;
  exp?: number;
  expRequired?: number;
  activeMiningTime: number;
  autoMining?: boolean;
  scoins?: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  balance,
  successfulMines,
  totalAttempts,
  level = 1,
  exp = 0,
  expRequired = 100,
  activeMiningTime,
  autoMining = true,
  scoins = 0
}) => {
  const miningTimePercentage = (activeMiningTime / MAX_MINING_TIME) * 100;
  
  return (
    <div className="glass-card rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Mining Statistics</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Balance */}
        <div className="glass-card p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-scremy/10 p-2 rounded-full">
              <Bitcoin className="h-4 w-4 text-scremy" />
            </div>
            <h3 className="text-sm font-medium">SCR Balance</h3>
          </div>
          <p className="text-2xl font-bold">{formatFloat(balance, 4)}</p>
          <p className="text-xs text-muted-foreground">SCR</p>
        </div>
        
        {/* Scoins */}
        <div className="glass-card p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-amber-500/10 p-2 rounded-full">
              <Gem className="h-4 w-4 text-amber-400" />
            </div>
            <h3 className="text-sm font-medium">Scoins</h3>
          </div>
          <p className="text-2xl font-bold">{formatFloat(scoins, 2)}</p>
          <p className="text-xs text-muted-foreground">
            Can be exchanged for SCR
          </p>
        </div>
        
        {/* Mining Time */}
        <div className="glass-card p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-scremy/10 p-2 rounded-full">
              <Clock className="h-4 w-4 text-scremy" />
            </div>
            <h3 className="text-sm font-medium">Mining Time</h3>
          </div>
          <p className="text-2xl font-bold">{formatTime(activeMiningTime)}</p>
          <div className="w-full bg-muted h-1 rounded-full mt-2">
            <div 
              className="bg-scremy h-1 rounded-full"
              style={{ width: `${miningTimePercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Level */}
        <div className="glass-card p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-scremy/10 p-2 rounded-full">
              <Award className="h-4 w-4 text-scremy" />
            </div>
            <h3 className="text-sm font-medium">Miner Level</h3>
          </div>
          <p className="text-2xl font-bold">{level}</p>
          <div className="w-full bg-muted h-1 rounded-full mt-2">
            <div 
              className="bg-scremy h-1 rounded-full"
              style={{ width: `${(exp / expRequired) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-4 text-sm text-muted-foreground">
        <div>Successful Mines: {successfulMines}</div>
        <div>Total Attempts: {totalAttempts}</div>
      </div>
    </div>
  );
};

export default StatsDisplay;
