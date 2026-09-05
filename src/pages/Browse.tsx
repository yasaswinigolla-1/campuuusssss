import { useState, useMemo } from 'react';
import { Search as SearchIcon, ChevronRight, Inbox } from 'lucide-react';
import type { Store } from '../store';
import type { ReportedItem } from '../types';
import { Thumbnail } from '../components/Thumbnail';
import { TypePill, StatusPill } from '../components/StatusPill';

interface Props {
  store: Store;
  onSelectItem: (item: ReportedItem) => void;
}

export function Browse({ store, onSelectItem }: Props) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');

  const filtered = useMemo(() => {
    return store.items
      .filter((item) => {
        const matchFilter = filter === 'all' || item.type === filter;
        const matchQuery =
          !query ||
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.location.toLowerCase().includes(query.toLowerCase());
        return matchFilter && matchQuery;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [store.items, query, filter]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="mb-1 font-serif text-2xl font-semibold text-navy-800">Browse items</h1>
      <p className="mb-6 text-sm text-navy-400">Search through all reported lost and found items.</p>

      {/* Search bar */}
      <div className="relative mb-4">
        <SearchIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by item name or location..."
          className="w-full rounded-lg border border-cream-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-navy-700 placeholder:text-navy-300 focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-200"
        />
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex gap-1">
        {([
          { key: 'all', label: 'All' },
          { key: 'lost', label: 'Lost' },
          { key: 'found', label: 'Found' },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-navy-700 text-cream-50'
                : 'text-navy-400 hover:bg-cream-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-cream-300 bg-cream-50 py-16 text-center">
          <Inbox className="mb-3 h-10 w-10 text-cream-300" />
          <p className="text-sm font-medium text-navy-500">No items found</p>
          <p className="mt-1 text-xs text-navy-400">Try a different search or filter.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-cream-200 bg-white">
          {filtered.map((item, i) => (
            <button
              key={item.id}
              onClick={() => onSelectItem(item)}
              className={`flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-cream-50 ${
                i > 0 ? 'border-t border-cream-100' : ''
              }`}
            >
              <Thumbnail item={item} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-navy-700">{item.name}</h3>
                  <TypePill type={item.type} />
                </div>
                <p className="mt-0.5 truncate text-xs text-navy-400">
                  {item.location} · {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <StatusPill status={item.status} />
                <ChevronRight className="h-4 w-4 text-navy-300" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
