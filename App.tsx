
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Planner from './components/Planner';
import AIPartner from './components/AIPartner';
import Timer from './components/Timer';
import GPA from './components/GPA';
import Tasks from './components/Tasks';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import { translations } from './translations';
import { Subject, UserRole } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.STUDENT);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('unimind_subjects');
    return saved ? JSON.parse(saved) : [];
  });
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'info' | 'error' } | null>(null);

  const t = translations[lang];

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('unimind_subjects', JSON.stringify(subjects));
  }, [subjects]);

  const handleLogin = (name: string, role: UserRole) => {
    setUserName(name);
    setUserRole(role);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} lang={lang} setLang={setLang} t={t} />;
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <Navigation t={t} lang={lang} setLang={setLang} userRole={userRole} />
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={userRole === UserRole.TEACHER ? <Navigate to="/admin" /> : <Dashboard t={t} userName={userName} subjects={subjects} />} />
            <Route path="/admin" element={<AdminDashboard t={t} userName={userName} />} />
            <Route path="/planner" element={<Planner t={t} subjects={subjects} setSubjects={setSubjects} />} />
            <Route path="/tasks" element={<Tasks t={t} />} />
            <Route path="/ai-partner" element={<AIPartner t={t} />} />
            <Route path="/timer" element={<Timer t={t} />} />
            <Route path="/gpa" element={<GPA t={t} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        {notification && (
          <div className={`fixed bottom-8 right-8 z-[100] p-6 rounded-3xl shadow-2xl border-4 animate-in slide-in-from-bottom duration-300 ${
            notification.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
            notification.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
            'bg-blue-50 border-brand-blue text-brand-blue'
          }`}>
            <div className="flex items-center gap-4">
              <i className={`fa-solid ${
                notification.type === 'success' ? 'fa-circle-check' :
                notification.type === 'error' ? 'fa-circle-exclamation' :
                'fa-circle-info'
              } text-2xl`}></i>
              <p className="font-black text-lg">{notification.message}</p>
            </div>
          </div>
        )}
        <Footer t={t} userName={userName} userRole={userRole} showNotification={showNotification} />
      </div>
    </HashRouter>
  );
};

