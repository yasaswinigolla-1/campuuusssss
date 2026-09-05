import { useState, type FormEvent } from 'react';
import { Upload, X, ImageOff, ShieldCheck, AlertCircle } from 'lucide-react';
import type { Store } from '../store';
import type { ItemType } from '../types';
import { useToast } from '../components/Toast';

interface Props {
  store: Store;
  onDone: () => void;
}

export function Report({ store, onDone }: Props) {
  const { show } = useToast();
  const [type, setType] = useState<ItemType>('lost');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [privateDetail, setPrivateDetail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handlePhotoUpload(file: File) {
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Please enter the item name.'); return; }
    if (!location.trim()) { setError('Please enter where it was lost or found.'); return; }
    if (!date) { setError('Please select a date.'); return; }
    if (type === 'found' && !privateDetail.trim()) {
      setError('Please provide a private identifying detail for verification.');
      return;
    }

    setLoading(true);
    store.addItem({
      type,
      name: name.trim(),
      location: location.trim(),
      date,
      photo,
      privateDetail: type === 'found' ? privateDetail.trim() : null,
      reportedBy: store.currentUser?.name ?? 'Anonymous',
    });
    setLoading(false);
    show(type === 'lost' ? 'Lost item reported successfully!' : 'Found item reported successfully!', 'success');
    onDone();
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <h1 className="mb-1 font-serif text-2xl font-semibold text-navy-800">Report an item</h1>
      <p className="mb-6 text-sm text-navy-400">Tell us what you lost or found on campus.</p>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-cream-200 bg-white p-6">
        {/* Type selector */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-600">What happened?</label>
          <div className="flex rounded-lg bg-cream-100 p-1">
            <button
              type="button"
              onClick={() => setType('lost')}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                type === 'lost' ? 'bg-white text-rose-600 shadow-sm' : 'text-navy-400'
              }`}
            >
              I lost something
            </button>
            <button
              type="button"
              onClick={() => setType('found')}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                type === 'found' ? 'bg-white text-sage-600 shadow-sm' : 'text-navy-400'
              }`}
            >
              I found something
            </button>
          </div>
        </div>

        {/* Item name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-600">Item name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Blue Hydro Flask"
            className="w-full rounded-lg border border-cream-300 bg-cream-50 px-3.5 py-2.5 text-sm text-navy-700 placeholder:text-navy-300 focus:border-navy-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-200"
          />
        </div>

        {/* Location */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-600">
            {type === 'lost' ? 'Where did you lose it?' : 'Where did you find it?'}
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Library, 2nd floor"
            className="w-full rounded-lg border border-cream-300 bg-cream-50 px-3.5 py-2.5 text-sm text-navy-700 placeholder:text-navy-300 focus:border-navy-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-200"
          />
        </div>

        {/* Date */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-600">
            {type === 'lost' ? 'When did you lose it?' : 'When did you find it?'}
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-cream-300 bg-cream-50 px-3.5 py-2.5 text-sm text-navy-700 focus:border-navy-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-200"
          />
        </div>

        {/* Photo upload */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-600">Photo</label>
          {photo ? (
            <div className="relative overflow-hidden rounded-lg border border-cream-200">
              <img src={photo} alt="Uploaded" className="h-40 w-full object-cover" />
              <button
                type="button"
                onClick={() => setPhoto(null)}
                className="absolute right-2 top-2 rounded-lg bg-white/90 p-1.5 text-navy-500 hover:text-rose-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-cream-300 bg-cream-50 text-navy-400 transition-colors hover:border-navy-300 hover:bg-navy-50/30">
              {type === 'found' ? (
                <>
                  <ImageOff className="h-6 w-6" />
                  <span className="text-xs">Photo will be hidden from public view</span>
                  <span className="text-xs font-medium text-navy-500">Click to upload</span>
                </>
              ) : (
                <>
                  <Upload className="h-6 w-6" />
                  <span className="text-xs">Click to upload a photo</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePhotoUpload(file);
                }}
              />
            </label>
          )}
        </div>

        {/* Private detail (found only) */}
        {type === 'found' && (
          <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-600" />
              <label className="text-sm font-semibold text-navy-700">Private identifying detail</label>
            </div>
            <p className="mb-2.5 text-xs text-navy-400">
              This is used later to verify the real owner. It is never shown publicly — only staff
              will see it when reviewing a claim.
            </p>
            <textarea
              value={privateDetail}
              onChange={(e) => setPrivateDetail(e.target.value)}
              rows={3}
              placeholder="e.g. Contains a student ID for 'Jordan Park' and a loyalty card for Blue Bottle Coffee."
              className="w-full rounded-lg border border-amber-200 bg-white px-3.5 py-2.5 text-sm text-navy-700 placeholder:text-navy-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit report'}
        </button>
      </form>
    </div>
  );
}
