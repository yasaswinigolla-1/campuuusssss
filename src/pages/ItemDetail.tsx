import { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, ImageOff, ShieldCheck, Send, MessagesSquare, Trash2, HandHelping, Clock, Inbox } from 'lucide-react';
import type { Store } from '../store';
import type { ReportedItem } from '../types';
import { TypePill, StatusPill } from '../components/StatusPill';
import { ProgressTracker } from '../components/ProgressTracker';
import { useToast } from '../components/Toast';

interface Props {
  store: Store;
  item: ReportedItem;
  onBack: () => void;
  onOpenChat: (item: ReportedItem) => void;
  onNavigateClaims: () => void;
}

export function ItemDetail({ store, item, onBack, onOpenChat, onNavigateClaims }: Props) {
  const { show } = useToast();
  const [claimText, setClaimText] = useState('');
  const [claimantName, setClaimantName] = useState(store.currentUser?.name ?? '');
  const [submitting, setSubmitting] = useState(false);

  const current = store.items.find((i) => i.id === item.id) ?? item;
  const userName = store.currentUser?.name ?? '';
  const isOwner = current.reportedBy === userName;
  const hasClaimed = current.status !== 'open' && current.claimText !== null;
  const isApproved = current.status === 'approved';
  const isReturned = current.status === 'returned';
  const canShowFoundPhoto = current.status === 'approved' || current.status === 'returned';
  const isPending = current.status === 'pending';

  const isLost = current.type === 'lost';
  const isFound = current.type === 'found';

  // Non-owner can interact with open items
  const canClaimFound = current.status === 'open' && isFound && !isOwner;
  const canReportFound = current.status === 'open' && isLost && !isOwner;

  function handleSubmitClaim() {
    if (!claimText.trim()) return;
    setSubmitting(true);
    store.submitClaim(current.id, claimText.trim(), claimantName.trim() || 'Anonymous');
    setSubmitting(false);
    setClaimText('');
    show(isLost ? 'Thanks for stepping up! The owner will review your message.' : 'Claim submitted! The finder will review your details.', 'success');
  }

  // Progress tracker adapts to owner vs visitor and lost vs found
  const steps = [
    {
      label: 'Item reported',
      description: isOwner
        ? `You reported this item as ${isLost ? 'lost' : 'found'}: "${current.name}".`
        : `${isLost ? 'Lost' : 'Found'} report submitted for "${current.name}" by ${current.reportedBy}.`,
      state: 'done' as const,
    },
    {
      label: hasClaimed
        ? (isLost ? (isOwner ? 'Someone reached out' : 'You reached out') : (isOwner ? 'Someone submitted a claim' : 'Claim details submitted'))
        : (isLost ? (isOwner ? 'Waiting for someone to find it' : 'Waiting for you to reach out') : (isOwner ? 'Waiting for someone to claim it' : 'Waiting for your claim details')),
      description: hasClaimed
        ? isLost
          ? isOwner
            ? `${current.claimantName} says they found your item. Review their message on your Claim Requests page.`
            : 'Your message has been sent to the owner. They will review it and respond.'
          : isOwner
            ? `Claim by ${current.claimantName} is under review. Check your Claim Requests page.`
            : `Claim by ${current.claimantName} is under review by the finder.`
        : isLost
          ? isOwner
            ? 'If someone spots your item, they can message you here.'
            : 'Describe where you saw it and any confirming details.'
          : isOwner
            ? 'When someone recognizes their item, they will submit a claim here.'
            : 'Describe a detail only the real owner would know.',
      state: hasClaimed ? ('done' as const) : ('current' as const),
    },
    {
      label: isApproved || isReturned
        ? (isOwner ? (isLost ? 'You approved the finder' : 'You approved the claim') : (isLost ? 'Owner approved you' : 'Finder approved your claim'))
        : (isOwner ? (isLost ? 'You review and approve' : 'You review and approve') : (isLost ? 'Owner reviews and approves' : 'Finder reviews and approves')),
      description: isApproved
        ? isOwner
          ? 'You verified the other person. Chat to arrange the handover.'
          : 'You were approved! Chat to arrange the handover.'
        : isReturned
          ? isOwner
            ? 'You verified the other person and the item was returned.'
            : 'Your request was approved and the item was returned.'
          : isOwner
            ? isLost
              ? 'Check their message and approve if it seems genuine.'
              : 'Compare their claim against your private detail and approve if it matches.'
            : isLost
              ? 'The owner will review your message and decide.'
              : 'The finder will compare your claim against their private detail.',
      state: isApproved || isReturned ? ('done' as const) : hasClaimed ? ('current' as const) : ('upcoming' as const),
    },
    {
      label: 'Chat and collect',
      description: isReturned
        ? 'Item has been returned. All done!'
        : isApproved
          ? 'Chat to decide where and how to hand over the item.'
          : 'Once approved, you can chat to arrange the handover.',
      state: isReturned ? ('done' as const) : isApproved ? ('current' as const) : ('upcoming' as const),
    },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-navy-400 hover:text-navy-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to browse
      </button>

      <div className="rounded-xl border border-cream-200 bg-white p-6">
        {/* Header */}
        <div className="mb-5 flex items-center gap-2">
          <TypePill type={current.type} />
          <StatusPill status={current.status} />
          {isOwner && (
            <span className="inline-flex items-center rounded-full bg-navy-100 px-2.5 py-0.5 text-xs font-semibold text-navy-600">
              Your report
            </span>
          )}
        </div>

        <h1 className="font-serif text-2xl font-semibold text-navy-800">{current.name}</h1>

        {/* Photo */}
        <div className="mt-5">
          {isFound && !canShowFoundPhoto ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-cream-200 bg-cream-100">
              <ImageOff className="mb-2 h-8 w-8 text-cream-300" />
              <p className="text-xs font-medium text-navy-400">
                Photo hidden until claim is approved
              </p>
            </div>
          ) : current.photo ? (
            <img src={current.photo} alt={current.name} className="h-48 w-full rounded-lg border border-cream-200 object-cover" />
          ) : (
            <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-cream-200 bg-cream-100">
              <ImageOff className="mb-2 h-8 w-8 text-cream-300" />
              <p className="text-xs text-navy-400">No photo provided</p>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cream-100 text-navy-400">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-navy-400">Location</p>
              <p className="text-sm font-medium text-navy-700">{current.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cream-100 text-navy-400">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-navy-400">Date</p>
              <p className="text-sm font-medium text-navy-700">
                {new Date(current.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* ===== OWNER VIEW ===== */}

        {/* Owner — open, waiting */}
        {isOwner && current.status === 'open' && (
          <div className="mt-6 rounded-lg border border-cream-200 bg-cream-50 px-4 py-4">
            <div className="mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-navy-400" />
              <p className="text-sm font-medium text-navy-500">
                {isLost ? 'Waiting for someone to find your item' : 'Waiting for someone to claim this item'}
              </p>
            </div>
            <p className="text-xs text-navy-400">
              {isLost
                ? 'When someone spots your item, they can send you a message. You will review it on your Claim Requests page.'
                : 'When the real owner sees this, they will submit a claim with a verifying detail. You will review it on your Claim Requests page.'}
            </p>
          </div>
        )}

        {/* Owner — pending, someone reached out */}
        {isOwner && isPending && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-4">
            <div className="mb-2 flex items-center gap-2">
              <Inbox className="h-4 w-4 text-amber-600" />
              <p className="text-sm font-medium text-amber-700">
                {isLost ? `${current.claimantName} says they found your item!` : `${current.claimantName} submitted a claim!`}
              </p>
            </div>
            <p className="mb-3 text-xs text-amber-600">
              {isLost
                ? 'Review their message and approve to start chatting about the handover.'
                : 'Compare their claim against your private detail and approve if it matches.'}
            </p>
            <button
              onClick={onNavigateClaims}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
            >
              <Inbox className="h-4 w-4" />
              Go to Claim Requests
            </button>
          </div>
        )}

        {/* Owner — approved, ready to chat */}
        {isOwner && isApproved && (
          <div className="mt-6 rounded-lg border border-sage-200 bg-sage-50/50 px-4 py-4">
            <p className="mb-3 text-sm font-medium text-sage-700">
              {isLost ? 'You approved the finder! Chat to arrange the handover.' : 'You approved the claim! Chat to arrange the handover.'}
            </p>
            <button
              onClick={() => onOpenChat(current)}
              className="inline-flex items-center gap-2 rounded-lg bg-navy-700 px-4 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-navy-800"
            >
              <MessagesSquare className="h-4 w-4" />
              Open chat
            </button>
          </div>
        )}

        {/* Owner — returned */}
        {isOwner && isReturned && (
          <div className="mt-6 rounded-lg border border-sage-200 bg-sage-50/50 px-4 py-4">
            <p className="mb-3 text-sm font-medium text-sage-700">
              This item has been returned to its owner.
            </p>
            <button
              onClick={() => { store.deleteItem(current.id); onBack(); }}
              className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete this report
            </button>
          </div>
        )}

        {/* ===== VISITOR VIEW (non-owner) ===== */}

        {/* Visitor — claim form for FOUND items */}
        {canClaimFound && (
          <div className="mt-6 border-t border-cream-100 pt-5">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-600" />
              <h2 className="font-serif text-lg font-semibold text-navy-800">Claim this item</h2>
            </div>
            <p className="mb-4 text-sm text-navy-400">
              Describe one detail only the real owner would know. The finder will compare your answer
              against the private detail they recorded when reporting the item.
            </p>
            <textarea
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              rows={4}
              placeholder="e.g. The wallet has a Blue Bottle Coffee loyalty card with 7 stamps inside, and my student ID says Jordan Park."
              className="w-full rounded-lg border border-cream-300 bg-cream-50 px-3.5 py-2.5 text-sm text-navy-700 placeholder:text-navy-300 focus:border-navy-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-200"
            />
            <button
              onClick={handleSubmitClaim}
              disabled={submitting || !claimText.trim()}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {submitting ? 'Submitting...' : 'Submit claim'}
            </button>
          </div>
        )}

        {/* Visitor — "I found this" form for LOST items */}
        {canReportFound && (
          <div className="mt-6 border-t border-cream-100 pt-5">
            <div className="mb-3 flex items-center gap-2">
              <HandHelping className="h-5 w-5 text-sage-500" />
              <h2 className="font-serif text-lg font-semibold text-navy-800">I found this item</h2>
            </div>
            <p className="mb-4 text-sm text-navy-400">
              Think you've spotted this item? Send a message to the person who lost it. Describe where
              you saw it and any details that confirm it's the same item. No need to post a separate
              found report — you can arrange the return right here.
            </p>
            <textarea
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              rows={4}
              placeholder="e.g. I saw a blue Hydro Flask on the 2nd floor of the library near the study rooms. It has a sticker on the bottom that says 'Maya's Hydration Station'."
              className="w-full rounded-lg border border-cream-300 bg-cream-50 px-3.5 py-2.5 text-sm text-navy-700 placeholder:text-navy-300 focus:border-navy-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-200"
            />
            <button
              onClick={handleSubmitClaim}
              disabled={submitting || !claimText.trim()}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {submitting ? 'Sending...' : 'Send message to owner'}
            </button>
          </div>
        )}

        {/* Visitor — waiting for review */}
        {!isOwner && hasClaimed && isPending && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-3">
            <p className="text-sm font-medium text-amber-700">
              {isLost
                ? 'Your message has been sent to the owner. They will review it and respond.'
                : 'Your claim is being reviewed by the finder. You\'ll be notified once it\'s approved.'}
            </p>
          </div>
        )}

        {/* Visitor — approved, chat button */}
        {!isOwner && isApproved && (
          <div className="mt-6 rounded-lg border border-sage-200 bg-sage-50/50 px-4 py-4">
            <p className="mb-3 text-sm font-medium text-sage-700">
              {isLost ? 'The owner approved you! Chat to arrange the handover.' : 'Your claim was approved! Chat with the finder to arrange the handover.'}
            </p>
            <button
              onClick={() => onOpenChat(current)}
              className="inline-flex items-center gap-2 rounded-lg bg-navy-700 px-4 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-navy-800"
            >
              <MessagesSquare className="h-4 w-4" />
              Open chat
            </button>
          </div>
        )}

        {/* Visitor — returned */}
        {!isOwner && isReturned && (
          <div className="mt-6 rounded-lg border border-sage-200 bg-sage-50/50 px-4 py-3">
            <p className="text-sm font-medium text-sage-700">
              This item has been returned to its owner.
            </p>
          </div>
        )}

        {/* Visitor — pending item claimed by someone else */}
        {!isOwner && isPending && !hasClaimed && (
          <div className="mt-6 rounded-lg border border-cream-200 bg-cream-50 px-4 py-3">
            <p className="text-sm text-navy-400">
              Someone is already in contact about this item. Check back later.
            </p>
          </div>
        )}
      </div>

      {/* Progress tracker */}
      <div className="mt-6 rounded-xl border border-cream-200 bg-white p-6">
        <h2 className="mb-4 font-serif text-lg font-semibold text-navy-800">Progress</h2>
        <ProgressTracker steps={steps} />
      </div>
    </div>
  );
}
