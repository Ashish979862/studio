"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldBan, ShieldCheck } from "lucide-react";

export default function AdminUsersPage() {
    const { users, toggleUserBlock, loading } = useAuth();
    const { toast } = useToast();

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    const handleToggleBlock = (userId: string, name: string, isBlocked: boolean) => {
        toggleUserBlock(userId);
        toast({
            title: `User ${isBlocked ? 'Unblocked' : 'Blocked'}`,
            description: `${name} has been ${isBlocked ? 'unblocked' : 'blocked'}.`
        })
    }

    const regularUsers = users.filter(u => !u.isAdmin);

    return(
        <Card>
            <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all registered users.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Balance</TableHead>
                            <TableHead>Spins</TableHead>
                            <TableHead>Ads</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {regularUsers.map(user => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>₹{user.balance.toFixed(2)}</TableCell>
                                <TableCell>{user.spinCount}</TableCell>
                                <TableCell>{user.adsWatched}</TableCell>
                                <TableCell>
                                    <Badge variant={user.isBlocked ? 'destructive' : 'secondary'}>
                                        {user.isBlocked ? 'Blocked' : 'Active'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button 
                                        variant={user.isBlocked ? "secondary" : "destructive"} 
                                        size="sm"
                                        onClick={() => handleToggleBlock(user.id, user.name, user.isBlocked)}
                                    >
                                        {user.isBlocked ? <ShieldCheck className="mr-2 h-4 w-4" /> : <ShieldBan className="mr-2 h-4 w-4" />}
                                        {user.isBlocked ? 'Unblock' : 'Block'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
