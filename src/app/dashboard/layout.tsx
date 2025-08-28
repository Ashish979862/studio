"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  Banknote,
  Coins,
  Gem,
  Gift,
  Home,
  Loader2,
  MessageSquare,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { EarnListIcon } from "@/components/icons/earn-list-icon";
import { CommunityIcon } from "@/components/icons/community-icon";
import { PromotionIcon } from "@/components/icons/promotion-icon";

const navItems = [
  { href: "/dashboard", icon: EarnListIcon, label: "Earn List" },
  { href: "/dashboard/community", icon: MessageSquare, label: "Help" },
  { href: "/dashboard/promotion", icon: PromotionIcon, label: "Promotion" },
  { href: "/dashboard/profile", icon: User, label: "Me" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.isAdmin)) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-primary/20 backdrop-blur-md p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Avatar className="h-12 w-12 border-2 border-accent">
                <AvatarImage src={user.profilePicture || `https://api.dicebear.com/8.x/bottts/svg?seed=${user.name}`} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg">{user.name}</p>
              <div className="flex items-center gap-2">
                <Gem className="h-4 w-4 text-amber-400" />
                <p className="font-bold text-lg">{user.balance.toFixed(2)} / {user.totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <Button onClick={() => router.push('/dashboard/withdraw')} className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-lg">
            Withdraw
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24">
        {children}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-primary/20 backdrop-blur-md border-t border-primary/20">
        <nav className="grid grid-cols-4 items-center justify-items-center p-2">
            {navItems.map((item) => (
                <Link key={item.label} href={item.href} className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors w-full",
                    pathname === item.href ? "text-accent" : "text-muted-foreground hover:text-foreground"
                )}>
                    <item.icon className="h-6 w-6" />
                    <span className="text-xs font-medium">{item.label}</span>
                </Link>
            ))}
        </nav>
      </footer>
    </div>
  );
}
