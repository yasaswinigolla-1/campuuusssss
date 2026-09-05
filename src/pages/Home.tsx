import { PackageX, HandHelping, Search as SearchIcon, ArrowRight } from 'lucide-react';
import type { Page } from '../types';

interface Props {
  onNavigate: (page: Page) => void;
  userName: string;
}

export function Home({ onNavigate, userName }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Greeting */}
      <div className="mb-10 text-center">
        <p className="text-sm font-medium text-navy-400">Welcome back, {userName}</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-navy-800 sm:text-4xl">
          What happened today?
        </h1>
        <p className="mt-3 text-base text-navy-400">
          Report a lost item, something you found, or search through existing reports.
        </p>
      </div>

      {/* Choice cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => onNavigate('report')}
          className="group flex flex-col items-start rounded-xl border border-cream-200 bg-white p-6 text-left transition-all hover:border-rose-200 hover:bg-rose-50/30"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
            <PackageX className="h-6 w-6" />
          </div>
          <h2 className="font-serif text-xl font-semibold text-navy-800">I lost something</h2>
          <p className="mt-1.5 text-sm text-navy-400">
            Report what you lost so others can help you find it.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-rose-500 group-hover:text-rose-600">
            Report a lost item <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </button>

        <button
          onClick={() => onNavigate('report')}
          className="group flex flex-col items-start rounded-xl border border-cream-200 bg-white p-6 text-left transition-all hover:border-sage-200 hover:bg-sage-50/30"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-sage-50 text-sage-500">
            <HandHelping className="h-6 w-6" />
          </div>
          <h2 className="font-serif text-xl font-semibold text-navy-800">I found something</h2>
          <p className="mt-1.5 text-sm text-navy-400">
            Report an item you found so its owner can claim it.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-sage-500 group-hover:text-sage-600">
            Report a found item <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </button>
      </div>

      {/* Search button */}
      <button
        onClick={() => onNavigate('browse')}
        className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-navy-200 bg-navy-50 p-4 transition-all hover:border-navy-300 hover:bg-navy-100"
      >
        <SearchIcon className="h-5 w-5 text-navy-500" />
        <span className="text-sm font-semibold text-navy-600">Search existing items</span>
        <ArrowRight className="h-4 w-4 text-navy-400 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
