import { Inbox, Check, X, MessageSquare, ShieldCheck, User as UserIcon, MessagesSquare } from 'lucide-react';
import type { Store } from '../store';
import type { MatchQuality, ReportedItem } from '../types';
import { TypePill, MatchPill } from '../components/StatusPill';
import { useToast } from '../components/Toast';

interface Props {
  store: Store;
  onOpenChat: (item: ReportedItem) => void;
}

export function ClaimRequests({ store, onOpenChat }: Props) {
  const { show } = useToast();

  const pendingItems = store.items.filter(
    (i) => i.status === 'pending' && i.reportedBy === store.currentUser?.name,
  );

  const approvedItems = store.items.filter(
    (i) => i.status === 'approved' && i.reportedBy === store.currentUser?.name,
  );

  function handleApprove(itemId: string, isLost: boolean) {
    store.approveClaim(itemId);
    show(isLost ? 'Approved — chat with the finder to arrange the handover' : 'Claim approved — chat with the owner to arrange the handover', 'success');
  }

  function handleReject(itemId: string, isLost: boolean) {
    store.rejectClaim(itemId);
    show(isLost ? 'Rejected — your item is back open for new messages' : 'Claim rejected — item is back open for claims', 'info');
  }

  function handleMatchChange(itemId: string, quality: MatchQuality) {
    store.setMatchQuality(itemId, quality);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <div className="mb-1 flex items-center gap-2">
          <Inbox className="h-5 w-5 text-navy-600" />
          <h1 className="font-serif text-2xl font-semibold text-navy-800">Claim requests</h1>
        </div>
        <p className="text-sm text-navy-400">
          Review messages from people who say they found your lost items, or claims from people who
          say they own items you found. Approve to start chatting and arrange the handover.
        </p>
      </div>

      {pendingItems.length === 0 && approvedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-cream-300 bg-cream-50 py-16 text-center">
          <Inbox className="mb-3 h-10 w-10 text-cream-300" />
          <p className="text-sm font-medium text-navy-500">No requests right now</p>
          <p className="mt-1 text-xs text-navy-400">
            When someone reaches out about an item you reported, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending requests */}
          {pendingItems.length > 0 && (
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-navy-400">
                Pending review ({pendingItems.length})
              </h2>
              <div className="space-y-4">
                {pendingItems.map((item) => {
                  const isLost = item.type === 'lost';
                  return (
                    <div key={item.id} className="rounded-xl border border-cream-200 bg-white p-5">
                      {/* Header */}
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <div className="mb-1.5 flex items-center gap-2">
                            <h3 className="font-serif text-lg font-semibold text-navy-800">{item.name}</h3>
                            <TypePill type={item.type} />
                          </div>
                          <p className="text-xs text-navy-400">
                            {item.location} · {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <MatchPill quality={item.matchQuality ?? 'unsure'} />
                      </div>

                      {/* Claimant info */}
                      <div className="mb-4 space-y-3 rounded-lg border border-cream-100 bg-cream-50 p-4">
                        <div className="flex items-start gap-2">
                          <UserIcon className="mt-0.5 h-4 w-4 shrink-0 text-navy-400" />
                          <div>
                            <span className="text-xs font-medium text-navy-400">
                              {isLost ? 'Who found it' : 'Claimant'}
                            </span>
                            <p className="text-sm font-medium text-navy-700">{item.claimantName ?? 'Unknown'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-navy-400" />
                          <div>
                            <span className="text-xs font-medium text-navy-400">
                              {isLost ? 'Their message' : 'Claim details'}
                            </span>
                            <p className="mt-0.5 text-sm text-navy-600">{item.claimText ?? 'No details provided.'}</p>
                          </div>
                        </div>
                        {item.privateDetail && !isLost && (
                          <div className="flex items-start gap-2 border-t border-cream-200 pt-3">
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                            <div>
                              <span className="text-xs font-medium text-amber-600">
                                Your private detail (only visible to you)
                              </span>
                              <p className="mt-0.5 text-sm text-navy-600">{item.privateDetail}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Match quality selector */}
                      <div className="mb-4">
                        <p className="mb-2 text-xs font-medium text-navy-500">
                          {isLost ? 'Does this seem like a genuine find?' : 'How well does the claim match your item?'}
                        </p>
                        <div className="flex gap-2">
                          {([
                            { key: 'good', label: isLost ? 'Looks genuine' : 'Good match' },
                            { key: 'unsure', label: 'Unsure' },
                            { key: 'none', label: isLost ? 'Not convinced' : 'No match' },
                          ] as const).map((opt) => (
                            <button
                              key={opt.key}
                              onClick={() => handleMatchChange(item.id, opt.key)}
                              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                                item.matchQuality === opt.key
                                  ? opt.key === 'good'
                                    ? 'border-sage-300 bg-sage-100 text-sage-700'
                                    : opt.key === 'unsure'
                                      ? 'border-amber-300 bg-amber-100 text-amber-700'
                                      : 'border-rose-300 bg-rose-100 text-rose-700'
                                  : 'border-cream-300 text-navy-400 hover:bg-cream-50'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(item.id, isLost)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-sage-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sage-600"
                        >
                          <Check className="h-4 w-4" />
                          {isLost ? 'Approve & chat' : 'Approve claim'}
                        </button>
                        <button
                          onClick={() => handleReject(item.id, isLost)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Approved — ready to chat */}
          {approvedItems.length > 0 && (
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-navy-400">
                Approved — arrange handover ({approvedItems.length})
              </h2>
              <div className="space-y-4">
                {approvedItems.map((item) => {
                  const isLost = item.type === 'lost';
                  return (
                    <div key={item.id} className="rounded-xl border border-sage-200 bg-sage-50/30 p-5">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <div className="mb-1.5 flex items-center gap-2">
                            <h3 className="font-serif text-lg font-semibold text-navy-800">{item.name}</h3>
                            <TypePill type={item.type} />
                          </div>
                          <p className="text-xs text-navy-400">
                            {isLost ? 'Finder' : 'Claimant'}: <span className="font-medium text-navy-500">{item.claimantName}</span>
                          </p>
                        </div>
                        <MatchPill quality={item.matchQuality ?? 'unsure'} />
                      </div>
                      <button
                        onClick={() => onOpenChat(item)}
                        className="inline-flex items-center gap-2 rounded-lg bg-navy-700 px-4 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-navy-800"
                      >
                        <MessagesSquare className="h-4 w-4" />
                        Open chat
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
