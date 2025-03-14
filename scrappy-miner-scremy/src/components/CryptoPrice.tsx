
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { MarketData } from '@/lib/dataService';
import { formatNumber } from '@/lib/miningUtils';

interface CryptoPriceProps {
  coin: MarketData;
}

const CryptoPrice: React.FC<CryptoPriceProps> = ({ coin }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              {coin.symbol === 'BTC' ? '₿' : coin.symbol === 'ETH' ? 'Ξ' : coin.symbol === 'SCR' ? '💎' : coin.symbol.charAt(0)}
            </div>
            <div>
              <h3 className="font-medium">{coin.name}</h3>
              <p className="text-xs text-muted-foreground">{coin.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">${formatNumber(coin.price)}</p>
            <div className="flex items-center justify-end gap-1">
              {coin.change24h > 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">{coin.change24h.toFixed(2)}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                  <span className="text-xs text-red-500">{Math.abs(coin.change24h).toFixed(2)}%</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoPrice;
