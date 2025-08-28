"use client";

import SpinWheel from "@/components/spin-wheel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PartyPopper, Trophy } from "lucide-react";
import { useState, useEffect } from "react";

const segments = [
    { value: 0.10, label: "₹0.10" },
    { value: 0.25, label: "₹0.25" },
    { value: 0.10, label: "₹0.10" },
    { value: 0.50, label: "₹0.50" },
    { value: 0.10, label: "₹0.10" },
    { value: 0, label: "Try Again" },
    { value: 0.10, label: "₹0.10" },
    { value: 1.00, label: "₹1.00" },
    { value: 0.10, label: "₹0.10" },
    { value: 0.75, label: "₹0.75" },
];

const prizePool = [
    // 80% chance for ₹0.10
    ...Array(8).fill({ value: 0.10, label: "₹0.10" }),
    // 10% chance for higher prizes
    ...[
        { value: 0.25, label: "₹0.25" },
        { value: 0.50, label: "₹0.50" },
        { value: 0.75, label: "₹0.75" },
        { value: 1.00, label: "₹1.00" },
    ].sort(() => 0.5 - Math.random()).slice(0,1), // pick one random high prize
    // 10% chance for "Better Luck Next Time"
    { value: 0, label: "Try Again" },
];

const bonuses = [
    { spins: 20, reward: 2, claimed: false },
    { spins: 50, reward: 5, claimed: false },
    { spins: 100, reward: 10, claimed: false },
];

export default function SpinAndEarnPage() {
    const { user, updateBalance, addSpin } = useAuth();
    const { toast } = useToast();
    const [rotation, setRotation] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        const cooldownEnd = localStorage.getItem(`cooldown_${user?.id}`);
        if (cooldownEnd) {
            const timeLeft = Math.max(0, new Date(cooldownEnd).getTime() - Date.now());
            setCooldown(timeLeft);
        }
    }, [user?.id]);
    
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1000), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleSpin = () => {
        if (spinning || !user || cooldown > 0) return;

        setSpinning(true);
        window.open("about:blank", "_blank"); // Adsterra direct link simulation

        setTimeout(() => {
            const prizePoolIndex = Math.floor(Math.random() * prizePool.length);
            const prize = prizePool[prizePoolIndex];

            // Find the first segment on the wheel that matches the prize value to determine where to stop
            const targetSegmentIndex = segments.findIndex(s => s.value === prize.value);
            
            const segmentAngle = 360 / segments.length;
            const randomOffset = Math.random() * segmentAngle * 0.8 - (segmentAngle * 0.4);
            const targetRotation = 360 * 5 + (360 - (targetSegmentIndex * segmentAngle + segmentAngle / 2)) + randomOffset;
            
            setRotation(prev => prev + targetRotation);
            addSpin();

            setTimeout(() => {
                setSpinning(false);
                if (prize.value > 0) {
                    updateBalance(prize.value);
                    toast({
                        title: "You Won!",
                        description: `Congratulations, you won ₹${prize.value.toFixed(2)}!`,
                    });
                } else {
                    toast({
                        title: "Better Luck Next Time!",
                        description: "Don't worry, try again.",
                        variant: "destructive"
                    });
                }
                
                checkBonuses(user.spinCount + 1);

            }, 4000); // Must match animation duration
        }, 1000); // Simulate delay after ad click
    };
    
    const checkBonuses = (currentSpins: number) => {
        const bonus = bonuses.find(b => b.spins === currentSpins);
        if (bonus) {
            updateBalance(bonus.reward);
            toast({
                title: "Progressive Bonus!",
                description: `You've completed ${bonus.spins} spins and earned a ₹${bonus.reward} bonus!`,
                duration: 5000,
            });
            if (bonus.spins === 100) {
                const cooldownEndTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour cooldown
                localStorage.setItem(`cooldown_${user?.id}`, cooldownEndTime.toISOString());
                setCooldown(60 * 60 * 1000);
            }
        }
    };

    if (!user) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }
    
    const formatCooldown = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return (
        <div className="flex flex-col items-center justify-center gap-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold font-headline text-foreground">Spin & Earn</h1>
                <p className="text-muted-foreground">Test your luck and win exciting prizes!</p>
            </div>

            <SpinWheel segments={segments} rotation={rotation} spinning={spinning} />
            
            <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                <Button onClick={handleSpin} disabled={spinning || cooldown > 0} className="w-full text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg">
                    {spinning ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Trophy className="mr-2 h-5 w-5" />}
                    {cooldown > 0 ? `Cooldown: ${formatCooldown(cooldown)}` : "SPIN NOW"}
                </Button>
                <p className="text-sm text-muted-foreground">Total Spins: {user.spinCount}</p>
            </div>

            <Card className="w-full max-w-lg bg-secondary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PartyPopper className="text-amber-500" />
                        Progressive Bonuses
                    </CardTitle>
                    <CardDescription>The more you spin, the more you earn!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {bonuses.map(bonus => (
                        <div key={bonus.spins} className="flex items-center justify-between">
                            <p>Reward at {bonus.spins} spins:</p>
                            <p className="font-bold text-accent">₹{bonus.reward}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
