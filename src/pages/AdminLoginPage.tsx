import React, { useState } from 'react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';

interface AdminLoginPageProps {
  onNavigate: (route: PageRoute) => void;
  onLoginSuccess: (token: string, user: { id: string; email: string; name: string; role: string }) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg(language === 'ta' ? 'நிர்வாகி மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்.' : 'Please enter both administrative email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || (language === 'ta' ? 'அங்கீகாரம் தோல்வியடைந்தது. நற்சான்றிதழ்களைச் சரிபார்க்கவும்.' : 'Authentication failed. Please verify your administrator credentials.'));
        setLoading(false);
        return;
      }

      // Store token with both keys for cross-compatibility
      sessionStorage.setItem('rtp_admin_token', data.token);
      sessionStorage.setItem('edh_admin_token', data.token);
      sessionStorage.setItem('rtp_admin_user', JSON.stringify(data.user));
      sessionStorage.setItem('edh_admin_user', JSON.stringify(data.user));
      onLoginSuccess(data.token, data.user);
      onNavigate('admin-dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg(language === 'ta' ? 'அங்கீகார சேவையுடன் இணைப்பதில் பிழை ஏற்பட்டது.' : 'Network error connecting to administrative authentication service.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-[#0B132B] border border-[#D4AF37]/40 rounded-2xl p-8 shadow-2xl relative">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'ta' ? 'முகப்பு பக்கத்திற்கு திரும்புக' : 'Back to Agency Website'}</span>
        </button>

        <div className="text-center space-y-3 mb-8">
          <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#D4AF37]/50 mx-auto shadow-md bg-black flex items-center justify-center">
            <img
              src="/assets/aistudio/Ruby_Tech_Park_Luxury_Emblem_3b5d2b3d.png"
              alt="RUBI TECH PARK Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold font-display text-white">
            {t.admin.loginTitle}
          </h1>
          <p className="text-xs text-slate-400">
            {t.admin.loginSubtitle}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-950/80 border border-red-500/40 rounded-lg text-xs text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {t.admin.emailLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rubitechpark.com"
                required
                className="w-full bg-[#070B14] border border-slate-700 focus:border-[#D4AF37] rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {t.admin.passwordLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#070B14] border border-slate-700 focus:border-[#D4AF37] rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xs sm:text-sm font-semibold text-[#070B14] bg-gradient-to-r from-[#F3DC87] via-[#E5C158] to-[#D4AF37] hover:from-[#FFF0BD] hover:to-[#E5C158] rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#070B14]" />
                  <span>{language === 'ta' ? 'சரிபார்க்கப்படுகிறது...' : 'Verifying Credentials...'}</span>
                </>
              ) : (
                <>
                  <span>{t.admin.loginBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>RUBI TECH PARK · Secure RBAC Lead System</span>
          </div>
          <p>
            {language === 'ta'
              ? 'பொது பதிவு முடக்கப்பட்டுள்ளது. சர்வர் பாதுகாப்பு விதிகளால் கட்டுப்படுத்தப்படுகிறது.'
              : 'Public user registration is disabled. Administrator credentials are authenticated against server secrets.'}
          </p>
        </div>
      </div>
    </div>
  );
};
