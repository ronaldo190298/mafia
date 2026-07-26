import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { useGame } from '../context/GameContext';

export default function ChatPanel({ channel = 'public', disabled, placeholder, title, subtitle }) {
  const { state, actions } = useGame();
  const [text, setText] = useState('');
  const listRef = useRef(null);
  const typingTimeout = useRef(null);

  const messages = (state?.messages || []).filter((m) => m.channel === channel);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const submit = async (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value || disabled) return;
    setText('');
    actions.typing(false);
    await actions.sendChat(value, channel);
  };

  const onChange = (e) => {
    setText(e.target.value);
    if (disabled) return;
    actions.typing(true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => actions.typing(false), 1500);
  };

  const typing = (state?.typing || []).filter((n) => n !== state?.you?.name);

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border border-white/10 bg-night-800/60">
      {title && (
        <div className="border-b border-white/10 px-4 py-2.5">
          <p className="text-sm font-semibold text-white">{title}</p>
          {subtitle && <p className="text-xs text-white/40">{subtitle}</p>}
        </div>
      )}

      <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto p-3">
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-white/30">No messages yet.</p>
        )}
        {messages.map((m) => {
          const mine = m.authorId && m.authorId === state?.you?.id;
          if (m.system) {
            return (
              <p
                key={m.id}
                className="mx-auto w-fit rounded-full bg-white/5 px-3 py-1 text-center text-xs italic text-gold-400/80"
              >
                {m.text}
              </p>
            );
          }
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  mine ? 'bg-blood-600/25 text-white' : 'bg-white/[0.06] text-white/90'
                }`}
              >
                {!mine && <p className="text-[11px] font-semibold text-white/45">{m.author}</p>}
                <p className="whitespace-pre-wrap break-words">{m.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-5 px-4 text-[11px] italic text-white/35">
        {typing.length > 0 &&
          `${typing.slice(0, 3).join(', ')} ${typing.length > 1 ? 'are' : 'is'} typing...`}
      </div>

      <form onSubmit={submit} className="flex items-center gap-2 border-t border-white/10 p-2">
        <input
          value={text}
          onChange={onChange}
          disabled={disabled}
          maxLength={300}
          placeholder={disabled ? placeholder || 'Chat is closed' : placeholder || 'Say something...'}
          className="min-w-0 flex-1 rounded-lg bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blood-500/40 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="grid size-9 shrink-0 place-items-center rounded-lg bg-blood-600 text-white transition hover:bg-blood-500 disabled:opacity-40"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}
