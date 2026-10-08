import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { isSupabaseConfigured, requireSupabase } from '@/lib/supabase';

interface PublicAssistantSettings {
  assistant_name: string;
  welcome_message: string;
  fallback_message: string;
  is_enabled: boolean;
}

interface ChatMessage {
  role: 'assistant' | 'user';
  text: string;
}

export default function AssistantWidget() {
  const location = useLocation();
  const [settings, setSettings] = useState<PublicAssistantSettings | null>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;

    void (async () => {
      try {
        const { data } = await requireSupabase()
          .from('assistant_settings')
          .select('assistant_name,welcome_message,fallback_message,is_enabled')
          .eq('id', 1)
          .maybeSingle();
        if (!active || !data?.is_enabled) return;
        const nextSettings = data as PublicAssistantSettings;
        setSettings(nextSettings);
        setMessages([{ role: 'assistant', text: nextSettings.welcome_message || 'Hi, how can I help?' }]);
      } catch {
        // Assistant stays hidden when Supabase is unavailable.
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, open]);

  if (location.pathname.startsWith('/dashboard') || !settings) return null;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setQuestion('');
    setLoading(true);
    setMessages((current) => [...current, { role: 'user', text: trimmed }]);
    setMessages((current) => [
      ...current,
      {
        role: 'assistant',
        text: settings.fallback_message || 'Please book a consultation and our team will help you.',
      },
    ]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <section className="w-[calc(100vw-2.5rem)] max-w-[380px] overflow-hidden rounded-[18px] border border-background-300 bg-background-50 shadow-2xl">
          <div className="flex items-start justify-between gap-4 bg-primary-900 px-5 py-4 text-background-50">
            <div>
              <p className="text-sm font-semibold">{settings.assistant_name || 'College assistant'}</p>
              <p className="mt-1 text-xs text-background-200">Ask about programmes, courses, funding and events.</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full p-1 hover:bg-background-50/10" aria-label="Close assistant">
              <i className="ri-close-line text-xl" />
            </button>
          </div>

          <div className="max-h-[360px] space-y-3 overflow-y-auto bg-background-100 px-4 py-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p className={`max-w-[85%] rounded-[14px] px-4 py-3 text-sm leading-relaxed ${message.role === 'user' ? 'bg-primary-800 text-background-50' : 'bg-background-50 text-foreground-800 shadow-sm'}`}>
                  {message.text}
                </p>
              </div>
            ))}
            {loading && <p className="text-sm text-foreground-500">Thinking...</p>}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={submit} className="flex gap-2 border-t border-background-300 bg-background-50 p-3">
            <input value={question} onChange={(event) => setQuestion(event.target.value)} className="min-w-0 flex-1 rounded-full border border-background-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none" placeholder="Ask a question" />
            <button disabled={loading || !question.trim()} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-800 text-background-50 hover:bg-primary-900 disabled:opacity-50" aria-label="Send question">
              <i className="ri-send-plane-2-line" />
            </button>
          </form>
        </section>
      )}

      <button type="button" onClick={() => setOpen((current) => !current)} className="inline-flex h-14 items-center gap-3 rounded-full bg-primary-900 px-5 text-sm font-semibold text-background-50 shadow-2xl transition-transform hover:-translate-y-0.5" aria-label="Open assistant">
        <i className="ri-sparkling-2-line text-xl text-accent-400" />
        Assistant
      </button>
    </div>
  );
}
