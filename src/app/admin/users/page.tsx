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
import { Loader2, ShieldBan, ShieldCheck, Wallet, Search, Eye } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
    const { users, toggleUserBlock, loading, adminUpdateUserBalance } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<{id: string, name: string} | null>(null);
    const [amount, setAmount] = useState(0);

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    const handleToggleBlock = (userId: string, name: string, isBlocked: boolean) => {
        toggleUserBlock(userId);
        toast({
            title: `User ${isBlocked ? 'Unblocked' : 'Blocked'}`,
            description: `${name} has been ${isBlocked ? 'unblocked' : 'blocked'}.`
        });
    };

    const handleBalanceUpdate = () => {
        if (!selectedUser || amount === 0) {
            toast({
                title: "Invalid Amount",
                description: "Please enter a valid non-zero amount.",
                variant: "destructive"
            });
            return;
        }
        adminUpdateUserBalance(selectedUser.id, amount);
        toast({
            title: "Balance Updated",
            description: `₹${amount.toFixed(2)} has been ${amount > 0 ? 'added to' : 'deducted from'} ${selectedUser.name}'s balance.`
        });
        setSelectedUser(null);
        setAmount(0);
    };

    const regularUsers = users
        .filter(u => !u.isAdmin)
        .filter(u => 
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return(
        <AlertDialog onOpenChange={(open) => { if (!open) { setSelectedUser(null); setAmount(0); }}}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>View and manage all registered users.</CardDescription>
                    </div>
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by name or email..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Balance</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {regularUsers.length > 0 ? regularUsers.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>₹{user.balance.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.isBlocked ? 'destructive' : 'secondary'}>
                                            {user.isBlocked ? 'Blocked' : 'Active'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <Button variant="outline" size="sm" onClick={() => router.push(`/admin/users/${user.id}`)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </Button>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" size="sm" onClick={() => setSelectedUser({id: user.id, name: user.name})}>
                                                    <Wallet className="mr-2 h-4 w-4" />
                                                    Balance
                                                </Button>
                                            </AlertDialogTrigger>
                                            <Button 
                                                variant={user.isBlocked ? "secondary" : "destructive"} 
                                                size="sm"
                                                onClick={() => handleToggleBlock(user.id, user.name, user.isBlocked)}
                                            >
                                                {user.isBlocked ? <ShieldCheck className="mr-2 h-4 w-4" /> : <ShieldBan className="mr-2 h-4 w-4" />}
                                                {user.isBlocked ? 'Unblock' : 'Block'}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            
            <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Manage {selectedUser?.name}'s Balance</AlertDialogTitle>
                  <AlertDialogDescription>
                    Enter a positive value to add funds or a negative value to deduct funds.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Amount (₹)
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBalanceUpdate}>Update Balance</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
