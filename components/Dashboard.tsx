
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Subject, StudySession, SubjectDifficulty } from '../types';

interface DashboardProps {
  t: any;
  userName: string;
  subjects: Subject[];
}

const Dashboard: React.FC<DashboardProps> = ({ t, userName, subjects }) => {
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    // Generate some sessions based on subjects if none exist
    return [
      { id: 's1', subjectId: '1', subjectName: subjects[0]?.name || 'Study Session', date: new Date().toISOString().split('T')[0], durationMinutes: 60, completed: false },
    ];
  });

  const progress = Math.round((sessions.filter(s => s.completed).length / sessions.length) * 100) || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-black tracking-tight">{t.welcome}, {userName}</h1>
          <p className="text-gray-600 font-bold opacity-80">{t.tagline}</p>
        </div>
        <Link 
          to="/planner" 
          className="bg-brand-blue text-white px-8 py-4 rounded-2xl font-black hover:opacity-90 transition-all shadow-xl flex items-center gap-3 justify-center"
        >
          <i className="fa-solid fa-plus"></i> {t.addSubject}
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon="fa-graduation-cap" label={t.dailyGoal} value={`${progress}%`} color="brand-blue" progress={progress} />
        <StatCard icon="fa-clock-rotate-left" label={t.hoursStudied} value="12.5" color="brand-red" sub="this week" />
        <StatCard icon="fa-fire" label={t.streak} value="5 Days" color="green-600" sub="+20%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border-2 border-brand-gray rounded-[32px] p-8 shadow-sm">
          <h2 className="text-2xl font-black text-black mb-8 flex items-center gap-4">
            <i className="fa-solid fa-calendar-day text-brand-blue"></i>
            {t.schedule}
          </h2>
          <div className="space-y-4">
            {sessions.map(session => (
              <div key={session.id} className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${session.completed ? 'bg-gray-50 border-gray-100 opacity-60' : 'border-brand-gray bg-white'}`}>
                <div className="flex items-center gap-6">
                  <button 
                    className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${session.completed ? 'bg-brand-blue border-brand-blue text-white' : 'border-brand-gray bg-white'}`}
                    onClick={() => setSessions(sessions.map(s => s.id === session.id ? {...s, completed: !s.completed} : s))}
                  >
                    {session.completed && <i className="fa-solid fa-check"></i>}
                  </button>
                  <div>
                    <h4 className={`text-xl font-bold ${session.completed ? 'text-gray-400 line-through' : 'text-black'}`}>{session.subjectName}</h4>
                    <p className="text-sm text-gray-500 font-black">{session.durationMinutes} mins</p>
                  </div>
                </div>
                {!session.completed && (
                  <Link to="/timer" className="bg-brand-blue text-white px-6 py-3 rounded-xl font-black shadow-lg hover:opacity-90">
                    {t.startSession}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border-2 border-brand-gray rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center gap-3 text-brand-red mb-8">
              <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
              <h2 className="text-xl font-black">{t.examCountdown}</h2>
            </div>
            <div className="space-y-6">
              {subjects.map(subject => {
                const daysLeft = Math.ceil((new Date(subject.examDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                const isEmergency = daysLeft <= 7;
                return (
                  <div key={subject.id} className="space-y-3">
                    <div className="flex justify-between items-center font-black">
                      <span className="text-black">{subject.name}</span>
                      <span className={`px-4 py-1 rounded-xl text-xs border-2 ${isEmergency ? 'border-brand-red text-brand-red' : 'border-brand-blue text-brand-blue'}`}>
                        {daysLeft} {t.daysLeft}
                      </span>
                    </div>
                    {isEmergency && (
                      <div className="bg-red-50 border-2 border-brand-red p-4 rounded-2xl text-brand-red">
                        <p className="font-black text-sm flex items-center gap-2 uppercase">
                          <i className="fa-solid fa-bolt"></i> {t.emergency}
                        </p>
                        <button className="mt-3 w-full bg-brand-red text-white py-3 rounded-xl font-black uppercase text-xs shadow-lg">
                          {t.activatePlan}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white border-2 border-brand-gray rounded-[32px] p-8 shadow-sm">
            <h3 className="text-lg font-black text-black mb-6 flex items-center gap-3">
              <i className="fa-solid fa-bell text-brand-blue"></i>
              {t.notifications}
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-blue-50 rounded-2xl border-2 border-brand-blue/20">
                <i className="fa-solid fa-circle-info text-brand-blue mt-1"></i>
                <p className="text-sm font-bold text-black">
                  {t.lang === 'ar' ? 'تذكر مراجعة مادة ' : 'Remember to review '} 
                  {subjects[0]?.name || (t.lang === 'ar' ? 'موادك' : 'your courses')}
                </p>
              </div>
              <div className="flex gap-4 p-4 bg-green-50 rounded-2xl border-2 border-green-200">
                <i className="fa-solid fa-circle-check text-green-600 mt-1"></i>
                <p className="text-sm font-bold text-black">
                  {t.lang === 'ar' ? 'أحسنت! لقد أكملت هدف اليوم.' : 'Great job! You completed today\'s goal.'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-brand-gray rounded-[32px] p-8 shadow-sm text-center">
             <h3 className="text-lg font-black text-black mb-6">{t.badges}</h3>
             <div className="flex justify-center gap-4">
               <Badge icon="fa-sun" color="brand-blue" />
               <Badge icon="fa-bolt" color="brand-red" />
               <Badge icon="fa-lock" color="gray-300" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, progress, sub }: any) => (
  <div className="bg-white p-8 rounded-[32px] border-2 border-brand-gray shadow-sm space-y-4">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl bg-${color}/10 flex items-center justify-center text-${color}`}>
        <i className={`fa-solid ${icon} text-xl`}></i>
      </div>
      <h3 className="font-black text-black uppercase text-xs tracking-widest">{label}</h3>
    </div>
    <div className="flex items-end justify-between">
      <span className="text-5xl font-black text-black">{value}</span>
      {progress !== undefined ? (
        <div className="w-24 h-3 bg-gray-100 rounded-full overflow-hidden border-2 border-brand-gray">
          <div className="h-full bg-brand-blue" style={{ width: `${progress}%` }}></div>
        </div>
      ) : <span className="text-gray-500 font-black text-sm">{sub}</span>}
    </div>
  </div>
);

const Badge = ({ icon, color }: any) => (
  <div className={`w-14 h-14 bg-${color}/5 border-2 border-${color} rounded-full flex items-center justify-center text-${color} text-xl shadow-inner`}>
    <i className={`fa-solid ${icon}`}></i>
  </div>
);

export default Dashboard;
