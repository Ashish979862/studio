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
import { Copy, Gift, Loader2, Share2, Users } from "lucide-react";

export default function PromotionPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  if (!user) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  const referralLink = `https://adspin.reward/signup?ref=${user.referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    toast({
      title: "Code Copied!",
      description: "Your referral code is copied to your clipboard.",
    });
  };

  const handleShare = () => {
    if(navigator.share) {
        navigator.share({
            title: 'Join me on AdSpin Reward!',
            text: `Join me on AdSpin Reward and get a ₹5 bonus! Use my code: ${user.referralCode}`,
            url: referralLink
        });
    } else {
        navigator.clipboard.writeText(referralLink);
        toast({
            title: "Link Copied!",
            description: "A shareable link has been copied to your clipboard.",
        });
    }
  };


  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <Card className="w-full max-w-2xl shadow-lg bg-secondary">
        <CardHeader>
          <div className="mx-auto bg-primary/20 p-3 rounded-full mb-4">
            <Users className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Refer a Friend & Earn</CardTitle>
          <CardDescription>
            Share your referral code with friends. When they join, you both get rewarded!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Your Unique Referral Code</p>
            <div className="my-2 p-4 border-2 border-dashed border-primary/50 rounded-lg bg-card">
              <p className="text-4xl font-bold font-mono tracking-widest text-primary">
                {user.referralCode}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleCopyCode} variant="outline" className="flex-1">
              <Copy className="mr-2 h-4 w-4" />
              Copy Code
            </Button>
            <Button onClick={handleShare} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Share2 className="mr-2 h-4 w-4" />
              Share Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl bg-secondary">
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Gift className="text-primary"/> How it Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-left">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                <div>
                    <h3 className="font-semibold">Share Your Code</h3>
                    <p className="text-muted-foreground text-sm">Share your unique referral code or link with your friends.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                <div>
                    <h3 className="font-semibold">Friend Signs Up</h3>
                    <p className="text-muted-foreground text-sm">Your friend signs up using your code and instantly receives a <span className="font-bold text-accent">₹5 bonus</span>.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                <div>
                    <h3 className="font-semibold">You Get Rewarded</h3>
                    <p className="text-muted-foreground text-sm">Once your friend watches 50 ads, you'll receive a <span className="font-bold text-accent">₹5 bonus</span> in your wallet as a thank you!</p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
