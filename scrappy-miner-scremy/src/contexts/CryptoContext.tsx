import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DataService, UserData, UserStats, Transaction, CryptoHolding, MiningSpace, UserAuth } from '@/lib/dataService';
import { calculateExpRequired, formatFloat } from '@/lib/miningUtils';
import { useToast } from '@/hooks/use-toast';

interface CryptoContextProps {
  userData: UserData;
  auth: UserAuth | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  registerUser: (email: string, password: string) => boolean;
  loginUser: (credentials: { email: string; password: string }) => boolean;
  updateUserStats: (stats: Partial<UserStats>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateHolding: (symbol: string, amount: number) => void;
  updateMiningSpace: (id: number, data: Partial<MiningSpace>) => void;
  addScr: (amount: number) => void;
  addScoins: (amount: number) => void;
  addExp: (amount: number) => void;
  resetData: () => void;
  convertScoinsToScr: () => void;
  extendMiningDuration: () => void;
}

const CryptoContext = createContext<CryptoContextProps | undefined>(undefined);

export const CryptoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(DataService.initData());
  const [auth, setAuth] = useState<UserAuth | null>(DataService.getAuth());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(DataService.isLoggedIn());
  const { toast } = useToast();

  // Function to fetch wallet balance from blockchain
  const fetchBalance = async (address: string) => {
    try {
      const response = await fetch(`http://localhost:5000/balance/${address}`);
      const data = await response.json();
      if (response.ok) {
        return data.balance;
      }
      return 0;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  };

  // Function to start mining on blockchain
  const startMining = async (address: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/mining/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address })
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      }
      throw new Error(data.error);
    } catch (error) {
      console.error('Error starting mining:', error);
      throw error;
    }
  };

  useEffect(() => {
    const walletAddress = localStorage.getItem('wallet_address');
    if (walletAddress) {
      // Update balance from blockchain periodically
      const updateBalance = async () => {
        const balance = await fetchBalance(walletAddress);
        const updatedHoldings = userData.holdings.map(h => 
          h.symbol === 'SCR' ? { ...h, amount: balance } : h
        );
        setUserData(prev => ({ ...prev, holdings: updatedHoldings }));
      };

      updateBalance();
      const interval = setInterval(updateBalance, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    setUserData(DataService.initData());
    const interval = setInterval(() => {
      const data = DataService.initData();
      const updatedMarketData = data.marketData.map(coin => {
        const volatility = coin.symbol === 'BTC' ? 2 : coin.symbol === 'ETH' ? 1.8 : 2.5;
        const trend = (Math.random() - 0.48) * volatility;
        const priceChange = trend * Math.sqrt(30 / 86400);
        const newPrice = Math.max(coin.price * (1 + priceChange / 100), 0.00001);
        const change24h = coin.change24h * 0.997 + priceChange * 0.003;
        return {
          ...coin,
          price: newPrice,
          change24h: change24h,
          lastUpdated: Date.now()
        };
      });
      const updatedHoldings = data.holdings.map(holding => {
        const marketData = updatedMarketData.find(m => m.symbol === holding.symbol);
        const valueUsd = marketData ? marketData.price * holding.amount : holding.valueUsd;
        return {
          ...holding,
          valueUsd
        };
      });
      const updatedData = {
        ...data,
        marketData: updatedMarketData,
        holdings: updatedHoldings,
      };
      DataService.saveData(updatedData);
      setUserData(updatedData);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const registerUser = (email: string, password: string): boolean => {
    try {
      DataService.registerUser({ 
        email, 
        password,
        fullName: '',
        username: '',
        isEmailVerified: false,
        isPhoneVerified: false,
        provider: 'email'
      });
      const authData = DataService.getAuth();
      if (authData) {
        setAuth(authData);
        setIsAuthenticated(true);
      }
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully",
        duration: 3000,
      });
      return true;
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to register user",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
  };

  const loginUser = (credentials: { email: string; password: string }): boolean => {
    try {
      const authResult = DataService.loginUser(credentials);
      if (authResult) {
        setAuth(authResult);
        setIsAuthenticated(true);
        toast({
          title: "Login Successful",
          description: "Welcome back to ScremyCoin!",
          duration: 3000,
        });
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
          duration: 3000,
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Failed to login",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
  };

  const login = () => {
    const authData = DataService.getAuth();
    if (authData) {
      setAuth(authData);
      setIsAuthenticated(true);
      toast({
        title: "Login Successful",
        description: "Welcome back to ScremyCoin!",
        duration: 3000,
      });
    }
  };

  const logout = () => {
    DataService.logoutUser();
    setAuth(null);
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
      duration: 3000,
    });
  };

  const updateUserStats = (stats: Partial<UserStats>) => {
    const updatedData = DataService.updateUserStats(stats);
    setUserData(updatedData);
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const updatedData = DataService.addTransaction(transaction);
    setUserData(updatedData);
  };

  const updateHolding = (symbol: string, amount: number) => {
    const updatedData = DataService.updateHolding(symbol, amount);
    setUserData(updatedData);
  };

  const updateMiningSpace = (id: number, data: Partial<MiningSpace>) => {
    const updatedData = DataService.updateMiningSpace(id, data);
    setUserData(updatedData);
  };

  const addScr = async (amount: number) => {
    const walletAddress = localStorage.getItem('wallet_address');
    if (!walletAddress) {
      toast({
        title: "Error",
        description: "No wallet address found",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      // Start mining on blockchain
      const result = await startMining(walletAddress);

      // Update local state with new balance
      const currentScr = result.new_balance;
      updateHolding('SCR', currentScr);

      addTransaction({
        type: 'mine',
        amount: result.reward,
        symbol: 'SCR',
        timestamp: Date.now(),
        valueUsd: result.reward * 0.15, // Using fixed price for now
        status: 'completed'
      });

      toast({
        title: "Mining Successful",
        description: `You earned ${result.reward.toFixed(4)} SCR`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Mining Failed",
        description: error instanceof Error ? error.message : "Failed to mine SCR",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const addScoins = (amount: number) => {
    updateUserStats({ scoins: (userData.userStats.scoins || 0) + amount });
  };

  const addExp = (amount: number) => {
    const { level, exp } = userData.userStats;
    const expRequired = calculateExpRequired(level);
    const newExp = exp + amount;
    if (newExp >= expRequired && level < 10) {
      updateUserStats({
        level: level + 1,
        exp: newExp - expRequired,
        expRequired: calculateExpRequired(level + 1)
      });
      toast({
        title: "Level Up!",
        description: `Congratulations! You've reached level ${level + 1}.`,
        duration: 3000,
      });
    } else {
      updateUserStats({ exp: newExp });
    }
  };

  const resetData = () => {
    const freshData = DataService.resetData();
    setUserData(freshData);
    toast({
      title: "Data Reset",
      description: "All your cryptocurrency data has been reset.",
      duration: 3000,
    });
  };

  const convertScoinsToScr = () => {
    const { scoins } = userData.userStats;
    if (scoins < 10) {
      toast({
        title: "Conversion Failed",
        description: "You need at least 10 Scoins to convert to SCR.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    const scrAmount = scoins / 100;
    updateUserStats({ scoins: 0 });
    addScr(scrAmount);
    addTransaction({
      type: 'convert',
      amount: scrAmount,
      symbol: 'SCR',
      timestamp: Date.now(),
      valueUsd: scrAmount * DataService.getScrPrice(),
      status: 'completed'
    });
    toast({
      title: "Conversion Successful",
      description: `Converted ${formatFloat(scoins, 2)} Scoins to ${formatFloat(scrAmount, 4)} SCR`,
      duration: 3000,
    });
  };

  const extendMiningDuration = () => {
    const { scoins } = userData.userStats;
    if (scoins < 5) {
      toast({
        title: "Extension Failed",
        description: "You need at least 5 Scoins to extend mining duration.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    try {
      const updatedData = DataService.extendMiningDuration(scoins);
      setUserData(updatedData);
      toast({
        title: "Mining Extended",
        description: "Mining duration extended to 24 hours for 5 Scoins",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Extension Failed",
        description: error instanceof Error ? error.message : "Failed to extend mining duration",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const contextValue: CryptoContextProps = {
    userData,
    auth,
    isAuthenticated,
    login,
    logout,
    registerUser,
    loginUser,
    updateUserStats,
    addTransaction,
    updateHolding,
    updateMiningSpace,
    addScr,
    addScoins,
    addExp,
    resetData,
    convertScoinsToScr,
    extendMiningDuration
  };

  return (
    <CryptoContext.Provider value={contextValue}>
      {children}
    </CryptoContext.Provider>
  );
};

export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (context === undefined) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
};