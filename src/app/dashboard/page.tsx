"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Calendar, Clapperboard, Loader2, Smartphone, Trophy, Users, Check, MessageSquare, Phone } from "lucide-react";
import { useRouter } from "next/navigation";


const tasks = [
    { 
        title: 'Send SMS Sim1',
        description: 'Rs 0.2 per success Sim1',
        reward: 220,
        currentProgress: 108,
        totalProgress: 1100,
        icon: MessageSquare,
        href: '/dashboard/tasks/sms1'
    },
    { 
        title: 'Send SMS Sim2',
        description: 'Rs 0.2 per success Sim2',
        reward: 220,
        currentProgress: 0,
        totalProgress: 1100,
        icon: MessageSquare,
        href: '/dashboard/tasks/sms2'
    },
    { 
        title: 'Whatsapp Message',
        description: 'Rs 0.5 per success',
        reward: 1100,
        currentProgress: 0,
        totalProgress: 2200,
        icon: Clapperboard,
        href: '/dashboard/tasks/whatsapp'
    },
    {
        title: 'Free Spin',
        description: 'Free Spin get max Rs 10',
        reward: 10,
        currentProgress: 406,
        totalProgress: 595,
        icon: Trophy,
        href: '/dashboard/spin-earn'
    },
    {
        title: 'Daily check in',
        description: 'Daily check in Rs 1',
        reward: 1,
        currentProgress: 0,
        totalProgress: 1,
        icon: Calendar,
        href: '/dashboard/check-in'
    },
    {
        title: 'Bind mobile number',
        description: '',
        reward: 0,
        currentProgress: 1,
        totalProgress: 1,
        icon: Phone,
        href: '/dashboard/profile'
    }
]

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }


  return (
    <div className="flex flex-col gap-4">
        <Tabs defaultValue="earn" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-secondary">
            <TabsTrigger value="earn">DailyEarnList</TabsTrigger>
            <TabsTrigger value="tasks">TaskDetail</TabsTrigger>
            <TabsTrigger value="ranking">WealthRanking</TabsTrigger>
          </TabsList>
          <TabsContent value="earn" className="mt-4">
                <Card className="bg-secondary/50">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                           <p className="font-bold">Daily Rs100</p>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="relative w-full">
                                <Progress value={33} className="h-3 bg-primary/20" indicatorClassName="bg-accent" />
                                <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-accent border-2 border-background flex items-center justify-center text-xs font-bold text-accent-foreground">
                                    +10
                                </div>
                                 <div className="absolute top-1/2 left-2/4 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background border-2 border-accent flex items-center justify-center text-xs font-bold text-accent">
                                    +50
                                </div>
                                <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background border-2 border-accent flex items-center justify-center text-xs font-bold text-accent">
                                    +100
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-3 mt-4">
                    {tasks.map(task => (
                        <Card key={task.title} className="bg-primary/80 text-primary-foreground overflow-hidden">
                            <CardContent className="p-3 flex items-center gap-4">
                                <div className="p-3 bg-primary-foreground/20 rounded-lg">
                                    <task.icon className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold">{task.title}</h3>
                                        <p className="text-xs">({task.currentProgress} / {task.totalProgress})</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-xs opacity-80">{task.description}</p>
                                        {task.reward > 0 && <p className="text-xs font-bold text-amber-300">+Rs{task.reward}</p>}
                                    </div>
                                </div>
                                <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold" onClick={() => router.push(task.href)}>
                                    {task.currentProgress >= task.totalProgress ? <Check/> : "Get"}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                 <Button className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg h-12">Auto Get</Button>
          </TabsContent>
          <TabsContent value="tasks">
            <Card>
                <CardHeader>
                    <CardTitle>Task Details</CardTitle>
                    <CardDescription>Details about available tasks will be shown here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Coming soon...</p>
                </CardContent>
            </Card>
          </TabsContent>
           <TabsContent value="ranking">
                <Card>
                <CardHeader>
                    <CardTitle>Wealth Ranking</CardTitle>
                    <CardDescription>See who is on top of the leaderboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Coming soon...</p>
                </CardContent>
            </Card>
           </TabsContent>
        </Tabs>
    </div>
  );
}
