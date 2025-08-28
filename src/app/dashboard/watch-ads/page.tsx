"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Clapperboard, Film, Loader2, PartyPopper } from "lucide-react";
import { useState } from "react";

const AD_REWARD = 0.10;

export default function WatchAdsPage() {
    const { updateBalance, addAdWatch, user } = useAuth();
    const { toast } = useToast();
    const [isWatching, setIsWatching] = useState(false);
    const [canClaim, setCanClaim] = useState(false);

    const handleWatchAd = () => {
        setIsWatching(true);
        window.open("https://www.profitableratecpm.com/njseimy1r?key=29f8739305aa2e02dceabda39abaa733", "_blank");

        // Simulate ad watching time
        setTimeout(() => {
            setIsWatching(false);
            setCanClaim(true);
            toast({
                title: "Ad finished!",
                description: "You can now claim your reward.",
            });
        }, 5000); // 5 seconds
    };

    const handleClaim = () => {
        updateBalance(AD_REWARD);
        addAdWatch();
        setCanClaim(false);
        toast({
            title: "Reward Claimed!",
            description: `₹${AD_REWARD.toFixed(2)} has been added to your balance.`,
        });
    };
    
    if (!user) {
        return (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 items-center justify-center h-full text-center">
             <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4">
                        <Clapperboard className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Watch Ads & Earn</CardTitle>
                    <CardDescription>
                        Watch a short ad to earn ₹{AD_REWARD.toFixed(2)}. Your reward will be available to claim after the ad finishes.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    {isWatching ? (
                        <Button disabled className="w-full">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Watching Ad...
                        </Button>
                    ) : canClaim ? (
                        <Button onClick={handleClaim} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                            <PartyPopper className="mr-2 h-4 w-4" />
                            Claim ₹{AD_REWARD.toFixed(2)}
                        </Button>
                    ) : (
                        <Button onClick={handleWatchAd} className="w-full">
                            <Film className="mr-2 h-4 w-4" />
                            Watch an Ad
                        </Button>
                    )}
                    <p className="text-sm text-muted-foreground">Ads Watched Today: {user.adsWatched}</p>
                </CardContent>
            </Card>
        </div>
    );
}
