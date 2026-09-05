export type ItemType = 'lost' | 'found';
export type ItemStatus = 'open' | 'pending' | 'approved' | 'returned';
export type MatchQuality = 'good' | 'unsure' | 'none';

export interface ReportedItem {
  id: string;
  type: ItemType;
  name: string;
  location: string;
  date: string;
  photo: string | null;
  privateDetail: string | null;
  status: ItemStatus;
  claimText: string | null;
  claimantName: string | null;
  matchQuality: MatchQuality | null;
  reportedBy: string;
  createdAt: number;
}

export interface User {
  email: string;
  name: string;
  password: string;
}

export interface ChatMessage {
  id: string;
  itemId: string;
  sender: string;
  text: string;
  createdAt: number;
}

export type Page = 'login' | 'home' | 'report' | 'browse' | 'detail' | 'claims' | 'chat';
