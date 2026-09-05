import { Compass, Home, PlusCircle, List, Inbox } from 'lucide-react';
import type { Page } from '../types';
import type { User } from '../types';

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: User | null;
  onLogout: () => void;
}

const navItems: { key: Page; label: string; icon: typeof Home }[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'report', label: 'Report', icon: PlusCircle },
  { key: 'browse', label: 'Browse', icon: List },
  { key: 'claims', label: 'Claim Requests', icon: Inbox },
];

export function Navbar({ currentPage, onNavigate, user, onLogout }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-700 text-cream-50">
            <Compass className="h-5 w-5" />
          </div>
          <span className="font-serif text-xl font-semibold text-navy-800">CampusFind</span>
        </button>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                currentPage === item.key
                  ? 'bg-navy-700 text-cream-50'
                  : 'text-navy-500 hover:bg-cream-100 hover:text-navy-700'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm font-medium text-navy-500 sm:inline">{user.name}</span>
              <button
                onClick={onLogout}
                className="rounded-lg border border-cream-300 px-3 py-1.5 text-sm font-medium text-navy-500 hover:bg-cream-100"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
