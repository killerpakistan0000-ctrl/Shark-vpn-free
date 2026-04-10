/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, createContext, useContext } from 'react';
import { 
  Shield, 
  Globe, 
  Zap, 
  Lock, 
  Check, 
  CreditCard, 
  ArrowRight, 
  Menu, 
  X, 
  Power, 
  Activity, 
  MapPin, 
  Wifi, 
  ChevronRight,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ExternalLink,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { PRICING_PLANS, SERVERS, PAYMENT_DETAILS } from './constants';
import { cn } from '@/lib/utils';

// --- Context & Hooks ---

interface SubscriptionContextType {
  isSubscribed: boolean;
  subscribe: (planId: string) => void;
  unsubscribe: () => void;
  currentPlan: string | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error('useSubscription must be used within a SubscriptionProvider');
  return context;
}

// --- Components ---

function Navbar({ onOpenPricing }: { onOpenPricing: () => void }) {
  const { isSubscribed, unsubscribe } = useSubscription();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between",
      isScrolled ? "bg-background/80 backdrop-blur-md border-bottom border-border shadow-sm" : "bg-transparent"
    )}>
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Shield className="text-primary-foreground w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight font-heading">SharkVPN</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        <a href="#" className="hover:text-primary transition-colors">Features</a>
        <a href="#" className="hover:text-primary transition-colors">Servers</a>
        <a href="#" className="hover:text-primary transition-colors">Pricing</a>
        <a href="#" className="hover:text-primary transition-colors">Support</a>
      </div>

      <div className="flex items-center gap-4">
        {isSubscribed ? (
          <Button variant="ghost" size="sm" onClick={unsubscribe} className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        ) : (
          <>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Log In</Button>
            <Button size="sm" onClick={onOpenPricing} className="shadow-lg shadow-primary/20">Get Started</Button>
          </>
        )}
      </div>
    </nav>
  );
}

