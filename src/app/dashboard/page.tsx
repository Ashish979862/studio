"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Calendar, Clapperboard, Film, Loader2, Trophy, User } from "lucide-react";
import { useRouter } from "next/navigation";
import type { WithdrawalRequest } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const tasks = [
    {
        title: 'Spin & Earn',
        description: 'Spin the wheel to win rewards',
        reward: 10,
        icon: Trophy,
        href: '/dashboard/spin-earn'
    },
    {
        title: 'Watch Ads',
        description: 'Watch ads to earn money',
        reward: 0.10,
        icon: Film,
        href: '/dashboard/watch-ads'
    },
    {
        title: 'Daily check in',
        description: 'Daily check in for bonus',
        reward: 1,
        icon: Calendar,
        href: '/dashboard/check-in'
    },
]

export default function DashboardPage() {
  const { user, users, allWithdrawals } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const userWithdrawals = allWithdrawals
    .filter(w => w.userId === user.id)
    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const wealthRanking = users
    .filter(u => !u.isAdmin)
    .sort((a,b) => b.balance - a.balance)
    .slice(0, 10); // Top 10

  const userRank = users.filter(u => !u.isAdmin).sort((a,b) => b.balance - a.balance).findIndex(u => u.id === user.id) + 1;


  return (
    <div className="flex flex-col gap-4">
        <Tabs defaultValue="earn" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-secondary">
            <TabsTrigger value="earn">DailyEarnList</TabsTrigger>
            <TabsTrigger value="tasks">TaskDetail</TabsTrigger>
            <TabsTrigger value="ranking">WealthRanking</TabsTrigger>
          </TabsList>
          <TabsContent value="earn" className="mt-4">
                <div className="flex flex-col gap-3 mt-4">
                    {tasks.map(task => (
                        <Card key={task.title} className="bg-primary/80 text-primary-foreground overflow-hidden">
                            <CardContent className="p-3 flex items-center gap-4">
                                <div className="p-3 bg-primary-foreground/20 rounded-lg">
                                    <task.icon className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold">{task.title}</h3>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-xs opacity-80">{task.description}</p>
                                        {task.reward > 0 && <p className="text-xs font-bold text-amber-300">+Rs{task.reward.toFixed(2)}</p>}
                                    </div>
                                </div>
                                <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold" onClick={() => router.push(task.href)}>
                                    Go
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
          </TabsContent>
          <TabsContent value="tasks">
            <Card>
                <CardHeader>
                    <CardTitle>Your Activity History</CardTitle>
                    <CardDescription>A summary of your earnings and task completions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-secondary/50 rounded-lg">
                            <h4 className="text-sm text-muted-foreground">Spins Completed</h4>
                            <p className="text-2xl font-bold">{user.spinCount}</p>
                        </div>
                        <div className="p-4 bg-secondary/50 rounded-lg">
                            <h4 className="text-sm text-muted-foreground">Ads Watched</h4>
                            <p className="text-2xl font-bold">{user.adsWatched}</p>
                        </div>
                         <div className="p-4 bg-secondary/50 rounded-lg col-span-2">
                            <h4 className="text-sm text-muted-foreground">Check-in Streak</h4>
                            <p className="text-2xl font-bold">{user.dailyCheckIn.progress} Days</p>
                        </div>
                    </div>
                    <h4 className="font-bold pt-4">Withdrawal History</h4>
                    {userWithdrawals.length > 0 ? (
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userWithdrawals.map((w: WithdrawalRequest) => (
                            <TableRow key={w.id}>
                                <TableCell className="font-medium">₹{w.amount.toFixed(2)}</TableCell>
                                <TableCell>{new Date(w.date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                <Badge
                                    variant={w.status === 'approved' ? 'default' : w.status === 'rejected' ? 'destructive' : 'secondary'}
                                    className={cn(w.status === 'approved' && "bg-accent/80 text-accent-foreground", w.status === 'pending' && "bg-amber-500/80 text-white")}
                                >
                                    {w.status}
                                </Badge>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No withdrawal history.</p>
                    )}
                </CardContent>
            </Card>
          </TabsContent>
           <TabsContent value="ranking">
                <Card>
                <CardHeader>
                    <CardTitle>Wealth Ranking</CardTitle>
                    <CardDescription>Top earners on the platform. Your current rank is <span className="font-bold text-accent">#{userRank}</span>.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rank</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {wealthRanking.map((u, index) => (
                                <TableRow key={u.id}>
                                    <TableCell className="font-bold">#{index + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={`https://api.dicebear.com/8.x/bottts/svg?seed=${u.name}`} alt={u.name} />
                                                <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{u.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">₹{u.balance.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
           </TabsContent>
        </Tabs>
    </div>
  );
}
