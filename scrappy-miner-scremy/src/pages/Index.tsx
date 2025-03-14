
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bitcoin, TrendingUp, Wallet, Globe, ChevronRight, Shield, Users, Award, Clock, Cpu, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  // Cryptocurrency data for featured section
  const featuredCryptos = [
    { name: 'Bitcoin', symbol: 'BTC', price: 56432.82, change: 2.4 },
    { name: 'Ethereum', symbol: 'ETH', price: 3123.45, change: -1.2 },
    { name: 'ScremyCoin', symbol: 'SCR', price: 0.00021, change: 15.7 },
    { name: 'Solana', symbol: 'SOL', price: 142.32, change: 5.8 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95">
      {/* Background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="circle-glow w-[800px] h-[800px] -top-[400px] -right-[400px] opacity-20" />
        <div className="circle-glow w-[600px] h-[600px] -bottom-[300px] -left-[300px] opacity-10" />
      </div>
      
      {/* Header/Navigation */}
      <header className="w-full py-4 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="inline-block">
            <span className="font-bold text-2xl md:text-3xl tracking-tight relative">
              <span className="opacity-90">Crypto</span>
              <span className="text-scremy">Verse</span>
              <div className="absolute -top-1 -right-3 w-2 h-2 rounded-full bg-scremy animate-pulse-soft" />
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#cryptocurrencies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cryptocurrencies</a>
            <a href="#learn" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Learn</a>
            <Link to="/mining" className="text-sm font-medium text-scremy hover:text-scremy-dark transition-colors">Mining</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden md:inline-flex">
              Sign In
            </Button>
            <Button size="sm" className="bg-scremy hover:bg-scremy-dark">
              Get Started
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Explore the World of Crypto with CryptoVerse
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Your gateway to the digital currency revolution. Trade, track, and mine cryptocurrencies all in one place.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/mining">
                  <Button size="lg" className="bg-scremy hover:bg-scremy-dark">
                    Start Mining
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center">
                <div className="absolute inset-0 bg-scremy/10 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-8 bg-scremy/20 rounded-full animate-spin-slow animation-delay-500 animate-reverse"></div>
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <div className="absolute inset-0 bg-scremy/10 rounded-full animate-ping-slow opacity-30"></div>
                  <div className="absolute inset-4 bg-scremy/20 rounded-full animate-ping-slow opacity-50 animation-delay-500"></div>
                  <div className="relative bg-scremy text-white w-32 h-32 rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                    SCR
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured cryptocurrencies */}
      <section id="cryptocurrencies" className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Featured Cryptocurrencies
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Track real-time prices and trends of the most popular cryptocurrencies.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
            {featuredCryptos.map((crypto) => (
              <div key={crypto.symbol} className="glass-card rounded-xl p-6 transition-all duration-200 hover:bg-black/30">
                <div className="flex items-center gap-3">
                  <div className="bg-muted/10 p-2 rounded-full">
                    {crypto.symbol === 'SCR' ? (
                      <div className="w-10 h-10 bg-scremy rounded-full flex items-center justify-center text-white font-bold text-xs">
                        SCR
                      </div>
                    ) : (
                      <Bitcoin className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{crypto.name}</h3>
                    <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-xl font-bold">${crypto.price.toLocaleString()}</p>
                  <p className={cn(
                    "text-sm flex items-center",
                    crypto.change > 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {crypto.change > 0 ? "+" : ""}{crypto.change}%
                    <TrendingUp className={cn("ml-1 h-3 w-3", crypto.change < 0 && "rotate-180")} />
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Button variant="outline" size="lg">
              View All Cryptocurrencies
            </Button>
          </div>
        </div>
      </section>
      
      {/* Mining Feature Highlight */}
      <section className="py-12 md:py-24 bg-gradient-to-b from-background/50 to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
                <Cpu className="mr-1 h-4 w-4 text-scremy" />
                <span>Exclusive Mining Feature</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Mine ScremyCoin Directly in Your Browser
              </h2>
              <p className="text-muted-foreground md:text-xl">
                No specialized hardware needed. Start mining ScremyCoin with just your web browser and earn rewards.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-scremy mt-0.5" />
                  <div>
                    <h3 className="font-medium">Secure Mining</h3>
                    <p className="text-sm text-muted-foreground">Cryptographically secure mining operations running directly in your browser.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="h-5 w-5 text-scremy mt-0.5" />
                  <div>
                    <h3 className="font-medium">Level-Based Rewards</h3>
                    <p className="text-sm text-muted-foreground">Earn more as you level up. Complete tasks to increase your mining efficiency.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Gem className="h-5 w-5 text-scoin mt-0.5" />
                  <div>
                    <h3 className="font-medium">Scoins System</h3>
                    <p className="text-sm text-muted-foreground">Earn Scoins through mining spaces, watching ads, and referrals.</p>
                  </div>
                </div>
              </div>
              <Link to="/mining">
                <Button size="lg" className="bg-scremy hover:bg-scremy-dark">
                  Start Mining Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="glass-card rounded-xl overflow-hidden border border-white/10 max-w-md">
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 bg-scremy/20 rounded-full animate-ping-slow"></div>
                      <div className="relative bg-scremy text-white w-full h-full rounded-full flex items-center justify-center text-xl font-bold">SCR</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Mining Level</span>
                        <span className="font-medium">Level 3</span>
                      </div>
                      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                        <div className="h-full bg-scremy w-[45%] rounded-full"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="glass-card rounded-lg p-3">
                        <p className="text-muted-foreground mb-1">Balance</p>
                        <p className="font-semibold">
                          1.2453 <span className="text-scremy">SCR</span>
                        </p>
                      </div>
                      <div className="glass-card rounded-lg p-3">
                        <p className="text-muted-foreground mb-1">Scoins</p>
                        <p className="font-semibold">
                          35 <span className="text-amber-400">Scoins</span>
                        </p>
                      </div>
                    </div>
                    <Button className="w-full bg-scremy hover:bg-scremy-dark">
                      <Cpu className="mr-2 h-4 w-4" />
                      Mine Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section id="features" className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              All-in-One Cryptocurrency Platform
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              CryptoVerse offers everything you need to navigate the crypto world with confidence.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-3 gap-8 py-8">
            <div className="glass-card rounded-xl p-6 transition-all duration-200 hover:bg-black/30">
              <div className="mb-4 bg-scremy/10 p-3 rounded-full w-fit">
                <Globe className="h-6 w-6 text-scremy" />
              </div>
              <h3 className="text-xl font-bold mb-2">Global Marketplace</h3>
              <p className="text-muted-foreground">
                Access cryptocurrencies from around the world with real-time price data and market insights.
              </p>
            </div>
            <div className="glass-card rounded-xl p-6 transition-all duration-200 hover:bg-black/30">
              <div className="mb-4 bg-scremy/10 p-3 rounded-full w-fit">
                <Wallet className="h-6 w-6 text-scremy" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Wallet</h3>
              <p className="text-muted-foreground">
                Store your cryptocurrencies safely with our secure and easy-to-use digital wallet.
              </p>
            </div>
            <div className="glass-card rounded-xl p-6 transition-all duration-200 hover:bg-black/30">
              <div className="mb-4 bg-scremy/10 p-3 rounded-full w-fit">
                <Users className="h-6 w-6 text-scremy" />
              </div>
              <h3 className="text-xl font-bold mb-2">Community Rewards</h3>
              <p className="text-muted-foreground">
                Earn bonuses by referring friends and participating in the growing CryptoVerse community.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="glass-card rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">
              Ready to Start Your Crypto Journey?
            </h2>
            <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed mb-6">
              Join thousands of users already exploring the world of cryptocurrencies with CryptoVerse.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-scremy hover:bg-scremy-dark">
                Create Account
              </Button>
              <Link to="/mining">
                <Button variant="outline" size="lg">
                  Try Mining First
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full py-6 px-4 sm:px-6 border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold mb-4">CryptoVerse</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                <li><a href="#" className="hover:text-foreground">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Learn</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/mining" className="hover:text-foreground">Mining</Link></li>
                <li><a href="#" className="hover:text-foreground">Wallet</a></li>
                <li><a href="#" className="hover:text-foreground">Exchange</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms</a></li>
                <li><a href="#" className="hover:text-foreground">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              © 2023 CryptoVerse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
