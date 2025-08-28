export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Should not be sent to client in a real app
  referralCode: string;
  balance: number;
  totalEarnings: number;
  spinCount: number;
  adsWatched: number;
  dailyCheckIn: {
    progress: number;
    lastCheckIn: string | null;
  };
  isAdmin: boolean;
  isBlocked: boolean;
  referredBy: string | null;
  profilePicture?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  fee: number;
  total: number;
  upiId: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}
