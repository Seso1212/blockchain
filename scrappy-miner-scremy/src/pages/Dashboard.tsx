
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Pickaxe, BarChart3, Wallet, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCrypto } from '@/contexts/CryptoContext';
import { formatNumber, formatFloat } from '@/lib/miningUtils';
import CryptoPrice from '@/components/CryptoPrice';

const Dashboard = () => {
  const { userData, convertScoinsToScr } = useCrypto();
  const { userStats, holdings, marketData, transactions } = userData;
  
  // Calculate portfolio value
  const portfolioValue = holdings.reduce((total, holding) => total + holding.valueUsd, 0);
  
  // Find SCR data
  const scrData = marketData.find(coin => coin.symbol === 'SCR');
  const scrHolding = holdings.find(h => h.symbol === 'SCR');
  
  // Format recent transactions
  const recentTransactions = transactions.slice(0, 5);
  
  // Format 24h portfolio change
  const portfolioChange = Math.random() < 0.6 ? 2.3 : -1.8; // Simulated value for demo
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/wallet">
              <Plus className="h-4 w-4 mr-1" />
              Deposit
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Portfolio Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Portfolio Value</CardDescription>
            <CardTitle className="text-2xl">
              ${formatNumber(portfolioValue)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1">
              {portfolioChange > 0 ? (
                <>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">{portfolioChange.toFixed(2)}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                  <span className="text-red-500">{Math.abs(portfolioChange).toFixed(2)}%</span>
                </>
              )}
              <span className="text-sm text-muted-foreground">24h</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>ScremyCoin</CardDescription>
            <CardTitle className="text-2xl">
              {scrHolding ? formatFloat(scrHolding.amount, 4) : "0.0000"} <span className="text-sm text-scremy">SCR</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1">
              {scrData && scrData.change24h > 0 ? (
                <>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">{scrData.change24h.toFixed(2)}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                  <span className="text-red-500">{Math.abs(scrData?.change24h || 0).toFixed(2)}%</span>
                </>
              )}
              <span className="text-sm text-muted-foreground">24h</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Scoins</CardDescription>
            <CardTitle className="text-2xl">
              {formatFloat(userStats.scoins, 2)} <span className="text-sm text-amber-400">Scoins</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-sm text-muted-foreground">
              Convert to SCR when you have enough
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={convertScoinsToScr}
              disabled={userStats.scoins < 10}
            >
              Convert to SCR
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Mining Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Mining Level</CardTitle>
          <CardDescription>
            Level {userStats.level} Miner - Complete tasks to level up and earn more SCR
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {userStats.level < 10 ? userStats.level + 1 : "MAX"}</span>
              <span>{Math.floor((userStats.exp / userStats.expRequired) * 100)}%</span>
            </div>
            <Progress value={(userStats.exp / userStats.expRequired) * 100} className="h-2" />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
              <Card className="border-border/50 bg-card/50">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Mining</CardTitle>
                    <Pickaxe className="h-4 w-4 text-scremy" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="text-2xl font-bold">{userStats.successfulMines}</div>
                  <p className="text-xs text-muted-foreground">Successful Blocks</p>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 bg-card/50">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Current Rate</CardTitle>
                    <BarChart3 className="h-4 w-4 text-scremy" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="text-2xl font-bold">{(0.05 + ((userStats.level - 1) / 9) * 0.45).toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">SCR/hour</p>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 bg-card/50">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">SCR Price</CardTitle>
                    <Wallet className="h-4 w-4 text-scremy" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="text-2xl font-bold">${scrData?.price.toFixed(2) || "0.15"}</div>
                  <p className="text-xs text-muted-foreground">USD</p>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 bg-card/50">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">SCR Value</CardTitle>
                    <BarChart3 className="h-4 w-4 text-scremy" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="text-2xl font-bold">${scrHolding ? (scrHolding.amount * (scrData?.price || 0.15)).toFixed(2) : "0.00"}</div>
                  <p className="text-xs text-muted-foreground">USD</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full bg-scremy hover:bg-scremy-dark">
            <Link to="/mining">
              <Pickaxe className="h-4 w-4 mr-2" />
              Start Mining
            </Link>
          </Button>
        </CardFooter>
      </Card>
      
      {/* Market Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Market Overview</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/market" className="flex items-center">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {marketData.map((coin) => (
            <CryptoPrice key={coin.symbol} coin={coin} />
          ))}
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/wallet" className="flex items-center">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            {recentTransactions.length > 0 ? (
              <div className="divide-y divide-border">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${tx.type === 'mine' ? 'bg-scremy/10' : tx.type === 'sell' ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                        {tx.type === 'mine' ? (
                          <Pickaxe className={`h-4 w-4 ${tx.type === 'mine' ? 'text-scremy' : tx.type === 'sell' ? 'text-red-500' : 'text-green-500'}`} />
                        ) : tx.type === 'sell' ? (
                          <ArrowUpRight className="h-4 w-4 text-red-500" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(tx.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {tx.type === 'sell' ? '-' : '+'}{tx.amount.toFixed(4)} {tx.symbol}
                      </p>
                      {tx.valueUsd && (
                        <p className="text-sm text-muted-foreground">
                          ${tx.valueUsd.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">No transactions yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