function PricingSection({ onSelectPlan }: { onSelectPlan: (plan: any) => void }) {
  return (
    <section className="py-24 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary text-primary px-4 py-1">Pricing Plans</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading">Choose your protection</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get the best security for all your devices. One subscription, unlimited possibilities.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan) => (
            <Card key={plan.id} className={cn(
              "relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2",
              plan.id === '1-year' ? "border-primary shadow-xl scale-105 z-10" : "border-border"
            )}>
              {plan.id === '1-year' && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                  Best Value
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/ period</span>
                </div>
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.id === '1-year' ? 'default' : 'outline'}
                  onClick={() => onSelectPlan(plan)}
                >
                  Select Plan
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function PaymentDialog({ plan, isOpen, onOpenChange, onComplete }: { 
  plan: any, 
  isOpen: boolean, 
  onOpenChange: (open: boolean) => void,
  onComplete: () => void
}) {
  const [method, setMethod] = useState<'paypal' | 'bank'>('paypal');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Subscription activated!", {
        description: `You are now subscribed to the ${plan.name} plan.`
      });
      onComplete();
      onOpenChange(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info("Copied to clipboard");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Subscription</DialogTitle>
          <DialogDescription>
            You've selected the <strong>{plan?.name}</strong> plan for <strong>${plan?.price}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={method} onValueChange={(v: any) => setMethod(v)} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paypal">PayPal</TabsTrigger>
            <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="paypal" className="space-y-4 py-4">
            <div className="bg-secondary/50 p-6 rounded-xl border border-border flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="text-blue-600 w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">PayPal Payment</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Please send <strong>${plan?.price}</strong> to the following PayPal email:
              </p>
              <div className="flex items-center gap-2 bg-background p-3 rounded-lg border border-border w-full justify-between">
                <code className="text-sm font-mono">{PAYMENT_DETAILS.paypal}</code>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(PAYMENT_DETAILS.paypal)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-4">
                After payment, click the button below to verify and activate your account.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="bank" className="space-y-4 py-4">
            <div className="bg-secondary/50 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" /> Bank Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Account Name:</span>
                  <span className="font-medium">{PAYMENT_DETAILS.bank.accountName}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Account Number:</span>
                  <span className="font-medium font-mono">{PAYMENT_DETAILS.bank.accountNumber}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Bank Name:</span>
                  <span className="font-medium">{PAYMENT_DETAILS.bank.bankName}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">SWIFT Code:</span>
                  <span className="font-medium font-mono">{PAYMENT_DETAILS.bank.swiftCode}</span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-4 text-center">
                Please include your username in the transfer reference.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>Cancel</Button>
          <Button onClick={handlePayment} disabled={isProcessing} className="min-w-[140px]">
            {isProcessing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Activity className="w-4 h-4" />
              </motion.div>
            ) : (
              "I've Paid"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Dashboard() {
  const { unsubscribe } = useSubscription();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedServer, setSelectedServer] = useState(SERVERS[0]);
  const [connectionTime, setConnectionTime] = useState(0);
  const [stats, setStats] = useState({ down: 0, up: 0 });

  useEffect(() => {
    let interval: any;
    if (isConnected) {
      interval = setInterval(() => {
        setConnectionTime(prev => prev + 1);
        setStats({
          down: Math.floor(Math.random() * 50) + 10,
          up: Math.floor(Math.random() * 10) + 2
        });
      }, 1000);
    } else {
      setConnectionTime(0);
      setStats({ down: 0, up: 0 });
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const toggleConnection = () => {
    if (isConnected) {
      setIsConnected(false);
      toast.info("VPN Disconnected");
    } else {
      setIsConnecting(true);
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
        toast.success(`Connected to ${selectedServer.name}`);
      }, 2500);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background dark p-4 md:p-8 flex flex-col gap-6">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Shield className="text-primary-foreground w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-heading">SharkVPN</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full"><HelpCircle className="w-5 h-5" /></Button>
          <Button variant="ghost" size="icon" className="rounded-full"><Settings className="w-5 h-5" /></Button>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={unsubscribe}><LogOut className="w-5 h-5" /></Button>
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border cursor-pointer">
            <User className="w-5 h-5" />
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-6 flex-1">
        {/* Left Panel: Connection */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card className="flex-1 vpn-gradient border-none relative overflow-hidden flex flex-col items-center justify-center p-12 min-h-[400px]">
            <AnimatePresence mode="wait">
              {isConnecting ? (
                <motion.div 
                  key="connecting"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative w-48 h-48 mb-8">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full"
                    />
                    <div className="absolute inset-4 border-4 border-primary/20 rounded-full flex items-center justify-center">
                      <Globe className="w-16 h-16 text-primary animate-pulse" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Connecting...</h2>
                  <p className="text-primary/60">Securing your connection to {selectedServer.city}</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center w-full"
                >
                  <div className={cn(
                    "relative w-56 h-56 mb-12 rounded-full flex items-center justify-center transition-all duration-500",
                    isConnected ? "bg-primary/10 shadow-[0_0_50px_rgba(0,209,138,0.2)]" : "bg-white/5"
                  )}>
                    {isConnected && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute inset-0 bg-primary/20 rounded-full"
                      />
                    )}
                    <Button 
                      onClick={toggleConnection}
                      className={cn(
                        "w-40 h-40 rounded-full shadow-2xl transition-all duration-500 z-10",
                        isConnected 
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground scale-110" 
                          : "bg-white/10 hover:bg-white/20 text-white"
                      )}
                    >
                      <Power className={cn("w-16 h-16", isConnected ? "animate-pulse" : "")} />
                    </Button>
                  </div>

                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-2">
                      {isConnected ? "Protected" : "Not Protected"}
                    </h2>
                    <p className={cn(
                      "text-sm font-medium transition-colors",
                      isConnected ? "text-primary" : "text-muted-foreground"
                    )}>
                      {isConnected 
                        ? `Connected for ${formatTime(connectionTime)}` 
                        : "Your connection is not encrypted"}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats Overlay */}
            {isConnected && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute bottom-8 left-8 right-8 grid grid-cols-3 gap-4"
              >
                <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Activity className="text-blue-400 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Latency</p>
                    <p className="font-bold">{selectedServer.latency} ms</p>
                  </div>
                </div>
                <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Wifi className="text-primary w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Download</p>
                    <p className="font-bold">{stats.down} Mbps</p>
                  </div>
                </div>
                <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <Zap className="text-orange-400 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Upload</p>
                    <p className="font-bold">{stats.up} Mbps</p>
                  </div>
                </div>
              </motion.div>
            )}
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card/50 border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" /> Security Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Kill Switch</Label>
                    <p className="text-[10px] text-muted-foreground">Block internet if VPN drops</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">CleanWeb</Label>
                    <p className="text-[10px] text-muted-foreground">Block ads and malware</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Current IP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-border">
                  <code className="text-sm font-mono">
                    {isConnected ? `104.28.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` : "192.168.1.45"}
                  </code>
                  <Badge variant={isConnected ? "default" : "outline"}>
                    {isConnected ? "Virtual" : "Real"}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground mt-3">
                  Your real location is {isConnected ? "hidden" : "visible to websites"}.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Panel: Servers */}
        <Card className="lg:col-span-4 bg-card/50 border-border flex flex-col overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Locations</CardTitle>
              <Badge variant="secondary">{SERVERS.length} Servers</Badge>
            </div>
            <div className="relative mt-4">
              <Input placeholder="Search locations..." className="pl-9 bg-background/50" />
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-4 pt-0 space-y-2">
              {SERVERS.map((server) => (
                <div 
                  key={server.id}
                  onClick={() => !isConnected && setSelectedServer(server)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group",
                    selectedServer.id === server.id 
                      ? "bg-primary/10 border-primary" 
                      : "bg-background/30 border-transparent hover:border-border hover:bg-background/50",
                    isConnected && selectedServer.id !== server.id && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{server.flag}</span>
                    <div>
                      <p className="text-sm font-bold">{server.name}</p>
                      <p className="text-[10px] text-muted-foreground">{server.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">Load</p>
                      <div className="w-12 h-1 bg-secondary rounded-full mt-1 overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            server.load > 80 ? "bg-destructive" : server.load > 50 ? "bg-orange-500" : "bg-primary"
                          )}
                          style={{ width: `${server.load}%` }}
                        />
                      </div>
                    </div>
                    <ChevronRight className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-1",
                      selectedServer.id === server.id && "text-primary"
                    )} />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 bg-background/50 border-t border-border">
            <Button 
              className="w-full" 
              disabled={isConnected || isConnecting}
              onClick={toggleConnection}
            >
              Connect to {selectedServer.city}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function LandingPage({ onOpenPricing }: { onOpenPricing: () => void }) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-6 border-primary/50 text-primary px-4 py-1.5 text-sm font-medium">
              Trusted by 10M+ users worldwide
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight font-heading leading-tight">
              Secure your digital life <br />
              <span className="text-primary">with SharkVPN</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Stay private, access global content, and protect all your devices with our 
              next-generation encryption and high-speed global server network.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={onOpenPricing} className="h-14 px-10 text-lg shadow-xl shadow-primary/20 group">
                Get SharkVPN Now <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg">
                View Features
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <img 
              src="https://picsum.photos/seed/vpn-dashboard/1200/800" 
              alt="SharkVPN Dashboard" 
              className="rounded-3xl border border-border shadow-2xl mx-auto"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-heading">Military-Grade Encryption</h3>
              <p className="text-muted-foreground">
                We use AES-256-GCM encryption to ensure your data stays private and secure from prying eyes.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-heading">Global Server Network</h3>
              <p className="text-muted-foreground">
                Access 3,200+ servers in 100 countries. Bypass geo-restrictions and enjoy global content.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-heading">Ultra-Fast Speeds</h3>
              <p className="text-muted-foreground">
                Our optimized network ensures minimal latency and maximum throughput for streaming and gaming.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PricingSection onSelectPlan={onOpenPricing} />

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-secondary/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Shield className="text-primary w-6 h-6" />
            <span className="text-xl font-bold font-heading">SharkVPN</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <a href="#" className="hover:text-primary">Cookie Policy</a>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 SharkVPN. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// --- Main App ---

export default function App() {
  const [isSubscribed, setIsSubscribed] = useState(() => {
    return localStorage.getItem('sharkvpn_subscribed') === 'true';
  });
  const [currentPlan, setCurrentPlan] = useState<string | null>(() => {
    return localStorage.getItem('sharkvpn_plan');
  });
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const subscribe = (planId: string) => {
    setIsSubscribed(true);
    setCurrentPlan(planId);
    localStorage.setItem('sharkvpn_subscribed', 'true');
    localStorage.setItem('sharkvpn_plan', planId);
  };

  const unsubscribe = () => {
    setIsSubscribed(false);
    setCurrentPlan(null);
    localStorage.removeItem('sharkvpn_subscribed');
    localStorage.removeItem('sharkvpn_plan');
    toast.info("Logged out successfully");
  };

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
    setIsPaymentOpen(true);
  };

  return (
    <SubscriptionContext.Provider value={{ isSubscribed, subscribe, unsubscribe, currentPlan }}>
      <div className="min-h-screen bg-background selection:bg-primary/30">
        {!isSubscribed ? (
          <>
            <Navbar onOpenPricing={() => setIsPricingOpen(true)} />
            <LandingPage onOpenPricing={() => setIsPricingOpen(true)} />
            
            {/* Pricing Modal for Landing Page */}
            <Dialog open={isPricingOpen} onOpenChange={setIsPricingOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-3xl text-center">Choose your plan</DialogTitle>
                </DialogHeader>
                <div className="grid md:grid-cols-3 gap-6 py-8">
                  {PRICING_PLANS.map((plan) => (
                    <Card key={plan.id} className={cn(
                      "flex flex-col border-2",
                      plan.id === '1-year' ? "border-primary" : "border-border"
                    )}>
                      <CardHeader>
                        <CardTitle>{plan.name}</CardTitle>
                        <div className="text-3xl font-bold mt-2">${plan.price}</div>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <ul className="space-y-2 text-sm">
                          {plan.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-primary shrink-0" /> {f}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" onClick={() => handleSelectPlan(plan)}>Select</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <Dashboard />
        )}

        <PaymentDialog 
          plan={selectedPlan} 
          isOpen={isPaymentOpen} 
          onOpenChange={setIsPaymentOpen}
          onComplete={() => subscribe(selectedPlan?.id)}
        />
        
        <Toaster position="top-center" richColors />
      </div>
    </SubscriptionContext.Provider>
  );
}
