
import React, { useState } from 'react';
import { UserRole } from '../types';

interface AdminDashboardProps {
  t: any;
  userName: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ t, userName }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'copilot'>('overview');
  
  // Mock data for student queries
  const [queries] = useState([
    { id: '1', query: "How to calculate GPA?", count: 45, category: "General" },
    { id: '2', query: "Explain Quantum Mechanics in simple terms", count: 32, category: "Physics" },
    { id: '3', query: "What is the deadline for the final project?", count: 28, category: "Admin" },
    { id: '4', query: "How to balance chemical equations?", count: 25, category: "Chemistry" },
  ]);

  // Mock data for AI explanations to verify
  const [explanations, setExplanations] = useState([
    { 
      id: 'e1', 
      topic: "Mitosis", 
      explanation: "Mitosis is a type of cell division that results in two daughter cells each having the same number and kind of chromosomes as the parent nucleus.",
      status: 'pending',
      subject: 'Biology'
    },
    { 
      id: 'e2', 
      topic: "Supply and Demand", 
      explanation: "The law of supply and demand is a theory that explains the interaction between the sellers of a resource and the buyers for that resource.",
      status: 'approved',
      subject: 'Economics'
    }
  ]);

  const handleApprove = (id: string) => {
    setExplanations(prev => prev.map(e => e.id === id ? { ...e, status: 'approved' } : e));
  };

  const handleCorrect = (id: string) => {
    const correction = window.prompt(t.lang === 'ar' ? 'أدخل التصحيح:' : 'Enter correction:');
    if (correction) {
      setExplanations(prev => prev.map(e => e.id === id ? { ...e, explanation: correction, status: 'corrected' } : e));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-black tracking-tight">{t.adminPanel}</h1>
          <p className="text-gray-600 font-bold opacity-80">{t.welcome}, {userName} ({t.teacher})</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 border-b-2 border-brand-gray">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-4 font-black transition-all border-b-4 ${activeTab === 'overview' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-400'}`}
        >
          <i className="fa-solid fa-chart-pie mr-2"></i>
          {t.lang === 'ar' ? 'نظرة عامة' : 'Overview'}
        </button>
        <button 
          onClick={() => setActiveTab('copilot')}
          className={`px-6 py-4 font-black transition-all border-b-4 ${activeTab === 'copilot' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-400'}`}
        >
          <i className="fa-solid fa-robot mr-2"></i>
          {t.aiCopilot}
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[32px] border-2 border-brand-gray shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-brand-blue">
                <i className="fa-solid fa-users text-xl"></i>
              </div>
              <h3 className="font-black text-black uppercase text-xs tracking-widest">{t.lang === 'ar' ? 'الطلاب النشطون' : 'Active Students'}</h3>
            </div>
            <span className="text-5xl font-black text-black">1,248</span>
          </div>
          <div className="bg-white p-8 rounded-[32px] border-2 border-brand-gray shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                <i className="fa-solid fa-message text-xl"></i>
              </div>
              <h3 className="font-black text-black uppercase text-xs tracking-widest">{t.lang === 'ar' ? 'إجمالي المحادثات' : 'Total Conversations'}</h3>
            </div>
            <span className="text-5xl font-black text-black">8,432</span>
          </div>
          <div className="bg-white p-8 rounded-[32px] border-2 border-brand-gray shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-brand-red">
                <i className="fa-solid fa-circle-check text-xl"></i>
              </div>
              <h3 className="font-black text-black uppercase text-xs tracking-widest">{t.lang === 'ar' ? 'دقة الذكاء الاصطناعي' : 'AI Accuracy'}</h3>
            </div>
            <span className="text-5xl font-black text-black">94%</span>
          </div>
        </div>
      )}

      {activeTab === 'copilot' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Common Questions Section */}
          <div className="bg-white border-2 border-brand-gray rounded-[32px] p-8 shadow-sm">
            <h2 className="text-2xl font-black text-black mb-8 flex items-center gap-4">
              <i className="fa-solid fa-fire text-brand-red"></i>
              {t.commonQuestions}
            </h2>
            <div className="space-y-4">
              {queries.map((q, idx) => (
                <div key={q.id} className="flex items-center justify-between p-6 rounded-2xl border-2 border-brand-gray hover:border-brand-blue transition-all">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-black">{idx + 1}</span>
                    <div>
                      <h4 className="text-lg font-bold text-black">{q.query}</h4>
                      <p className="text-xs text-gray-400 font-black uppercase tracking-widest">{q.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-brand-blue">{q.count}</span>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.lang === 'ar' ? 'سؤال' : 'Queries'}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-blue-50 rounded-2xl border-2 border-brand-blue/20">
              <p className="text-sm font-bold text-brand-blue flex items-center gap-2">
                <i className="fa-solid fa-lightbulb"></i>
                {t.topQuery}: <span className="font-black underline">"{queries[0].query}"</span>
              </p>
            </div>
          </div>

          {/* AI Accuracy Check Section */}
          <div className="bg-white border-2 border-brand-gray rounded-[32px] p-8 shadow-sm">
            <h2 className="text-2xl font-black text-black mb-8 flex items-center gap-4">
              <i className="fa-solid fa-shield-check text-brand-blue"></i>
              {t.accuracyCheck}
            </h2>
            <div className="space-y-6">
              {explanations.map(exp => (
                <div key={exp.id} className="p-6 rounded-2xl border-2 border-brand-gray space-y-4 bg-gray-50/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-black text-black">{exp.topic}</h4>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{exp.subject}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 ${
                      exp.status === 'approved' ? 'bg-green-50 border-green-500 text-green-600' :
                      exp.status === 'corrected' ? 'bg-blue-50 border-brand-blue text-brand-blue' :
                      'bg-yellow-50 border-yellow-500 text-yellow-600'
                    }`}>
                      {exp.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-600 leading-relaxed italic">
                    "{exp.explanation}"
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => handleApprove(exp.id)}
                      disabled={exp.status === 'approved'}
                      className="flex-1 bg-green-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                      <i className="fa-solid fa-check mr-2"></i>
                      {t.upvote}
                    </button>
                    <button 
                      onClick={() => handleCorrect(exp.id)}
                      className="flex-1 bg-black text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:opacity-90 transition-all"
                    >
                      <i className="fa-solid fa-pen mr-2"></i>
                      {t.correct}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-gray-100 rounded-2xl border-2 border-brand-gray text-center">
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
                {t.behindTheScenes}
              </p>
              <p className="text-sm font-bold text-black mt-2">
                {t.lang === 'ar' ? 'تأكد من أن المساعد الذكي يتوافق مع أسلوبك في التدريس.' : 'Ensure the AI assistant aligns perfectly with your teaching style.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
