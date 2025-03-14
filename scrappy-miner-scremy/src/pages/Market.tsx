
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCrypto } from '@/contexts/CryptoContext';
import CryptoPrice from '@/components/CryptoPrice';
import { formatNumber } from '@/lib/miningUtils';

const Market = () => {
  const { userData } = useCrypto();
  const { marketData } = userData;
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter coins based on search
  const filteredCoins = marketData.filter(coin => 
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort coins by market cap
  const sortedCoins = [...filteredCoins].sort((a, b) => b.marketCap - a.marketCap);
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Crypto Market</h1>
      </div>
      
      {/* Search and Filters */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search coins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Market Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Global Market Cap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${formatNumber(1897543210987)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-green-500">+2.1%</span>
              <span className="text-xs text-muted-foreground">24h</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              24h Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${formatNumber(124862349871)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-green-500">+5.3%</span>
              <span className="text-xs text-muted-foreground">24h</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bitcoin Dominance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              46.2%
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-red-500">-0.3%</span>
              <span className="text-xs text-muted-foreground">24h</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ScremyCoin Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              #128
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-green-500">+12</span>
              <span className="text-xs text-muted-foreground">24h</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Coin Listings */}
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Coins</TabsTrigger>
          <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
          <TabsTrigger value="losers">Top Losers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Coin</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Price</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">24h Change</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Market Cap</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCoins.map((coin) => (
                    <tr key={coin.symbol} className="border-b border-border">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                            {coin.symbol === 'BTC' ? '₿' : coin.symbol === 'ETH' ? 'Ξ' : coin.symbol === 'SCR' ? '💎' : coin.symbol.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-medium">{coin.name}</h3>
                            <p className="text-xs text-muted-foreground">{coin.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-medium">
                        ${formatNumber(coin.price)}
                      </td>
                      <td className={`p-4 text-right ${coin.change24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                      </td>
                      <td className="p-4 text-right text-muted-foreground">
                        ${formatNumber(coin.marketCap)}
                      </td>
                      <td className="p-4 text-right text-muted-foreground">
                        ${formatNumber(coin.volume24h)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="gainers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...marketData]
              .sort((a, b) => b.change24h - a.change24h)
              .filter(coin => coin.change24h > 0)
              .slice(0, 6)
              .map(coin => (
                <CryptoPrice key={coin.symbol} coin={coin} />
              ))
            }
          </div>
        </TabsContent>
        
        <TabsContent value="losers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...marketData]
              .sort((a, b) => a.change24h - b.change24h)
              .filter(coin => coin.change24h < 0)
              .slice(0, 6)
              .map(coin => (
                <CryptoPrice key={coin.symbol} coin={coin} />
              ))
            }
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Market;
