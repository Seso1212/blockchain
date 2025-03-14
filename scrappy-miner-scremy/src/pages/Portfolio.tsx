
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCrypto } from '@/contexts/CryptoContext';
import { formatNumber } from '@/lib/miningUtils';

const colors = ['#845EF7', '#4C6EF5', '#228BE6', '#15AABF', '#12B886', '#40C057'];

const Portfolio = () => {
  const { userData } = useCrypto();
  const { holdings, marketData } = userData;
  
  // Calculate portfolio value and distribution
  const totalValue = holdings.reduce((sum, h) => sum + h.valueUsd, 0);
  
  const portfolioData = holdings.map((holding, index) => ({
    name: holding.symbol,
    value: holding.valueUsd,
    percentage: (holding.valueUsd / totalValue) * 100,
    color: colors[index % colors.length]
  }));
  
  // Generate chart data
  const portfolioHistory = [
    { date: '1w', value: totalValue * 0.92 },
    { date: '6d', value: totalValue * 0.94 },
    { date: '5d', value: totalValue * 0.88 },
    { date: '4d', value: totalValue * 0.91 },
    { date: '3d', value: totalValue * 0.97 },
    { date: '2d', value: totalValue * 0.99 },
    { date: '1d', value: totalValue * 0.98 },
    { date: 'Now', value: totalValue }
  ];
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
      </div>
      
      {/* Portfolio Value Card */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Value</CardTitle>
          <CardDescription>Your asset distribution and historical performance</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <div className="text-3xl font-bold">${formatNumber(totalValue)}</div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={portfolioHistory}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#845EF7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#845EF7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis hide />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <Tooltip 
                      formatter={(value: number) => [`$${formatNumber(value)}`, 'Value']}
                      contentStyle={{ 
                        backgroundColor: '#1e1e1e', 
                        borderColor: '#333', 
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#845EF7" 
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Asset Distribution</h3>
              </div>
              
              <div className="h-[200px]">
                {totalValue > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={portfolioData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {portfolioData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No assets yet</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                {portfolioData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span>{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div>${formatNumber(item.value)}</div>
                      <div className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Assets List */}
      <Card>
        <CardHeader>
          <CardTitle>Assets</CardTitle>
          <CardDescription>Your cryptocurrency holdings</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Asset</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Price</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Holdings</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Value</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Allocation</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding) => {
                const coin = marketData.find(m => m.symbol === holding.symbol);
                return (
                  <tr key={holding.symbol} className="border-b border-border">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                          {holding.symbol === 'BTC' ? '₿' : holding.symbol === 'ETH' ? 'Ξ' : holding.symbol === 'SCR' ? '💎' : holding.symbol.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium">{holding.name}</h3>
                          <p className="text-xs text-muted-foreground">{holding.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-medium">${coin ? formatNumber(coin.price) : "0.00"}</div>
                      <div className={`text-xs ${coin && coin.change24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {coin ? (coin.change24h > 0 ? '+' : '') + coin.change24h.toFixed(2) + '%' : "0.00%"}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-medium">{formatNumber(holding.amount)}</div>
                      <div className="text-xs text-muted-foreground">{holding.symbol}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-medium">${formatNumber(holding.valueUsd)}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-medium">{((holding.valueUsd / totalValue) * 100).toFixed(1)}%</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Portfolio;
