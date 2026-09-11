import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Sparkles, ExternalLink } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useCart } from '../../context/CartContext';
import { HEALTH_NEEDS } from '../../data/healthNeeds';

// A handful of the 8 needs work well as one-tap starter prompts — not all
// 8, to keep the chat's first screen uncluttered.
const QUICK_PROMPT_IDS = ['immunity_energy', 'joints_muscles', 'sleep_stress', 'gastro_digestion'];

/**
 * Local, rule-based symptom matcher — NOT a connected LLM. Scores each
 * health need by how many of its keywords appear in the user's message and
 * returns the best match (or null if nothing scored). Deliberately kept
 * client-side and dependency-free: wiring a real generative model in here
 * would mean shipping an API key in the browser bundle (a real security
 * risk) or standing up a backend proxy, neither of which this project has
 * today. See the chat's own disclaimer message for how this is framed to
 * users — it's honest about being a matcher, not a doctor or a live agent.
 */
function matchNeed(text) {
  const q = text.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const need of HEALTH_NEEDS) {
    const score = (need.keywords || []).reduce((acc, kw) => acc + (q.includes(kw) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = need;
    }
  }
  return bestScore > 0 ? best : null;
}

const greeting = (lang) => lang === 'uz'
  ? "Salom! Men BK Pharmacy yordamchisiman 🌿 Sizni nima bezovta qilyapti — uyqu, immunitet, bo'g'imlar, ovqat hazm qilish? Yozing yoki pastdan tanlang, mos preparatlarni topib beraman."
  : "Здравствуйте! Я помощник BK Pharmacy 🌿 Расскажите, что вас беспокоит — сон, иммунитет, суставы, пищеварение? Напишите словами или выберите ниже, подберу подходящие препараты.";

const disclaimer = (lang) => lang === 'uz'
  ? "Men shifokor emasman — bu shunchaki mahsulotlarni tanlashda yordam beruvchi yordamchiman. Jiddiy shikoyatlar bo'lsa, shifokorga murojaat qiling."
  : "Я не врач — просто помогаю сориентироваться в каталоге. При серьёзных жалобах, пожалуйста, обратитесь к врачу.";

export const ChatConsultant = ({ products = [], contacts = {} }) => {
  const { lang } = useTranslation();
  const { setSelectedProduct } = useCart();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => [
    { id: 'm-greet', sender: 'bot', text: greeting(lang) }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const idRef = useRef(1);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  const nextId = () => `m-${idRef.current++}`;

  const respondToNeed = (need) => {
    const matches = products
      .filter((p) => p.category_id === need.id)
      .sort((a, b) => (b.rating * b.reviews_count) - (a.rating * a.reviews_count))
      .slice(0, 3);

    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      if (matches.length > 0) {
        const text = lang === 'uz'
          ? `"${need.shortTitle_uz}" yo'nalishi bo'yicha mos preparatlar:`
          : `По направлению «${need.shortTitle_ru}» подойдут:`;
        setMessages((prev) => [...prev, { id: nextId(), sender: 'bot', text, products: matches }]);
      } else {
        const text = lang === 'uz'
          ? "Hozircha bu yo'nalishda katalogda preparat topilmadi. Konsultant bilan bog'laning — yordam beradi."
          : "По этому направлению в каталоге пока пусто. Напишите нашему консультанту — поможет подобрать.";
        setMessages((prev) => [...prev, { id: nextId(), sender: 'bot', text, escalate: true }]);
      }
    }, 500 + Math.random() * 300);
  };

  const handleQuickPrompt = (need) => {
    setMessages((prev) => [...prev, { id: nextId(), sender: 'user', text: lang === 'uz' ? need.shortTitle_uz : need.shortTitle_ru }]);
    respondToNeed(need);
  };

  const handleSend = (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: nextId(), sender: 'user', text }]);
    setInput('');

    const need = matchNeed(text);
    if (need) {
      respondToNeed(need);
    } else {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        const t = lang === 'uz'
          ? "Buni aniq tushunmadim. Quyidagi yo'nalishlardan birini tanlang yoki bevosita konsultantga yozing:"
          : "Не совсем поняла запрос. Выберите одно из направлений ниже, или напишите напрямую консультанту:";
        setMessages((prev) => [...prev, { id: nextId(), sender: 'bot', text: t, escalate: true }]);
      }, 500);
    }
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lift flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
        aria-label={open ? (lang === 'uz' ? "Chatni yopish" : "Закрыть чат") : (lang === 'uz' ? "Konsultant bilan chat" : "Чат с консультантом")}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          </motion.span>
        </AnimatePresence>
        {!open && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 z-40 sm:w-96 h-[75vh] sm:h-[560px] max-h-[640px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-emerald-600 text-white p-4 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm truncate">
                  {lang === 'uz' ? "BK Pharmacy yordamchisi" : "Помощник BK Pharmacy"}
                </div>
                <div className="text-[11px] text-emerald-50/90 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  {lang === 'uz' ? "Preparat tanlashda yordam" : "Подбор препаратов"}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8faf9]">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] space-y-2`}>
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-emerald-600 text-white rounded-br-sm'
                          : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-xs'
                      }`}
                    >
                      {m.text}
                    </div>

                    {m.products && (
                      <div className="space-y-2">
                        {m.products.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedProduct(p)}
                            className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all text-left cursor-pointer"
                          >
                            <img
                              src={p.image_url}
                              alt={lang === 'uz' ? p.name_uz : p.name_ru}
                              className="w-10 h-10 rounded-lg object-contain bg-slate-50 border border-slate-100 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-slate-900 truncate">
                                {lang === 'uz' ? p.name_uz : p.name_ru}
                              </div>
                              <div className="text-[11px] text-emerald-700 font-bold">
                                {Number(p.price).toLocaleString()} {lang === 'uz' ? "so'm" : "сум"}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {m.escalate && contacts?.telegram_url && (
                      <a
                        href={contacts.telegram_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors"
                      >
                        <span>{lang === 'uz' ? "Konsultantga yozish" : "Написать консультанту"}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white border border-slate-200 flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-slate-400"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick prompts */}
            <div className="px-3 pt-2 pb-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 border-t border-slate-100">
              {QUICK_PROMPT_IDS.map((id) => {
                const need = HEALTH_NEEDS.find((n) => n.id === id);
                if (!need) return null;
                return (
                  <button
                    key={id}
                    onClick={() => handleQuickPrompt(need)}
                    className="shrink-0 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-[11px] font-bold text-slate-600 hover:text-emerald-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {lang === 'uz' ? need.shortTitle_uz : need.shortTitle_ru}
                  </button>
                );
              })}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-100 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === 'uz' ? "Savolingizni yozing..." : "Напишите ваш вопрос..."}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                aria-label={lang === 'uz' ? "Yuborish" : "Отправить"}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="px-4 pb-2.5 text-[10px] text-slate-400 leading-tight shrink-0">
              {disclaimer(lang)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
