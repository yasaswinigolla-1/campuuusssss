import { useState, useCallback } from 'react';
import type { ReportedItem, User, ItemStatus, MatchQuality, ChatMessage } from './types';

let itemCounter = 0;
function genId() {
  itemCounter += 1;
  return `item-${Date.now()}-${itemCounter}`;
}

let msgCounter = 0;
function genMsgId() {
  msgCounter += 1;
  return `msg-${Date.now()}-${msgCounter}`;
}

const seedItems: ReportedItem[] = [
  {
    id: genId(),
    type: 'lost',
    name: 'Blue Hydro Flask',
    location: 'Library, 2nd floor',
    date: '2026-08-28',
    photo: null,
    privateDetail: null,
    status: 'pending',
    claimText: 'I spotted this bottle in the library near the study rooms. It has a sticker that says "Maya\'s Hydration Station" on the bottom.',
    claimantName: 'Taylor Brooks',
    matchQuality: 'good',
    reportedBy: 'Maya Chen',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: genId(),
    type: 'found',
    name: 'Black leather wallet',
    location: 'Cafeteria, table 4',
    date: '2026-08-30',
    photo: null,
    privateDetail: 'Contains a student ID for "Jordan Park" and a loyalty card for Blue Bottle Coffee.',
    status: 'pending',
    claimText: 'I lost it at the cafeteria on Friday. It has my student ID inside — Jordan Park, and a Blue Bottle Coffee punch card with 7 stamps.',
    claimantName: 'Jordan Park',
    matchQuality: 'good',
    reportedBy: 'Demo User',
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: genId(),
    type: 'found',
    name: 'AirPods case (2nd gen)',
    location: 'Gym locker room',
    date: '2026-09-01',
    photo: null,
    privateDetail: 'Left AirPod has a small scratch on the stem. Engraving on the back says "Keep going."',
    status: 'open',
    claimText: null,
    claimantName: null,
    matchQuality: null,
    reportedBy: 'Alex Kim',
    createdAt: Date.now() - 86400000 * 1,
  },
  {
    id: genId(),
    type: 'lost',
    name: 'Organic Chemistry textbook',
    location: 'Science Building, Room 204',
    date: '2026-08-25',
    photo: null,
    privateDetail: null,
    status: 'open',
    claimText: null,
    claimantName: null,
    matchQuality: null,
    reportedBy: 'Priya Sharma',
    createdAt: Date.now() - 86400000 * 8,
  },
  {
    id: genId(),
    type: 'found',
    name: 'Student ID card',
    location: 'Bus stop, Main Gate',
    date: '2026-09-02',
    photo: null,
    privateDetail: 'Name on card: "Taylor Brooks". Student ID number ends in 4729.',
    status: 'open',
    claimText: null,
    claimantName: null,
    matchQuality: null,
    reportedBy: 'Chris Lee',
    createdAt: Date.now() - 3600000 * 5,
  },
  {
    id: genId(),
    type: 'lost',
    name: 'Gray Jansport backpack',
    location: 'Quad, near the fountain',
    date: '2026-09-01',
    photo: null,
    privateDetail: null,
    status: 'returned',
    claimText: 'It has a small pin of a sunflower on the front pocket. My laptop is inside with a sticker that says "Hello World."',
    claimantName: 'Jamie Wong',
    matchQuality: 'good',
    reportedBy: 'Sam Rivera',
    createdAt: Date.now() - 86400000 * 2,
  },
];

const seedMessages: ChatMessage[] = [
  {
    id: genMsgId(),
    itemId: seedItems[5].id,
    sender: 'Sam Rivera',
    text: 'Hi Jamie! I found your backpack near the fountain. When would be a good time to meet?',
    createdAt: Date.now() - 86400000 * 2 + 3600000,
  },
  {
    id: genMsgId(),
    itemId: seedItems[5].id,
    sender: 'Jamie Wong',
    text: 'Oh thank you so much! I have class until 3pm today. Can we meet at the quad around 3:15?',
    createdAt: Date.now() - 86400000 * 2 + 7200000,
  },
  {
    id: genMsgId(),
    itemId: seedItems[5].id,
    sender: 'Sam Rivera',
    text: 'Perfect, I\'ll be there at 3:15. I\'ll be wearing a blue jacket.',
    createdAt: Date.now() - 86400000 * 2 + 10800000,
  },
];

export function useStore() {
  const [items, setItems] = useState<ReportedItem[]>(seedItems);
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);
  const [users, setUsers] = useState<User[]>([
    { email: 'demo@campus.edu', name: 'Demo User', password: 'demo123' },
  ]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const register = useCallback((email: string, name: string, password: string): string | null => {
    if (users.some((u) => u.email === email)) {
      return 'An account with this email already exists.';
    }
    const newUser: User = { email, name, password };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return null;
  }, [users]);

  const login = useCallback((email: string, password: string): string | null => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return 'Invalid email or password.';
    setCurrentUser(user);
    return null;
  }, [users]);

  const logout = useCallback(() => setCurrentUser(null), []);

  const addItem = useCallback((item: Omit<ReportedItem, 'id' | 'createdAt' | 'status' | 'claimText' | 'claimantName' | 'matchQuality'>) => {
    const newItem: ReportedItem = {
      ...item,
      id: genId(),
      createdAt: Date.now(),
      status: 'open',
      claimText: null,
      claimantName: null,
      matchQuality: null,
    };
    setItems((prev) => [newItem, ...prev]);
    return newItem;
  }, []);

  const submitClaim = useCallback((itemId: string, claimText: string, claimantName: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, status: 'pending' as ItemStatus, claimText, claimantName, matchQuality: 'unsure' as MatchQuality }
          : item,
      ),
    );
  }, []);

  const approveClaim = useCallback((itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, status: 'approved' as ItemStatus } : item,
      ),
    );
  }, []);

  const rejectClaim = useCallback((itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, status: 'open' as ItemStatus, claimText: null, claimantName: null, matchQuality: null }
          : item,
      ),
    );
  }, []);

  const markReturned = useCallback((itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, status: 'returned' as ItemStatus } : item,
      ),
    );
  }, []);

  const setMatchQuality = useCallback((itemId: string, quality: MatchQuality) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, matchQuality: quality } : item)),
    );
  }, []);

  const sendMessage = useCallback((itemId: string, sender: string, text: string) => {
    const msg: ChatMessage = {
      id: genMsgId(),
      itemId,
      sender,
      text,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
  }, []);

  const deleteItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    setMessages((prev) => prev.filter((msg) => msg.itemId !== itemId));
  }, []);

  return {
    items,
    messages,
    currentUser,
    register,
    login,
    logout,
    addItem,
    submitClaim,
    approveClaim,
    rejectClaim,
    markReturned,
    setMatchQuality,
    sendMessage,
    deleteItem,
  };
}

export type Store = ReturnType<typeof useStore>;
