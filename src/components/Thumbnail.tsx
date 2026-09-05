import { ImageOff } from 'lucide-react';
import type { ReportedItem } from '../types';

export function Thumbnail({ item, size = 'md' }: { item: ReportedItem; size?: 'sm' | 'md' }) {
  const dims = size === 'sm' ? 'h-12 w-12' : 'h-16 w-16';

  // Found items show blurred/placeholder
  if (item.type === 'found') {
    return (
      <div
        className={`${dims} shrink-0 overflow-hidden rounded-lg border border-cream-200 bg-cream-100`}
        title="Photo hidden until claim is verified"
      >
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-cream-100 to-cream-200">
          <ImageOff className="h-4 w-4 text-cream-300" />
        </div>
      </div>
    );
  }

  // Lost items show photo if available
  if (item.photo) {
    return (
      <img
        src={item.photo}
        alt={item.name}
        className={`${dims} shrink-0 rounded-lg border border-cream-200 object-cover`}
      />
    );
  }

  return (
    <div className={`${dims} shrink-0 rounded-lg border border-cream-200 bg-cream-100`}>
      <div className="flex h-full w-full items-center justify-center">
        <ImageOff className="h-4 w-4 text-cream-300" />
      </div>
    </div>
  );
}
