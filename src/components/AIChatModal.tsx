import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User, RefreshCw } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const AIChatModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Namaste! 🙏 I am your HAKKIVEDA Tribal Botanical Advisor. How may I assist your hair wellness journey today?',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const newMsgs: ChatMessage[] = [...messages, { role: 'user', content: query }];
    setMessages(newMsgs);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs }),
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'HAKKIVEDA Tribal Gold Oil is crafted with 42 mountain herbs slow-cooked for 21 days in copper cauldrons over woodfire. You can apply it 3 times weekly before bed.',
          },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Our 42 Mountain Herbs formula is 100% natural and safe for all hair types. For direct personal assistance, you can also WhatsApp our Mysore team at +91 76195 36831.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] p-3.5 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center gap-2 font-bold font-sans text-xs gold-glow cursor-pointer"
          id="ai-advisor-fab"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="hidden sm:inline">AI Botanical Advisor</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/50 rounded-2xl shadow-2xl overflow-hidden font-sans flex flex-col h-[520px] animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="bg-[var(--brand-primary-dark)] border-b border-[var(--brand-gold)]/30 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-serif-luxury">HAKKIVEDA AI Advisor</h3>
                <span className="text-[10px] text-[var(--brand-gold)] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Tribal Hair Expert Active
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="bg-black/30 p-2 border-b border-white/10 flex gap-1.5 overflow-x-auto text-[10px]">
            {[
              'How to apply Tribal Gold Oil?',
              'Does it cure dandruff?',
              'Worldwide Shipping rates?',
              'Is it safe for colored hair?',
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="bg-[var(--brand-primary-dark)] text-slate-200 border border-white/20 px-2.5 py-1 rounded-full whitespace-nowrap hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)] transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[var(--brand-primary-dark)]/60">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                    HV
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-medium rounded-tr-none'
                      : 'bg-[var(--brand-primary-deep)] text-slate-100 border border-white/10 rounded-tl-none shadow-md'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[var(--brand-gold)] p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Consulting Ancient Herbal Texts...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-[var(--brand-primary-deep)] border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask your hair query..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-[var(--brand-primary-dark)] border border-white/20 rounded-full px-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[var(--brand-gold)]"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] p-2 rounded-full hover:bg-white transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
