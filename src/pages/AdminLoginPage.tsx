import React, { useState } from 'react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle2,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

interface AdminLoginPageProps {
  onNavigate: (route: PageRoute) => void;
  onLoginSuccess: (token: string, user: { id: string; email: string; name: string; role: string }) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [accessDeniedMsg, setAccessDeniedMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resetMsg, setResetMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setAccessDeniedMsg('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMsg(language === 'ta' ? 'நிர்வாகி மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்.' : 'Please enter both administrative email and password.');
      return;
    }

    setLoading(true);

    try {
      // 1. Authenticate with Firebase Email/Password Authentication
      let firebaseIdToken = '';
      try {
        const userCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        firebaseIdToken = await userCred.user.getIdToken();
      } catch (fbErr: any) {
        console.warn('Direct Firebase Auth sign-in note:', fbErr.code, fbErr.message);
        // If invalid credential, check with backend
        if (fbErr.code === 'auth/wrong-password' || fbErr.code === 'auth/invalid-credential' || fbErr.code === 'auth/user-not-found') {
          // Verify with server endpoint directly
        }
      }

      // 2. Server-side Administrator Authorization Check
      const response = await fetch('/api/admin/firebase-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password,
          idToken: firebaseIdToken
        })
      });

      const data = await response.json();

      if (response.status === 403 || data.code === 'ACCESS_DENIED') {
        setAccessDeniedMsg(
          data.message || (language === 'ta'
            ? 'அணுகல் மறுக்கப்பட்டது: இந்த கணக்கிற்கு நிர்வாகி அனுமதி இல்லை.'
            : 'Access Denied: Your account does not have authorized administrator privileges for RUBI TECH PARK CRM.')
        );
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setErrorMsg(data.message || (language === 'ta' ? 'அங்கீகாரம் தோல்வியடைந்தது. நற்சான்றிதழ்களைச் சரிபார்க்கவும்.' : 'Authentication failed. Please verify your administrator credentials.'));
        setLoading(false);
        return;
      }

      // Store tokens in sessionStorage
      sessionStorage.setItem('rtp_admin_token', data.token);
      sessionStorage.setItem('edh_admin_token', data.token);
      sessionStorage.setItem('rtp_admin_user', JSON.stringify(data.user));
      sessionStorage.setItem('edh_admin_user', JSON.stringify(data.user));

      onLoginSuccess(data.token, data.user);
      onNavigate('admin-dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg(language === 'ta' ? 'அங்கீகார சேவையுடன் இணைப்பதில் பிழை ஏற்பட்டது.' : 'Network error connecting to administrative authentication service.');
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;

    setResetStatus('loading');
    setResetMsg('');

    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      setResetStatus('success');
      setResetMsg(
        language === 'ta'
          ? 'கடவுச்சொல் மீட்டமைப்பு இணைப்பு உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்டது. உங்கள் இன்பாக்ஸைச் சரிபார்க்கவும்.'
          : 'A secure password reset link has been dispatched to your administrator email. Please check your inbox.'
      );
    } catch (err: any) {
      console.error('Password reset error:', err);
      setResetStatus('error');
      setResetMsg(
        err.message || (language === 'ta'
          ? 'மீட்டமைப்பு மின்னஞ்சலை அனுப்ப முடியவில்லை. மின்னஞ்சல் முகவரியைச் சரிபார்க்கவும்.'
          : 'Unable to dispatch reset email. Please ensure the email address is registered.')
      );
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-[#FAFBFF] dark:bg-[#070B14]">
      <div className="max-w-md w-full bg-white dark:bg-[#0D1527] border border-[#E5E9F2] dark:border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative transition-colors">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs text-[#647087] hover:text-[#172033] dark:hover:text-white transition-colors flex items-center gap-1.5 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'ta' ? 'முகப்பு பக்கத்திற்கு திரும்புக' : 'Back to Agency Website'}</span>
        </button>

        <div className="text-center space-y-3 mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#D4AF37]/50 mx-auto shadow-md bg-black flex items-center justify-center">
            <img
              src="/assets/aistudio/Ruby_Tech_Park_Luxury_Emblem_3b5d2b3d.png"
              alt="RUBI TECH PARK Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold font-display text-[#172033] dark:text-white">
            {t.admin.loginTitle}
          </h1>
          <p className="text-xs text-[#647087] dark:text-slate-400">
            {language === 'ta'
              ? 'Firebase Auth & Cloud Firestore மூலம் பாதுகாக்கப்பட்ட நிர்வாக கட்டுப்பாட்டகம்'
              : 'Secured via Firebase Authentication & Cloud Firestore (Zero-Trust RBAC)'}
          </p>
        </div>

        {/* Access Denied Warning */}
        {accessDeniedMsg && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-500/40 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{language === 'ta' ? 'அணுகல் மறுக்கப்பட்டது' : 'Access Denied'}</p>
              <p className="mt-0.5 leading-relaxed">{accessDeniedMsg}</p>
            </div>
          </div>
        )}

        {/* Standard Error Message */}
        {errorMsg && (
          <div className="mb-6 p-3 bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-500/40 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#172033] dark:text-slate-300 uppercase tracking-wider mb-1.5">
              {t.admin.emailLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#647087] dark:text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rubitechpark.com"
                required
                className="w-full bg-[#FAFBFF] dark:bg-[#070B14] border border-[#E5E9F2] dark:border-slate-700 focus:border-[#6654E8] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#172033] dark:text-white placeholder-[#647087] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#172033] dark:text-slate-300 uppercase tracking-wider">
                {t.admin.passwordLabel}
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email || 'admin@rubitechpark.com');
                  setShowForgotModal(true);
                }}
                className="text-[11px] text-[#6654E8] dark:text-[#9689FF] hover:underline font-medium cursor-pointer"
              >
                {language === 'ta' ? 'கடவுச்சொல் மறந்துவிட்டதா?' : 'Forgot Password?'}
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#647087] dark:text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#FAFBFF] dark:bg-[#070B14] border border-[#E5E9F2] dark:border-slate-700 focus:border-[#6654E8] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#172033] dark:text-white placeholder-[#647087] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#647087] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#6654E8] via-[#5B48E6] to-[#4388FF] hover:opacity-95 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>{language === 'ta' ? 'சரிபார்க்கப்படுகிறது...' : 'Verifying with Firebase...'}</span>
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

        <div className="mt-8 pt-4 border-t border-[#E5E9F2] dark:border-slate-800 text-[11px] text-[#647087] dark:text-slate-400 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-[#172033] dark:text-slate-300 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>RUBI TECH PARK · Firebase CRM Admin Console</span>
          </div>
          <p>
            {language === 'ta'
              ? 'நிர்வாக மின்னஞ்சல்: admin@rubitechpark.com | அங்கீகரிக்கப்பட்ட பயனர் சரிபார்ப்பு இயக்கத்தில் உள்ளது.'
              : 'Authorized Admin Account: admin@rubitechpark.com | Server-side role enforcement active.'}
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="max-w-sm w-full bg-white dark:bg-[#0D1527] border border-[#E5E9F2] dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#172033] dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#6654E8]" />
                <span>{language === 'ta' ? 'கடவுச்சொல் மீட்டமைப்பு' : 'Firebase Password Reset'}</span>
              </h3>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setResetStatus('idle');
                  setResetMsg('');
                }}
                className="text-[#647087] hover:text-[#172033] dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#647087] dark:text-slate-400 leading-relaxed">
              {language === 'ta'
                ? 'உங்கள் பதிவு செய்யப்பட்ட நிர்வாகி மின்னஞ்சல் முகவரியை உள்ளிடவும். கடவுச்சொல்லை மாற்ற Firebase Auth இணைப்பு அனுப்பப்படும்.'
                : 'Enter your registered administrator email address. A password reset link will be dispatched via Firebase Authentication.'}
            </p>

            {resetStatus === 'success' ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{resetMsg}</span>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-3">
                {resetStatus === 'error' && (
                  <div className="p-2.5 bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-500/40 rounded-xl text-xs text-rose-700 dark:text-rose-300">
                    {resetMsg}
                  </div>
                )}
                <div>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@rubitechpark.com"
                    required
                    className="w-full bg-[#FAFBFF] dark:bg-[#070B14] border border-[#E5E9F2] dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-[#172033] dark:text-white focus:outline-none focus:border-[#6654E8]"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 text-xs text-[#647087] hover:text-[#172033] dark:hover:text-white cursor-pointer"
                  >
                    {language === 'ta' ? 'ரத்து' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={resetStatus === 'loading'}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-[#6654E8] hover:bg-[#5B48E6] rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {resetStatus === 'loading' ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>{language === 'ta' ? 'இணைப்பு அனுப்பு' : 'Send Reset Link'}</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
