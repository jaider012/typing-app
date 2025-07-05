export interface User {
  uid: string;
  email: string;
  displayName?: string;
  avatar?: string;
  createdAt: string;
  lastSignIn?: string;
}

export interface UserStats {
  totalTests: number;
  bestWpm: number;
  bestAccuracy: number;
  bestScore: number;
  averageWpm: number;
  averageAccuracy: number;
  updatedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  uid: string;
  displayName: string;
  email: string;
  wpm?: number;
  accuracy?: number;
  score?: number;
  totalTests: number;
}