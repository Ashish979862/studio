"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import { cn } from "@/lib/utils";
import { Check, Loader2, X } from "lucide-react";

export default function AdminWithdrawalsPage() {
  const { allWithdrawals, updateWithdrawalStatus, loading } = useAuth();
  const { toast } = useToast();

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  const handleUpdate = (id: string, status: 'approved' | 'rejected') => {
      updateWithdrawalStatus(id, status);
      toast({
          title: "Status Updated",
          description: `Withdrawal has been ${status}.`
      })
  }

  const sortedWithdrawals = [...allWithdrawals].sort((a,b) => (a.status === 'pending' ? -1 : 1) - (b.status === 'pending' ? -1 : 1) || new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdrawal Requests</CardTitle>
        <CardDescription>
          Approve or reject withdrawal requests from users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>UPI ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedWithdrawals.length > 0 ? sortedWithdrawals.map((w) => (
              <TableRow key={w.id}>
                <TableCell className="font-medium">{w.userName}</TableCell>
                <TableCell>{w.upiId}</TableCell>
                <TableCell>₹{w.amount.toFixed(2)}</TableCell>
                <TableCell>₹{w.fee.toFixed(2)}</TableCell>
                <TableCell>₹{w.total.toFixed(2)}</TableCell>
                <TableCell>{new Date(w.date).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge
                    variant={w.status === 'approved' ? 'default' : w.status === 'rejected' ? 'destructive' : 'secondary'}
                    className={cn(w.status === 'approved' && "bg-emerald-500/80 text-white")}
                  >
                    {w.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {w.status === "pending" && (
                    <div className="flex gap-2">
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="text-emerald-500 border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600">
                                <Check className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Approve Withdrawal?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will mark the withdrawal of ₹{w.amount.toFixed(2)} for {w.userName} as approved. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleUpdate(w.id, 'approved')} className="bg-emerald-500 hover:bg-emerald-600">Approve</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                         <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                                <X className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reject Withdrawal?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will reject the withdrawal and refund ₹{w.amount.toFixed(2)} to {w.userName}'s balance. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleUpdate(w.id, 'rejected')} variant="destructive">Reject</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">No withdrawal requests found.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
