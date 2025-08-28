"use client";

import type { ReactNode } from "react";
import { createContext, useEffect, useState, useCallback } from "react";
import type { User, WithdrawalRequest } from "@/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string, referralCode?: string) => Promise<boolean>;
  logout: () => void;
  updateBalance: (amount: number) => void;
  addSpin: () => void;
  addAdWatch: () => void;
  addCheckIn: (day: number, reward: number) => void;
  addWithdrawal: (request: Omit<WithdrawalRequest, 'id' | 'status' | 'date' | 'userName'>) => void;
  users: User[];
  updateWithdrawalStatus: (id: string, status: 'approved' | 'rejected') => void;
  toggleUserBlock: (userId: string) => void;
  allWithdrawals: WithdrawalRequest[];
  updateUserProfilePicture: (dataUrl: string) => void;
  adminUpdateUserBalance: (userId: string, amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = "AK9643270@gmail.com";
const ADMIN_PASS = "puchu143";

const generateReferralCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

const initialUsers: User[] = [
    { 
        id: '1', 
        name: 'Admin User', 
        email: ADMIN_EMAIL, 
        password: ADMIN_PASS,
        referralCode: 'ADMINREF', 
        balance: 1000, 
        spinCount: 10,
        adsWatched: 25,
        dailyCheckIn: { progress: 2, lastCheckIn: new Date(Date.now() - 86400000 * 2).toISOString() },
        totalEarnings: 1050,
        isAdmin: true,
        isBlocked: false,
        referredBy: null,
        profilePicture: ''
    },
    { 
        id: '2', 
        name: 'Test User', 
        email: 'test@example.com', 
        password: 'password',
        referralCode: 'TESTREF1', 
        balance: 50, 
        spinCount: 5,
        adsWatched: 15,
        dailyCheckIn: { progress: 1, lastCheckIn: new Date(Date.now() - 86400000).toISOString() },
        totalEarnings: 55,
        isAdmin: false,
        isBlocked: false,
        referredBy: 'ADMINREF',
        profilePicture: ''
    },
];

const initialWithdrawals: WithdrawalRequest[] = [
    { id: 'w1', userId: '2', userName: 'Test User', amount: 50, fee: 2.5, total: 47.5, upiId: 'test@upi', date: new Date().toISOString(), status: 'pending' }
]

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [allWithdrawals, setAllWithdrawals] = useState<WithdrawalRequest[]>([]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("adSpinUser");
      const storedUsers = localStorage.getItem("adSpinUsers");
      const storedWithdrawals = localStorage.getItem("adSpinWithdrawals");
      
      let currentUsers: User[];
      if (storedUsers) {
        currentUsers = JSON.parse(storedUsers);
        setUsers(currentUsers);
      } else {
        currentUsers = initialUsers;
        setUsers(initialUsers);
        localStorage.setItem("adSpinUsers", JSON.stringify(initialUsers));
      }

      if (storedWithdrawals) {
        setAllWithdrawals(JSON.parse(storedWithdrawals));
      } else {
        setAllWithdrawals(initialWithdrawals);
        localStorage.setItem("adSpinWithdrawals", JSON.stringify(initialWithdrawals));
      }
      
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        const freshUserData = currentUsers.find((u: User) => u.id === parsedUser.id);
        setUser(freshUserData || null);
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      setUser(null);
      localStorage.removeItem("adSpinUser");
      localStorage.removeItem("adSpinUsers");
      localStorage.removeItem("adSpinWithdrawals");
    } finally {
      setLoading(false);
    }
  }, []);
  
  const syncData = (updatedUser?: User | null, updatedUsers?: User[], updatedWithdrawals?: WithdrawalRequest[]) => {
      const currentUser = updatedUser === undefined ? user : updatedUser;
      const currentUsers = updatedUsers || users;
      const currentWithdrawals = updatedWithdrawals || allWithdrawals;
      
      if(currentUser) {
          localStorage.setItem("adSpinUser", JSON.stringify(currentUser));
      } else {
          localStorage.removeItem("adSpinUser");
      }
      localStorage.setItem("adSpinUsers", JSON.stringify(currentUsers));
      localStorage.setItem("adSpinWithdrawals", JSON.stringify(currentWithdrawals));
  };


  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    const foundUser = users.find(u => u.email === email && u.password === pass);

    if (foundUser) {
      if(foundUser.isBlocked) {
        toast({ title: "Login Failed", description: "Your account has been blocked.", variant: "destructive" });
        return false;
      }
      setUser(foundUser);
      syncData(foundUser, users, allWithdrawals);
      toast({ title: "Login Successful", description: `Welcome back, ${foundUser.name}!` });
      router.replace(foundUser.isAdmin ? "/admin" : "/dashboard");
      return true;
    } else {
      toast({ title: "Login Failed", description: "Invalid email or password.", variant: "destructive" });
      return false;
    }
  }, [router, toast, users, allWithdrawals]);

  const signup = useCallback(async (name: string, email: string, pass: string, referralCode?: string): Promise<boolean> => {
    let currentUsers = users;
    if (users.some(u => u.email === email)) {
      toast({ title: "Signup Failed", description: "An account with this email already exists.", variant: "destructive" });
      return false;
    }

    let newUserBalance = 0;
    let referrer: User | undefined;
    
    if (referralCode) {
      referrer = currentUsers.find(u => u.referralCode === referralCode);
      if (referrer) {
        newUserBalance = 5; // New user gets ₹5
        toast({ title: "Referral Applied!", description: "You've received a ₹5 signup bonus." });
      } else {
        toast({ title: "Invalid Referral Code", description: "The code you entered is not valid.", variant: "destructive" });
      }
    }

    const newUser: User = {
      id: String(Date.now()),
      name,
      email,
      password: pass,
      referralCode: generateReferralCode(),
      balance: newUserBalance,
      spinCount: 0,
      adsWatched: 0,
      dailyCheckIn: { progress: 0, lastCheckIn: null },
      totalEarnings: newUserBalance,
      isAdmin: false,
      isBlocked: false,
      referredBy: referrer ? referrer.id : null,
      profilePicture: ''
    };
    
    const updatedUsers = [...currentUsers];
    if(referrer) {
        const referrerIndex = updatedUsers.findIndex(u => u.id === referrer!.id);
        if(referrerIndex !== -1) {
            // This is a placeholder for a real bonus logic
            // In a real app, this might be a transaction or a server-side update
        }
    }

    updatedUsers.push(newUser);
    setUsers(updatedUsers);
    setUser(newUser);
    syncData(newUser, updatedUsers, allWithdrawals);

    toast({ title: "Account Created!", description: "Welcome to AdSpin Reward!" });
    router.replace("/dashboard");
    return true;
  }, [router, toast, users, allWithdrawals]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("adSpinUser");
    router.replace("/login");
    toast({ title: "Logged Out" });
  }, [router, toast]);

  const updateUserState = (updateFn: (currentUser: User) => User) => {
      setUser(currentUser => {
          if (!currentUser) return null;
          const updatedUser = updateFn(currentUser);
          
          setUsers(currentUsers => {
              const userIndex = currentUsers.findIndex(u => u.id === updatedUser.id);
              const newUsers = [...currentUsers];
              if (userIndex !== -1) {
                  newUsers[userIndex] = updatedUser;
              }
              syncData(updatedUser, newUsers, allWithdrawals);
              return newUsers;
          });
          
          return updatedUser;
      });
  };

  const updateBalance = useCallback((amount: number) => {
      updateUserState(u => ({
          ...u,
          balance: u.balance + amount,
          totalEarnings: u.totalEarnings + (amount > 0 ? amount : 0)
      }));
  }, []);

  const addSpin = useCallback(() => {
      updateUserState(u => ({...u, spinCount: u.spinCount + 1}));
  }, []);
  
  const addAdWatch = useCallback(() => {
      updateUserState(u => ({...u, adsWatched: u.adsWatched + 1}));
  }, []);
  
  const addCheckIn = useCallback((day: number, reward: number) => {
      updateUserState(u => ({
          ...u,
          dailyCheckIn: { progress: day, lastCheckIn: new Date().toISOString() },
      }));
      updateBalance(reward);
  }, [updateBalance]);

  const addWithdrawal = useCallback((request: Omit<WithdrawalRequest, 'id' | 'status' | 'date' | 'userName'>) => {
      if(!user) return;
      const newWithdrawal: WithdrawalRequest = {
          ...request,
          id: `w${Date.now()}`,
          status: 'pending',
          date: new Date().toISOString(),
          userName: user.name
      };
      setAllWithdrawals(current => {
          const updated = [...current, newWithdrawal];
          syncData(user, users, updated);
          return updated;
      });
      updateBalance(-request.amount);
  }, [user, users, updateBalance, allWithdrawals]);

  const updateWithdrawalStatus = (id: string, status: 'approved' | 'rejected') => {
      let withdrawal: WithdrawalRequest | undefined;
      const updatedWithdrawals = allWithdrawals.map(w => {
          if (w.id === id) {
              withdrawal = { ...w, status };
              return withdrawal;
          }
          return w;
      });

      if(withdrawal && status === 'rejected') {
          const userToRefund = users.find(u => u.id === withdrawal!.userId);
          if (userToRefund) {
              const updatedUsers = users.map(u => u.id === userToRefund.id ? { ...u, balance: u.balance + withdrawal!.amount } : u);
              setUsers(updatedUsers);
              if (user && user.id === userToRefund.id) {
                  setUser(u => ({...u!, balance: u!.balance + withdrawal!.amount}));
              }
              syncData(user, updatedUsers, updatedWithdrawals);
          }
      } else {
        syncData(user, users, updatedWithdrawals);
      }
      setAllWithdrawals(updatedWithdrawals);
  };

  const toggleUserBlock = (userId: string) => {
      const updatedUsers = users.map(u => u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u);
      setUsers(updatedUsers);
      syncData(user, updatedUsers, allWithdrawals);
  };
  
  const adminUpdateUserBalance = (userId: string, amount: number) => {
    setUsers(currentUsers => {
        const updatedUsers = currentUsers.map(u => {
            if (u.id === userId) {
                const newBalance = u.balance + amount;
                const newTotalEarnings = amount > 0 ? u.totalEarnings + amount : u.totalEarnings;
                // Update the currently logged-in user state if it's them
                if (user && user.id === userId) {
                    setUser({...u, balance: newBalance, totalEarnings: newTotalEarnings});
                }
                return { ...u, balance: newBalance, totalEarnings: newTotalEarnings };
            }
            return u;
        });
        syncData(user, updatedUsers, allWithdrawals);
        return updatedUsers;
    });
  };

  const updateUserProfilePicture = (dataUrl: string) => {
    updateUserState(u => ({...u, profilePicture: dataUrl}));
  }


  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateBalance, addSpin, addAdWatch, addCheckIn, addWithdrawal, users, updateWithdrawalStatus, toggleUserBlock, allWithdrawals, updateUserProfilePicture, adminUpdateUserBalance }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
