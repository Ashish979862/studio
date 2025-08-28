
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, CalendarCheck, Clapperboard, Loader2, Mail, Smartphone, Trophy, User as UserIcon, Users, Wallet } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function UserDetailPage() {
    const { users, loading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    const user = users.find(u => u.id === userId);
    const referredUsers = users.filter(u => u.referredBy === user?.id);

    if (!user) {
        return (
            <div className="text-center">
                <p>User not found.</p>
                <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
            </div>
        );
    }
    
    const stats = [
        { label: "Current Balance", value: `₹${user.balance.toFixed(2)}`, icon: Wallet },
        { label: "Total Earnings", value: `₹${user.totalEarnings.toFixed(2)}`, icon: Trophy },
        { label: "Spins Completed", value: user.spinCount, icon: Trophy },
        { label: "Ads Watched", value: user.adsWatched, icon: Clapperboard },
        { label: "Check-in Streak", value: `${user.dailyCheckIn.progress} Days`, icon: CalendarCheck },
        { label: "Total Referrals", value: referredUsers.length, icon: Users },
    ]

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                 <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold font-headline">User Details</h1>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-1">
                    <CardHeader className="items-center text-center">
                        <Avatar className="w-24 h-24 mb-4">
                            <AvatarImage src={user.profilePicture || `https://api.dicebear.com/8.x/bottts/svg?seed=${user.name}`} alt={user.name} />
                            <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="font-headline text-2xl">{user.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2"><Mail className="h-4 w-4" /> {user.email}</CardDescription>
                         <Badge variant={user.isBlocked ? 'destructive' : 'secondary'} className="mt-2">
                            {user.isBlocked ? 'Blocked' : 'Active'}
                        </Badge>
                    </CardHeader>
                    <CardContent className="text-sm text-center space-y-2">
                         <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <UserIcon className="h-4 w-4" />
                            <span>User ID: {user.id}</span>
                         </div>
                         <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <Smartphone className="h-4 w-4" />
                           <span>Referral Code: {user.referralCode}</span>
                         </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>User Statistics</CardTitle>
                        <CardDescription>An overview of the user's activity on the platform.</CardDescription>
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

            <Card>
                <CardHeader>
                    <CardTitle>Referred Users ({referredUsers.length})</CardTitle>
                    <CardDescription>Users who signed up with {user.name}'s referral code.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Ads Watched</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {referredUsers.length > 0 ? referredUsers.map(refUser => (
                                <TableRow key={refUser.id}>
                                    <TableCell className="font-medium">{refUser.name}</TableCell>
                                    <TableCell>{refUser.email}</TableCell>
                                     <TableCell>{refUser.adsWatched}</TableCell>
                                    <TableCell>
                                        <Badge variant={refUser.adsWatched >= 50 ? 'default' : 'secondary'} className={refUser.adsWatched >= 50 ? 'bg-emerald-500/80' : ''}>
                                            {refUser.adsWatched >= 50 ? 'Bonus Paid' : 'Pending'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">This user has not referred anyone.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
