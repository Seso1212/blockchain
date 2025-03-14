
import React, { useState } from 'react';
import { Clock, ArrowUpRight, ArrowDownRight, Copy, Check, Pickaxe, Repeat } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCrypto } from '@/contexts/CryptoContext';
import { formatNumber, formatFloat } from '@/lib/miningUtils';

const Wallet = () => {
  const { userData, addScr, convertScoinsToScr } = useCrypto();
  const { transactions, holdings, userStats } = userData;
  const [copied, setCopied] = useState(false);
  
  // Sample wallet address
  const walletAddress = '0x' + Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  
  // SCR balance
  const scrBalance = holdings.find(h => h.symbol === 'SCR')?.amount || 0;
  
  // Copy address to clipboard
  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
      </div>
      
      {/* Wallet Balance */}
      <Card>
        <CardHeader>
          <CardTitle>ScremyCoin Balance</CardTitle>
          <CardDescription>Your main ScremyCoin wallet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4 bg-scremy/10 p-6 rounded-lg">
            <div className="text-5xl font-bold text-scremy">
              {formatFloat(scrBalance, 4)} <span className="text-2xl">SCR</span>
            </div>
            <div className="text-sm text-muted-foreground">
              ≈ ${formatNumber(scrBalance * 0.15)}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Your Wallet Address</p>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyAddress}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Input value={walletAddress} readOnly className="font-mono text-xs" />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <Button className="flex-1 bg-scremy hover:bg-scremy-dark" asChild>
              <a href="/mining">
                <Pickaxe className="mr-2 h-4 w-4" />
                Mine SCR
              </a>
            </Button>
            <Button variant="outline" className="flex-1" onClick={convertScoinsToScr} disabled={userStats.scoins < 10}>
              <Repeat className="mr-2 h-4 w-4" />
              Convert {formatFloat(userStats.scoins, 2)} Scoins
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Debug section for demo */}
      <Card>
        <CardHeader>
          <CardTitle>Development Controls</CardTitle>
          <CardDescription>Tools for demonstration purposes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={() => addScr(1)}>
              Add 1 SCR
            </Button>
            <Button onClick={() => addScr(10)}>
              Add 10 SCR
            </Button>
            <Button onClick={() => addScr(100)}>
              Add 100 SCR
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Transactions History */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Transaction History</h2>
        
        <Card>
          <CardContent className="p-0">
            {transactions.length > 0 ? (
              <div className="divide-y divide-border">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        tx.type === 'mine' ? 'bg-scremy/10' : 
                        tx.type === 'sell' ? 'bg-red-500/10' : 
                        tx.type === 'convert' ? 'bg-amber-500/10' : 'bg-green-500/10'
                      }`}>
                        {tx.type === 'mine' ? (
                          <Pickaxe className="h-4 w-4 text-scremy" />
                        ) : tx.type === 'sell' ? (
                          <ArrowUpRight className="h-4 w-4 text-red-500" />
                        ) : tx.type === 'convert' ? (
                          <Repeat className="h-4 w-4 text-amber-500" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{
                          tx.type === 'mine' ? 'Mining Reward' : 
                          tx.type === 'sell' ? 'Sell' : 
                          tx.type === 'buy' ? 'Buy' : 
                          tx.type === 'convert' ? 'Scoins Conversion' : 
                          'Transfer'
                        }</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {new Date(tx.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {tx.type === 'sell' ? '-' : '+'}{tx.amount.toFixed(tx.symbol === 'SCR' ? 4 : 2)} {tx.symbol}
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

export default Wallet;
