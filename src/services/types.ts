export interface CreateTestDto {
  wpm: number;
  accuracy: number;
  score: number;
  wordsTyped: number;
  timeSpent: number;
  mistakes: number;
  text: string;
}

export interface TestResult {
  id: string;
  uid: string;
  wpm: number;
  accuracy: number;
  score: number;
  wordsTyped: number;
  timeSpent: number;
  mistakes: number;
  text: string;
  createdAt: string;
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

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface LeaderboardEntry {
  uid: string;
  displayName?: string;
  photoURL?: string;
  value: number;
  rank: number;
  wpm?: number;
  accuracy?: number;
  score?: number;
}


