"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { CalendarCheck, Clapperboard, Copy, Loader2, Trophy, User } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  if (!user) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${label} Copied!`,
      description: `${text} copied to clipboard.`,
    });
  };

  const stats = [
    { label: "Total Earnings", value: `₹${user.totalEarnings.toFixed(2)}`, icon: Trophy },
    { label: "Spins Completed", value: user.spinCount, icon: Trophy },
    { label: "Ads Watched", value: user.adsWatched, icon: Clapperboard },
    { label: "Check-in Streak", value: `${user.dailyCheckIn.progress} Days`, icon: CalendarCheck },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start">
        <div>
          <h1 className="text-3xl font-bold font-headline">Your Profile</h1>
          <p className="text-muted-foreground">View and manage your account details.</p>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
            <CardHeader className="items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={`https://api.dicebear.com/8.x/bottts/svg?seed=${user.name}`} alt={user.name} />
                  <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="font-headline text-2xl">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="uid">User ID</Label>
                        <div className="flex items-center gap-2">
                            <Input id="uid" readOnly value={user.id} />
                            <Button variant="outline" size="icon" onClick={() => handleCopy(user.id, "User ID")}>
                                <Copy className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                     <div>
                        <Label htmlFor="referral">Your Refer Code</Label>
                        <div className="flex items-center gap-2">
                            <Input id="referral" readOnly value={user.referralCode} />
                            <Button variant="outline" size="icon" onClick={() => handleCopy(user.referralCode, "Referral Code")}>
                                <Copy className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Your Statistics</CardTitle>
                <CardDescription>An overview of your activity on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    {stats.map(stat => (
                         <div key={stat.label} className="p-4 bg-secondary/50 rounded-lg flex items-center gap-4">
                             <div className="p-3 bg-primary/10 rounded-lg">
                                 <stat.icon className="h-6 w-6 text-primary" />
                             </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                <p className="text-xl font-bold">{stat.value}</p>
                            </div>
                         </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