const Navigation = ({ t, lang, setLang, userRole }: { t: any, lang: string, setLang: any, userRole: UserRole }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = userRole === UserRole.TEACHER ? [
    { path: '/admin', label: t.adminPanel, icon: 'fa-gauge-high' },
    { path: '/ai-partner', label: t.aiPartner, icon: 'fa-robot' },
    { path: '/tasks', label: t.tasks, icon: 'fa-list-check' },
  ] : [
    { path: '/', label: t.dashboard, icon: 'fa-chart-line' },
    { path: '/planner', label: t.planner, icon: 'fa-calendar-days' },
    { path: '/tasks', label: t.tasks, icon: 'fa-list-check' },
    { path: '/ai-partner', label: t.aiPartner, icon: 'fa-robot' },
    { path: '/timer', label: t.timer, icon: 'fa-stopwatch' },
    { path: '/gpa', label: t.gpa, icon: 'fa-graduation-cap' },
  ];

  return (
    <nav className="bg-white border-b border-brand-gray sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center text-white font-black">U</div>
              <span className="text-2xl font-black tracking-tight text-black">{t.appName}</span>
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center space-x-2 rtl:space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 transition-all ${
                  location.pathname === item.path 
                    ? 'text-brand-blue bg-blue-50' 
                    : 'text-black hover:text-brand-blue hover:bg-gray-50'
                }`}
              >
                <i className={`fa-solid ${item.icon}`}></i>
                {item.label}
              </Link>
            ))}
            <button 
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="ml-4 rtl:mr-4 px-4 py-2 bg-black text-white rounded-xl text-sm font-black"
            >
              {lang === 'en' ? 'عربي' : 'EN'}
            </button>
          </div>

          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black p-2 rounded-xl border-2 border-brand-gray"
            >
              <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-brand-gray animate-in slide-in-from-top duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-4 rounded-xl text-base font-black flex items-center gap-4 ${
                  location.pathname === item.path 
                    ? 'text-brand-blue bg-blue-50' 
                    : 'text-black hover:bg-gray-50'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-6`}></i>
                {item.label}
              </Link>
            ))}
            <button 
              onClick={() => { setLang(lang === 'en' ? 'ar' : 'en'); setIsMenuOpen(false); }}
              className="w-full mt-4 py-4 bg-black text-white rounded-xl font-black"
            >
              {lang === 'en' ? 'التحويل للعربية' : 'Switch to English'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = ({ t, userName, userRole, showNotification }: { t: any, userName: string, userRole: UserRole, showNotification: any }) => {
  const [feedback, setFeedback] = useState('');

  const submitFeedback = () => {
    if (!feedback.trim()) return;
    const message = encodeURIComponent(`UniMind Feedback from ${userName} (${userRole}):\n\n${feedback}`);
    // Sending to Ali Abbas's number as requested
    window.open(`https://wa.me/201112890031?text=${message}`, '_blank');
    showNotification(t.lang === 'ar' ? 'جاري توجيهك لإرسال رأيك عبر واتساب...' : 'Redirecting to WhatsApp...', 'success');
    setFeedback('');
  };

  return (
    <footer className="bg-white border-t border-brand-gray mt-auto py-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="space-y-6 flex-1">
          <h3 className="text-3xl font-black text-black">{t.appName}</h3>
          <p className="text-lg font-bold text-gray-500 max-w-md">{t.tagline}</p>
          
          <div className="flex flex-col gap-4">
            <div className="p-6 bg-blue-50 rounded-3xl border-2 border-brand-blue/20 inline-block">
               <p className="text-sm font-black text-brand-blue uppercase tracking-widest mb-1">{userRole === UserRole.TEACHER ? t.teacher : t.student}</p>
               <p className="text-2xl font-black text-black">{userName}</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-3xl border-2 border-brand-gray space-y-4 max-w-md">
              <p className="text-sm font-black text-gray-500 uppercase tracking-widest">{t.feedback}</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={t.lang === 'ar' ? 'أخبرنا برأيك...' : 'Tell us what you think...'}
                  className="flex-grow p-3 rounded-xl border-2 border-brand-gray font-bold text-sm"
                />
                <button 
                  onClick={submitFeedback}
                  title={t.sendFeedback}
                  className="bg-brand-blue text-white px-4 py-3 rounded-xl font-black hover:scale-105 transition-all flex items-center gap-2"
                >
                  <i className="fa-brands fa-whatsapp text-lg"></i>
                  <span className="hidden sm:inline text-xs">{t.sendFeedback}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border-4 border-black p-8 rounded-[40px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full md:w-auto min-w-[320px]">
          <h4 className="text-xl font-black text-black mb-6 flex items-center gap-3">
            <i className="fa-solid fa-code text-brand-blue"></i>
            {t.developer}
          </h4>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Ali Abbas</p>
              <div className="flex gap-2">
                <a 
                  href="https://wa.me/01112890031" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-2xl font-black hover:scale-105 transition-all border-2 border-green-200 text-sm"
                >
                  <i className="fa-brands fa-whatsapp text-xl"></i>
                  <span>{t.whatsapp}</span>
                </a>
                <a 
                  href="https://www.facebook.com/share/17Lii8FfyF/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center gap-3 p-3 bg-blue-50 text-brand-blue rounded-2xl font-black hover:scale-105 transition-all border-2 border-brand-blue/20 text-sm"
                >
                  <i className="fa-brands fa-facebook text-xl"></i>
                  <span>{t.facebook}</span>
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Abdullah Fawzy</p>
              <a 
                href="https://wa.me/201030334685" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-green-50 text-green-700 rounded-2xl font-black hover:scale-105 transition-all border-2 border-green-200"
              >
                <i className="fa-brands fa-whatsapp text-2xl"></i>
                <span>{t.whatsapp}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default App;
