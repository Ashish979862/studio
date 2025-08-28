"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Banknote,
  CalendarCheck,
  Clapperboard,
  Copy,
  DollarSign,
  Loader2,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";

const featureCards = [
    { 
        title: 'Daily Check-in', 
        description: 'Earn rewards every day.', 
        href: '/dashboard/check-in', 
        icon: CalendarCheck,
        color: 'text-sky-500',
        bg: 'bg-sky-500/10'
    },
    { 
        title: 'Watch Ads', 
        description: 'Get paid for watching short ads.', 
        href: '/dashboard/watch-ads', 
        icon: Clapperboard,
        color: 'text-rose-500',
        bg: 'bg-rose-500/10'
    },
    { 
        title: 'Spin & Earn', 
        description: 'Try your luck on the prize wheel.', 
        href: '/dashboard/spin-earn', 
        icon: Trophy,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10'
    },
    { 
        title: 'Withdraw Funds', 
        description: 'Cash out your earnings.', 
        href: '/dashboard/withdraw', 
        icon: Banknote,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10'
    },
    { 
        title: 'Refer Friends', 
        description: 'Earn more with your friends.', 
        href: '/dashboard/refer', 
        icon: Users,
        color: 'text-violet-500',
        bg: 'bg-violet-500/10'
    },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(user.referralCode);
    toast({
      title: "Copied to Clipboard",
      description: `Your referral code ${user.referralCode} has been copied.`,
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline">Welcome, {user.name}!</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{user.balance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Available to withdraw</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{user.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Referral Code</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold font-mono tracking-widest">{user.referralCode}</p>
              <Button variant="ghost" size="icon" onClick={handleCopy}>
                <Copy className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Share this code with friends</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featureCards.map((feature) => (
            <Card key={feature.title} className="hover:shadow-xl transition-shadow group">
                 <Link href={feature.href} className="block h-full">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className={cn("p-2 rounded-lg", feature.bg)}>
                                <feature.icon className={cn("h-6 w-6", feature.color)} />
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-lg font-semibold font-headline">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                </Link>
            </Card>
        ))}
      </div>
    </>
  );
}
