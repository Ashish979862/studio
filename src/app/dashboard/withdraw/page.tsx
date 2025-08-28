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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Banknote, CircleAlert, Loader2, Wallet } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import type { WithdrawalRequest } from "@/types";

const MIN_WITHDRAWAL = 50;
const PROCESSING_FEE_RATE = 0.05;

const formSchema = z.object({
  upiId: z.string().min(3, "Invalid UPI ID").regex(/@/, "Invalid UPI ID format"),
  amount: z.coerce.number().min(MIN_WITHDRAWAL, `Minimum withdrawal amount is ₹${MIN_WITHDRAWAL}.`),
});

export default function WithdrawPage() {
  const { user, updateBalance, addWithdrawal, allWithdrawals } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      upiId: "",
      amount: MIN_WITHDRAWAL,
    },
  });

  const watchAmount = form.watch("amount");
  const processingFee = watchAmount * PROCESSING_FEE_RATE;
  const totalCredited = watchAmount - processingFee;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user || user.balance < values.amount) {
      toast({ title: "Insufficient Balance", description: "You don't have enough funds to withdraw this amount.", variant: "destructive" });
      return;
    }
    
    addWithdrawal({
        userId: user.id,
        amount: values.amount,
        fee: processingFee,
        total: totalCredited,
        upiId: values.upiId
    });

    toast({ title: "Withdrawal Request Submitted", description: `Your request to withdraw ₹${values.amount} is being processed.` });
    form.reset();
  };

  if (!user) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  const userWithdrawals = allWithdrawals.filter(w => w.userId === user.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="grid gap-8 md:grid-cols-5">
      <div className="md:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
              <Banknote className="h-8 w-8" />
              Withdraw Your Earnings
            </CardTitle>
            <CardDescription>
              Transfer your balance to your UPI account. A 5% processing fee applies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
                  <Wallet className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <p className="text-xl font-bold">₹{user.balance.toFixed(2)}</p>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount to Withdraw (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="upiId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UPI ID</FormLabel>
                      <FormControl>
                        <Input placeholder="yourname@bank" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Card className="bg-secondary/50">
                    <CardContent className="p-4 space-y-2 text-sm">
                        <div className="flex justify-between"><span>Processing Fee (5%):</span> <span className="font-medium">- ₹{processingFee.toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold text-base"><span>You will receive:</span> <span>₹{totalCredited > 0 ? totalCredited.toFixed(2) : '0.00'}</span></div>
                    </CardContent>
                </Card>

                <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-destructive border border-destructive/20">
                    <CircleAlert className="h-5 w-5 mt-0.5 shrink-0" />
                    <p className="text-xs">
                        Withdrawals are typically processed within 24-48 hours. Ensure your UPI ID is correct as transactions are irreversible.
                    </p>
                </div>

                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Request Withdrawal
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userWithdrawals.length > 0 ? userWithdrawals.map((w: WithdrawalRequest) => (
                  <TableRow key={w.id}>
                    <TableCell className="font-medium">₹{w.amount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(w.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={w.status === 'approved' ? 'default' : w.status === 'rejected' ? 'destructive' : 'secondary'}
                        className={cn(w.status === 'approved' && "bg-emerald-500/80 text-white")}
                      >
                        {w.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">No withdrawal history.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
