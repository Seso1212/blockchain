
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Pickaxe, BarChart3, Wallet, LayoutGrid, Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCrypto } from '@/contexts/CryptoContext';
import { cn } from '@/lib/utils';
import { formatFloat } from '@/lib/miningUtils';

const Layout = () => {
  const location = useLocation();
  const { userData } = useCrypto();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  const navItems = [
    { path: '/', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/mining', icon: <Pickaxe className="w-5 h-5" />, label: 'Mining' },
    { path: '/market', icon: <BarChart3 className="w-5 h-5" />, label: 'Market' },
    { path: '/portfolio', icon: <LayoutGrid className="w-5 h-5" />, label: 'Portfolio' },
    { path: '/wallet', icon: <Wallet className="w-5 h-5" />, label: 'Wallet' },
    { path: '/profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
  ];
  
  const scrBalance = userData.holdings.find(h => h.symbol === 'SCR')?.amount || 0;
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between border-b border-border p-4 sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-2xl tracking-tight">
            <span className="opacity-90">Scremy</span>
            <span className="text-scremy">Coin</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center mr-4">
            <span className="text-scremy font-medium">{formatFloat(scrBalance, 4)}</span>
            <span className="ml-1 text-sm text-muted-foreground">SCR</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </header>
      
      {/* Mobile Navigation Menu */}
      <div className={cn(
        "lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-transform duration-300 transform",
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="pt-20 px-4">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                  location.pathname === item.path
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-border p-4 sticky top-0 h-screen">
          <Link to="/" className="flex items-center space-x-2 mb-8 px-4 py-2">
            <span className="font-bold text-2xl tracking-tight">
              <span className="opacity-90">Scremy</span>
              <span className="text-scremy">Coin</span>
            </span>
          </Link>
          
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                  location.pathname === item.path
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="border-t border-border pt-4 px-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className="font-medium">
                <span className="text-scremy">{formatFloat(scrBalance, 4)}</span>
                <span className="ml-1 text-sm text-muted-foreground">SCR</span>
              </p>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
