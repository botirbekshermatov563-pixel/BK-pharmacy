import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n';
import { ShieldCheck, Lock, Mail, ArrowLeft, AlertCircle } from 'lucide-react';

export const AdminLogin = ({ onBackToSite }) => {
  const { lang, t } = useTranslation();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@bk-pharmacy.uz');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || (lang === 'uz' ? 'Kirishda xatolik yuz berdi' : 'Ошибка авторизации'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center p-4">
      
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-emerald-900/30 space-y-6 relative">
        
        {/* Back button */}
        <button
          onClick={onBackToSite}
          className="absolute top-6 left-6 text-slate-400 hover:text-slate-700 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'uz' ? "Saytga qaytish" : "На сайт"}</span>
        </button>

        {/* Header */}
        <div className="text-center pt-4 space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-display tracking-tight">
            {t('admin_title')}
          </h2>
          <p className="text-xs text-slate-500">
            {t('admin_login_subtitle')}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {lang === 'uz' ? "Parol" : "Пароль"}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (lang === 'uz' ? "Kirilmoqda..." : "Вход...") : t('admin_login_btn')}
          </button>
        </form>

        {/* Demo credentials hint */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
          <div className="font-semibold text-slate-700">
            {lang === 'uz' ? "Демо-kirish ma'lumotlari:" : "Демо-доступ для проверки:"}
          </div>
          <div>Email: <code className="text-emerald-700 font-mono">admin@bk-pharmacy.uz</code></div>
          <div>Пароль: <code className="text-emerald-700 font-mono">admin123</code></div>
        </div>

      </div>

    </div>
  );
};
