import type { ItemType, ItemStatus, MatchQuality } from '../types';

export function TypePill({ type }: { type: ItemType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        type === 'lost'
          ? 'bg-rose-100 text-rose-700'
          : 'bg-sage-100 text-sage-700'
      }`}
    >
      {type === 'lost' ? 'Lost' : 'Found'}
    </span>
  );
}

export function StatusPill({ status }: { status: ItemStatus }) {
  const styles: Record<ItemStatus, string> = {
    open: 'bg-navy-50 text-navy-500',
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-sage-100 text-sage-700',
    returned: 'bg-sage-200 text-sage-700',
  };
  const labels: Record<ItemStatus, string> = {
    open: 'Open',
    pending: 'Pending',
    approved: 'Approved',
    returned: 'Returned',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export function MatchPill({ quality }: { quality: MatchQuality }) {
  const styles: Record<MatchQuality, string> = {
    good: 'bg-sage-100 text-sage-700',
    unsure: 'bg-amber-100 text-amber-700',
    none: 'bg-rose-100 text-rose-700',
  };
  const labels: Record<MatchQuality, string> = {
    good: 'Good match',
    unsure: 'Unsure',
    none: 'No match',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[quality]}`}>
      {labels[quality]}
    </span>
  );
}
