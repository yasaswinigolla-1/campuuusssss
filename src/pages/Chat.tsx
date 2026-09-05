import { useState, useRef, useEffect, type FormEvent } from 'react';
import { ArrowLeft, Send, MapPin, Calendar, Check, Trash2 } from 'lucide-react';
import type { Store } from '../store';
import type { ReportedItem } from '../types';
import { TypePill } from '../components/StatusPill';
import { useToast } from '../components/Toast';

interface Props {
  store: Store;
  item: ReportedItem;
  onBack: () => void;
}

export function Chat({ store, item, onBack }: Props) {
  const { show } = useToast();
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const current = store.items.find((i) => i.id === item.id) ?? item;
  const chatMessages = store.messages.filter((m) => m.itemId === current.id);
  const userName = store.currentUser?.name ?? 'You';

  const otherPerson =
    userName === current.reportedBy
      ? current.claimantName ?? 'Claimant'
      : current.reportedBy;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length]);

  function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    store.sendMessage(current.id, userName, text.trim());
    setText('');
  }

  function handleMarkReturned() {
    store.markReturned(current.id);
    show('Item marked as returned — case closed!', 'success');
    onBack();
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-2xl flex-col px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cream-200 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-navy-400 hover:text-navy-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg font-semibold text-navy-800">{current.name}</h1>
              <TypePill type={current.type} />
            </div>
            <p className="text-xs text-navy-400">
              Chat with <span className="font-medium text-navy-500">{otherPerson}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {current.status === 'returned' && (
            <button
              onClick={() => { store.deleteItem(current.id); onBack(); }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          )}
          {current.status !== 'returned' && (
            <button
              onClick={handleMarkReturned}
              className="inline-flex items-center gap-1.5 rounded-lg bg-sage-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-sage-600"
            >
              <Check className="h-3.5 w-3.5" />
              Mark returned
            </button>
          )}
        </div>
      </div>

      {/* Item context bar */}
      <div className="flex items-center gap-4 rounded-lg border border-cream-100 bg-cream-50 px-4 py-2.5 text-xs text-navy-400">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {current.location}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />{' '}
          {new Date(current.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto py-4">
        {chatMessages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-navy-400">No messages yet</p>
            <p className="mt-1 text-xs text-navy-300">
              Start the conversation to arrange how and where to return the item.
            </p>
          </div>
        ) : (
          chatMessages.map((msg) => {
            const isMe = msg.sender === userName;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2.5 ${
                    isMe
                      ? 'bg-navy-700 text-cream-50'
                      : 'bg-cream-100 text-navy-700'
                  }`}
                >
                  {!isMe && (
                    <p className="mb-0.5 text-xs font-semibold text-navy-400">{msg.sender}</p>
                  )}
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p
                    className={`mt-1 text-xs ${isMe ? 'text-cream-200/70' : 'text-navy-300'}`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-cream-200 py-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-lg border border-cream-300 bg-cream-50 px-4 py-2.5 text-sm text-navy-700 placeholder:text-navy-300 focus:border-navy-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-200"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
