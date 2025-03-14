import React, { useState, useEffect } from 'react';
import { Clock, ArrowUpRight, ArrowDownRight, Copy, Check, Pickaxe, Repeat } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCrypto } from '@/contexts/CryptoContext';
import { formatNumber, formatFloat } from '@/lib/miningUtils';
import { toast } from '@/components/ui/use-toast';


const Wallet = () => {
  const { userData, addScr, convertScoinsToScr, addTransaction } = useCrypto(); // Added addTransaction
  const { transactions, holdings, userStats } = userData;
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState(0);

  // Get or generate wallet address
  const walletAddress = localStorage.getItem('wallet_address') || generateWalletAddress();

  useEffect(() => {
    // Fetch initial balance from blockchain
    fetchBalance();
    // Create wallet if it doesn't exist
    createWalletIfNeeded();
  }, []);

  const generateWalletAddress = () => {
    const address = '0x' + Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    localStorage.setItem('wallet_address', address);
    return address;
  };

  const createWalletIfNeeded = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/wallet/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: walletAddress })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await fetch(`http://localhost:5000/balance/${walletAddress}`);
      const data = await response.json();
      if (response.ok) {
        setBalance(data.balance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  // Copy address to clipboard
  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Transfer = () => {
    const [toAddress, setToAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [isTransferring, setIsTransferring] = useState(false);

    const handleTransfer = async () => {
      if (!amount || !toAddress) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      setIsTransferring(true);
      try {
        const response = await fetch('http://localhost:5000/api/transfer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from_address: walletAddress,
            to_address: toAddress,
            amount: parseFloat(amount)
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }

        // Update balance after successful transfer
        setBalance(data.new_balance);

        // Add transaction to history
        addTransaction({
          type: 'send',
          amount: parseFloat(amount),
          symbol: 'SCR',
          timestamp: Date.now(),
          valueUsd: parseFloat(amount) * 0.15,
          status: 'completed'
        });

        toast({
          title: "Transfer Successful",
          description: `Successfully sent ${amount} SCR`,
          duration: 3000,
        });

        // Clear form
        setToAddress('');
        setAmount('');
      } catch (error) {
        toast({
          title: "Transfer Failed",
          description: error instanceof Error ? error.message : "Failed to send SCR",
          variant: "destructive",
          duration: 3000,
        });
      } finally {
        setIsTransferring(false);
      }
    };

    return (
      <div className="space-y-4">
        <h2 className="font-semibold">Send SCR</h2>
        <div className="space-y-2">
          <Input
            placeholder="Recipient's Wallet Address"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button
            className="w-full"
            onClick={handleTransfer}
            disabled={isTransferring || !amount || !toAddress}
          >
            {isTransferring ? "Sending..." : "Send SCR"}
          </Button>
        </div>
      </div>
    );
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
              {formatFloat(balance, 4)} <span className="text-2xl">SCR</span>
            </div>
            <div className="text-sm text-muted-foreground">
              ≈ ${formatNumber(balance * 0.15)}
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
          <Separator className="my-4" />
          <Transfer />
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

      {/* Transaction History */}
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