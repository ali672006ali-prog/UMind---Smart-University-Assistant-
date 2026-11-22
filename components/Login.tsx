
import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (name: string, role: UserRole) => void;
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
  t: any;
}

const Login: React.FC<LoginProps> = ({ onLogin, lang, setLang, t }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === UserRole.TEACHER) {
      // Default teacher password
      if (password !== '123456') {
        setError(t.invalidPassword);
        return;
      }
    }

    if (name.trim()) onLogin(name, role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center login-gradient p-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-md w-full bg-white border-2 border-brand-gray rounded-[40px] p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-500">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-brand-blue rounded-3xl flex items-center justify-center text-white text-4xl font-black mx-auto shadow-lg">
            U
          </div>
          <h1 className="text-4xl font-black text-black tracking-tight">{t.loginTitle}</h1>
          <p className="text-gray-500 font-bold">{t.loginSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4 p-2 bg-gray-100 rounded-2xl">
            <button
              type="button"
              onClick={() => { setRole(UserRole.STUDENT); setError(''); }}
              className={`flex-1 py-3 rounded-xl font-black transition-all ${role === UserRole.STUDENT ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-400'}`}
            >
              <i className="fa-solid fa-user-graduate mr-2"></i>
              {t.student}
            </button>
            <button
              type="button"
              onClick={() => { setRole(UserRole.TEACHER); setError(''); }}
              className={`flex-1 py-3 rounded-xl font-black transition-all ${role === UserRole.TEACHER ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-400'}`}
            >
              <i className="fa-solid fa-chalkboard-user mr-2"></i>
              {t.teacher}
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">
              {role === UserRole.STUDENT ? t.studentName : t.lang === 'ar' ? 'اسم المعلم' : 'Teacher Name'}
            </label>
            <input
              type="text"
              required
              placeholder="..."
              className="w-full p-4 rounded-2xl text-lg font-bold border-2 border-brand-gray focus:border-brand-blue outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {role === UserRole.TEACHER && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">{t.password}</label>
              <input
                type="password"
                required
                placeholder="••••••"
                className="w-full p-4 rounded-2xl text-lg font-bold border-2 border-brand-gray focus:border-brand-blue outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm font-black text-center animate-bounce">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-brand-blue text-white py-5 rounded-2xl text-xl font-black shadow-xl hover:scale-[1.02] transition-all"
          >
            {t.enter}
          </button>
        </form>

        <div className="flex justify-center gap-4 pt-4">
          <button 
            onClick={() => setLang('en')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${lang === 'en' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}
          >
            English
          </button>
          <button 
            onClick={() => setLang('ar')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${lang === 'ar' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}
          >
            العربية
          </button>
        </div>

        <div className="text-center pt-6 border-t border-brand-gray">
          <p className="text-sm font-bold text-brand-blue">{t.developer}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
