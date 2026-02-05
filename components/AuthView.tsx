
import React, { useState, useEffect } from 'react';
import { db, UserDB } from '../database';
import { Language } from '../translations';
import { UserRole } from '../types';

interface AuthViewProps {
  onAuthSuccess: (user: UserDB) => void;
  onNavigateHome: () => void;
  language: Language;
  t: any;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess, onNavigateHome, language, t }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [otp, setOtp] = useState('');
  const [pendingUser, setPendingUser] = useState<UserDB | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (loginAttempts >= 5) {
      setError(language === 'en' ? 'Too many attempts. Locked for 30s.' : 'धेरै प्रयासहरू। ३० सेकेन्डको लागि लक गरियो।');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (isLogin) {
        const user = db.login(email, password);
        if (user) {
          // ARCHITECT NOTE: High-security simulation
          setPendingUser(user);
          setShow2FA(true);
          setLoading(false);
        } else {
          setLoginAttempts(prev => prev + 1);
          setError(language === 'en' ? 'Invalid email or password.' : 'गलत इमेल वा पासवर्ड।');
          setLoading(false);
        }
      } else {
        if (password.length < 8) {
          setError(language === 'en' ? 'Password must be 8+ characters' : 'पासवर्ड ८ अक्षर भन्दा बढी हुनुपर्छ');
          setLoading(false);
          return;
        }
        const newUser = db.register(email, password, name, UserRole.CUSTOMER);
        if (newUser) {
          onAuthSuccess(newUser);
        } else {
          setError(language === 'en' ? 'Email already registered' : 'इमेल पहिले नै दर्ता छ');
          setLoading(false);
        }
      }
    }, 1200);
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456') { // Mock OTP
      if (pendingUser) onAuthSuccess(pendingUser);
    } else {
      setError(language === 'en' ? 'Invalid Security Code' : 'गलत सुरक्षा कोड');
    }
  };

  if (show2FA) {
    return (
      <div className="flex-1 bg-[#f4f4f4] py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-sm shadow-2xl p-8 border-t-4 border-orange-500">
           <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">Two-Step Verification</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Enter code sent to your registered device</p>
           </div>
           
           <form onSubmit={handleVerify2FA} className="space-y-6">
              <input 
                type="text" 
                maxLength={6}
                placeholder="0 0 0 0 0 0"
                className="w-full border-b-4 border-gray-100 p-4 text-center text-4xl font-black tracking-[0.5em] focus:border-orange-500 outline-none transition-all text-gray-900"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g,''))}
                autoFocus
              />
              <p className="text-[10px] text-center text-gray-400 font-black uppercase tracking-widest">Default: 123456</p>
              <button type="submit" className="w-full bg-[#F85606] text-white font-black py-4 rounded-sm shadow-lg hover:bg-orange-600 transition-all uppercase tracking-[0.2em] text-xs">Verify & Login</button>
           </form>
           
           <button onClick={() => setShow2FA(false)} className="w-full mt-6 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-orange-500 transition-colors">Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#f4f4f4] py-8 md:py-16 px-4">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row bg-white rounded-sm shadow-xl overflow-hidden border border-gray-100 min-h-[550px]">
        {/* Left Side - Daraz Branding */}
        <div className="hidden md:flex md:w-5/12 bg-[#F85606] p-10 text-white flex-col justify-between relative overflow-hidden security-scan">
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-4 italic tracking-tighter">daraz<span className="text-white/60">clone</span></h2>
            <div className="w-12 h-1 bg-white mb-8"></div>
            <h3 className="text-2xl font-bold leading-tight mb-4">
              {isLogin ? "Encrypted Access" : "Secure Registration"}
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Your connection is protected by 256-bit SSL encryption. We take security seriously.
            </p>
          </div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest bg-white/10 p-3 rounded-sm border border-white/10">
              <span className="text-lg">🔒</span> Hardware MFA Ready
            </div>
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest bg-white/10 p-3 rounded-sm border border-white/10">
              <span className="text-lg">🛡️</span> Fraud Protection Active
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
                {isLogin ? t.login : t.signup}
              </h3>
              <p className="text-[11px] text-gray-500 font-black uppercase tracking-widest mt-1">
                {isLogin ? "Protected Session" : "Create Secure Account"}
              </p>
            </div>
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }} 
              className="text-[#F85606] text-xs font-black uppercase tracking-widest hover:underline transition-all"
            >
              {isLogin ? t.signup : t.login}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-[13px] font-bold border-l-4 border-red-500 rounded-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-[11px] font-black text-gray-600 uppercase tracking-widest mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-gray-200 border-2 px-4 py-3 rounded-sm focus:border-orange-500 outline-none transition-all font-bold"
                />
              </div>
            )}
            <div>
              <label className="block text-[11px] font-black text-gray-600 uppercase tracking-widest mb-1.5">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-gray-200 border-2 px-4 py-3 rounded-sm focus:border-orange-500 outline-none transition-all font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-600 uppercase tracking-widest mb-1.5">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-gray-200 border-2 px-4 py-3 rounded-sm focus:border-orange-500 outline-none transition-all font-bold"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#F85606] text-white font-black py-4 rounded-sm shadow-lg hover:bg-orange-600 transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-70"
            >
              {loading ? "AUTHENTICATING..." : (isLogin ? t.login : t.signup)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
