"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CalendarCheck, CheckCircle, Gift, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const rewards = [
    { day: 1, reward: 0.25 },
    { day: 2, reward: 0.50 },
    { day: 3, reward: 0.75 },
    { day: 4, reward: 1.00 },
    { day: 5, reward: 1.25 },
    { day: 6, reward: 1.50 },
    { day: 7, reward: 5.00, special: true }, // or 10
];

export default function CheckInPage() {
    const { user, addCheckIn, loading } = useAuth();
    const { toast } = useToast();
    const [today, setToday] = useState(new Date());

    const isDateToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }

    const checkInStatus = user?.dailyCheckIn;
    const lastCheckInDate = checkInStatus?.lastCheckIn ? new Date(checkInStatus.lastCheckIn) : null;
    
    // Check if progress should be reset
    let progress = checkInStatus?.progress || 0;
    if (lastCheckInDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const isLastCheckinYesterday = lastCheckInDate.getDate() === yesterday.getDate() &&
                                     lastCheckInDate.getMonth() === yesterday.getMonth() &&
                                     lastCheckInDate.getFullYear() === yesterday.getFullYear();

        const isLastCheckinToday = isDateToday(lastCheckInDate);

        if (!isLastCheckinYesterday && !isLastCheckinToday) {
            progress = 0;
        }
    }
    
    const canCheckInToday = lastCheckInDate ? !isDateToday(lastCheckInDate) : true;
    const nextDay = (progress % 7) + 1;

    const handleCheckIn = () => {
        if (!canCheckInToday) {
            toast({ title: "Already Checked In!", description: "You've already checked in today. Come back tomorrow!", variant: "destructive" });
            return;
        }
        const rewardInfo = rewards.find(r => r.day === nextDay);
        if (rewardInfo) {
            addCheckIn(nextDay, rewardInfo.reward);
            toast({ 
                title: `Day ${nextDay} Checked In!`, 
                description: `You've earned ₹${rewardInfo.reward.toFixed(2)}.`,
            });
        }
    };
    
    if (loading || !user) {
        return (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        );
    }
    
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline text-foreground">Daily Check-in</h1>
                    <p className="text-muted-foreground">Check in every day to earn rewards. Don't miss a day!</p>
                </div>
                 <Button onClick={handleCheckIn} disabled={!canCheckInToday} className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <CalendarCheck className="mr-2 h-4 w-4" />
                    {canCheckInToday ? `Check in for Day ${nextDay}` : "Checked in Today"}
                </Button>
            </div>
           
            <Card className="bg-secondary">
                <CardHeader>
                    <CardTitle>Your 7-Day Journey</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {rewards.map(({ day, reward, special }) => {
                            const isCompleted = day <= progress;
                            const isNext = day === nextDay && canCheckInToday;

                            return (
                                <div
                                    key={day}
                                    className={cn(
                                        "rounded-lg p-4 text-center border-2 transition-all flex flex-col items-center justify-center aspect-square",
                                        isCompleted ? "border-accent bg-accent/20 text-accent" : "border-dashed border-primary/50 bg-card",
                                        isNext && "border-accent bg-accent/20 animate-pulse",
                                        special && "lg:col-span-1 md:col-span-2 col-span-2"
                                    )}
                                >
                                    {isCompleted ? <CheckCircle className="h-8 w-8 mb-2" /> : <Gift className="h-8 w-8 mb-2 text-muted-foreground" />}
                                    <p className="font-semibold">Day {day}</p>
                                    <p className="text-lg font-bold">₹{reward.toFixed(2)}</p>
                                    {isNext && <p className="text-xs font-bold text-accent-foreground">Claim Now!</p>}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
